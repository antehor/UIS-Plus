/* ==========================================================================
   UIS+ — background worker
   Two small jobs, both limited to is.stuba.sk:
   - the toolbar badge shows how many UIS messages are unread;
   - while you are signed in, UIS is opened quietly every few minutes so the
     server does not end the session for inactivity ("Stay signed in").
   Nothing is sent anywhere else, and nothing is submitted to UIS.
   ========================================================================== */

"use strict";

const ORIGIN = "https://is.stuba.sk";
const ALARM = "uis-keepalive";
const PERIOD_MINUTES = 5;
const DEFAULTS = { enabled: true, keepSignedIn: true, uisSession: null };

function settings() {
  return new Promise((resolve) => chrome.storage.local.get(DEFAULTS, resolve));
}

async function setBadge(count) {
  const text = count > 0 ? (count > 99 ? "99+" : String(count)) : "";
  await chrome.action.setBadgeBackgroundColor({ color: "#9b1237" });
  if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ color: "#ffffff" });
  await chrome.action.setBadgeText({ text });
}

async function remember(session) {
  await chrome.storage.local.set({ uisSession: { ...session, seenAt: Date.now() } });
  const { enabled } = await settings();
  await setBadge(enabled && session.signedIn ? session.unread : 0);
}

/* "#ema" in the UIS header reads "1 správ 26 dokumentov 0 úloh". */
function unreadFrom(html) {
  const at = html.search(/id=["']ema["']/i);
  if (at < 0) return 0;
  const text = html.slice(at, at + 2000).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
  const found = text.match(/(\d+)\s*(?:spr[áa]v|zpr[áa]v|message)/i);
  return found ? Number(found[1]) : 0;
}

async function ping() {
  const { enabled, keepSignedIn, uisSession } = await settings();
  if (!enabled || !keepSignedIn || !uisSession || !uisSession.signedIn) return;
  try {
    const lang = uisSession.lang === "cs" ? "cz" : (uisSession.lang || "sk");
    const response = await fetch(`${ORIGIN}/auth/?lang=${lang}`, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "text/html" }
    });
    if (!response.ok) return;
    const html = await response.text();
    /* Signed out on purpose, or the session already ended elsewhere: stop
       until a UIS page reports a signed-in session again. */
    const signedIn = !/id="loginform"|name="credential_0"/.test(html);
    await remember({ signedIn, unread: signedIn ? unreadFrom(html) : 0, lang: uisSession.lang });
  } catch (_) {
    /* Offline or UIS unavailable; the next alarm tries again. */
  }
}

function ensureAlarm() {
  chrome.alarms.get(ALARM, (alarm) => {
    if (!alarm) chrome.alarms.create(ALARM, { periodInMinutes: PERIOD_MINUTES, delayInMinutes: 1 });
  });
}

chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(() => {
  ensureAlarm();
  ping();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) ping();
});

chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (!message || message.type !== "uis-state") return false;
  if (!sender.url || !sender.url.startsWith(`${ORIGIN}/`)) return false;
  ensureAlarm();
  remember({ signedIn: Boolean(message.signedIn), unread: Number(message.unread) || 0, lang: message.lang })
    .then(() => reply({ ok: true }));
  return true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.enabled) return;
  settings().then(({ enabled, uisSession }) =>
    setBadge(enabled && uisSession && uisSession.signedIn ? uisSession.unread : 0));
});
