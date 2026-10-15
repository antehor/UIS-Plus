(function () {
  "use strict";

  const ORIGIN = "https://is.stuba.sk";
  const defaults = { enabled: true, theme: "system", keepSignedIn: true, uisPageLanguage: "sk" };

  const COPY = {
    sk: {
      subtitle: "STU UIS · predtým AIS+",
      unread: "Neprečítané správy",
      mailbox: "Pošta",
      enable: "Zapnúť UIS+",
      enableHint: "Moderné rozhranie pre is.stuba.sk",
      appearance: "Vzhľad",
      system: "Systém",
      light: "Svetlý",
      dark: "Tmavý",
      keep: "Zostať prihlásený",
      keepHint: "Udrží reláciu UIS, kým je prehliadač otvorený",
      none: "Žiadne neprečítané správy",
      signedOut: "Nie ste prihlásený do UIS.",
      signIn: "Prihlásiť sa",
      failed: "Poštu sa nepodarilo načítať.",
      more: (n) => `+ ďalšie (${n})`
    },
    cs: {
      subtitle: "STU UIS · dříve AIS+",
      unread: "Nepřečtené zprávy",
      mailbox: "Pošta",
      enable: "Zapnout UIS+",
      enableHint: "Moderní rozhraní pro is.stuba.sk",
      appearance: "Vzhled",
      system: "Systém",
      light: "Světlý",
      dark: "Tmavý",
      keep: "Zůstat přihlášen",
      keepHint: "Udrží relaci UIS, dokud je prohlížeč otevřený",
      none: "Žádné nepřečtené zprávy",
      signedOut: "Nejste přihlášeni do UIS.",
      signIn: "Přihlásit se",
      failed: "Poštu se nepodařilo načíst.",
      more: (n) => `+ další (${n})`
    },
    en: {
      subtitle: "STU UIS · formerly AIS+",
      unread: "Unread messages",
      mailbox: "Mailbox",
      enable: "Enable UIS+",
      enableHint: "Modern interface for is.stuba.sk",
      appearance: "Appearance",
      system: "System",
      light: "Light",
      dark: "Dark",
      keep: "Stay signed in",
      keepHint: "Keeps your UIS session alive while the browser is open",
      none: "No unread messages",
      signedOut: "You are not signed in to UIS.",
      signIn: "Sign in",
      failed: "Could not load your mailbox.",
      more: (n) => `+ ${n} more`
    }
  };

  const enabled = document.querySelector("#enabled");
  const keepSignedIn = document.querySelector("#keepSignedIn");
  const themes = [...document.querySelectorAll('input[name="theme"]')];
  const list = document.querySelector("[data-mail-list]");
  const count = document.querySelector("[data-count]");
  let lang = "sk";

  const t = (key, ...args) => {
    const entry = (COPY[lang] || COPY.en)[key];
    return typeof entry === "function" ? entry(...args) : entry;
  };

  const urlLang = () => (lang === "cs" ? "cz" : lang);

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  }

  function applyTheme(theme) {
    const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }

  function translate() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    document.querySelector("[data-version]").textContent = `UIS+ ${chrome.runtime.getManifest().version}`;
  }

  /* Opens a UIS address in the tab that already shows UIS, or a new one. */
  function openInUis(url) {
    chrome.tabs.query({ url: `${ORIGIN}/*` }, (tabs) => {
      const tab = (tabs || []).find((item) => item.active) || (tabs || [])[0];
      if (tab) {
        chrome.tabs.update(tab.id, { url, active: true });
        chrome.windows.update(tab.windowId, { focused: true });
      } else {
        chrome.tabs.create({ url });
      }
      window.close();
    });
  }

  function message(text, action) {
    list.innerHTML = `<p class="mail-empty">${escapeHTML(text)}${action ? `<button type="button" data-sign-in>${escapeHTML(action)}</button>` : ""}</p>`;
    list.querySelector("[data-sign-in]")?.addEventListener("click", () => openInUis(`${ORIGIN}/auth/?lang=${urlLang()}`));
  }

  /* The inbox marks an unread message only by wrapping its subject in <b>;
     the sender sits in the cell before the subject and the date after it. */
  function unreadFrom(doc) {
    return [...doc.querySelectorAll("tr.uis-hl-table")]
      .map((row) => {
        const bold = row.querySelector("td > a > b");
        if (!bold) return null;
        const link = bold.parentElement;
        const cell = link.closest("td");
        const text = (node) => (node ? node.textContent.replace(/\s+/g, " ").trim() : "");
        return {
          subject: text(bold),
          sender: text(cell.previousElementSibling),
          date: text(cell.nextElementSibling),
          href: new URL(link.getAttribute("href"), `${ORIGIN}/auth/posta/`).href
        };
      })
      .filter((item) => item && item.subject);
  }

  async function loadMail() {
    try {
      const response = await fetch(`${ORIGIN}/auth/posta/?lang=${urlLang()}`, { credentials: "include", cache: "no-store" });
      const doc = new DOMParser().parseFromString(await response.text(), "text/html");
      if (doc.querySelector("#loginform")) {
        count.hidden = true;
        message(t("signedOut"), t("signIn"));
        return;
      }
      const items = unreadFrom(doc);
      count.hidden = !items.length;
      count.textContent = String(items.length);
      if (!items.length) {
        message(t("none"));
        return;
      }
      list.innerHTML = items.slice(0, 6).map((item, index) => `
        <button class="mail-item" type="button" data-index="${index}">
          <span class="mail-line"><b>${escapeHTML(item.sender)}</b><time>${escapeHTML(item.date)}</time></span>
          <span class="mail-subject">${escapeHTML(item.subject)}</span>
        </button>`).join("")
        + (items.length > 6 ? `<button class="mail-more" type="button" data-more>${escapeHTML(t("more", items.length - 6))}</button>` : "");
      list.querySelectorAll("[data-index]").forEach((button) => {
        button.addEventListener("click", () => openInUis(items[Number(button.dataset.index)].href));
      });
      list.querySelector("[data-more]")?.addEventListener("click", () => openInUis(`${ORIGIN}/auth/posta/?lang=${urlLang()}`));
    } catch (_) {
      count.hidden = true;
      message(t("failed"));
    }
  }

  chrome.storage.local.get(defaults, (settings) => {
    lang = COPY[settings.uisPageLanguage] ? settings.uisPageLanguage : "sk";
    translate();
    applyTheme(settings.theme);
    enabled.checked = Boolean(settings.enabled);
    keepSignedIn.checked = Boolean(settings.keepSignedIn);
    (themes.find((input) => input.value === settings.theme) || themes[0]).checked = true;
    loadMail();
  });

  enabled.addEventListener("change", () => chrome.storage.local.set({ enabled: enabled.checked }));
  keepSignedIn.addEventListener("change", () => chrome.storage.local.set({ keepSignedIn: keepSignedIn.checked }));
  themes.forEach((input) => input.addEventListener("change", () => {
    if (!input.checked) return;
    chrome.storage.local.set({ theme: input.value });
    applyTheme(input.value);
  }));
  document.querySelector("[data-open-mailbox]").addEventListener("click", (event) => {
    event.preventDefault();
    openInUis(`${ORIGIN}/auth/posta/?lang=${urlLang()}`);
  });
})();
