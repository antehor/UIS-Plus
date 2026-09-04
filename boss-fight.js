(function aisBossFight() {
  "use strict";

  const STORAGE_DEFAULTS = Object.freeze({
    bossFightEnabled: false,
    bossRoster: [],
    bossCatalog: {},
    bossScores: {},
    bossSemesters: []
  });
  const MAX_SCORE = 100;
  const VICTORY_SCORE = 56;
  const AUTO_SYNC_TTL = 2 * 60 * 1000;
  const PANEL_SELECTOR = "[data-stu-boss-panel]";
  const SIDEBAR_SELECTOR = "[data-stu-boss-sidebar]";

  const RANKS = [
    { min: 92, max: 100, grade: "A", title: "LEGENDARY", color: "#ff4d92" },
    { min: 83, max: 91, grade: "B", title: "EPIC", color: "#ff6b9e" },
    { min: 74, max: 82, grade: "C", title: "ELITE", color: "#67d7ff" },
    { min: 65, max: 73, grade: "D", title: "VETERAN", color: "#8de5c0" },
    { min: 56, max: 64, grade: "E", title: "SURVIVOR", color: "#f8cf6a" },
    { min: 0, max: 55, grade: "FX", title: "DEFEATED", color: "#a8afc2" }
  ];

  const BOSS_THEMES = [
    { pattern: /B-SPSS|širokopásmové systémy a siete/i, name: "ELECTRO OVERLORD", icon: "⚡", color: "#ffd25f" },
    { pattern: /siet|network|prenos|broadband|širokopás/i, name: "NETWORK OVERLORD", icon: "⚡", color: "#4fd8ff" },
    { pattern: /elektr|obvod|circuit|energy|napät/i, name: "ELECTRO OVERLORD", icon: "⚡", color: "#ffd25f" },
    { pattern: /program|software|algorit|code|web/i, name: "CODE TYRANT", icon: "⌁", color: "#8a7dff" },
    { pattern: /matem|algebra|analýz|calculus|štatist/i, name: "CALCULUS COLOSSUS", icon: "Σ", color: "#ff7b72" },
    { pattern: /fyz|quant|optic|physics/i, name: "QUANTUM WARDEN", icon: "◈", color: "#63e6be" },
    { pattern: /bezpe|security|crypto|šifr/i, name: "CIPHER REAPER", icon: "◆", color: "#f06595" },
    { pattern: /komunik|signal|digitálne komunik/i, name: "SIGNAL SOVEREIGN", icon: "⌁", color: "#74c0fc" },
    { pattern: /projekt|project|bakalár/i, name: "PROJECT LEVIATHAN", icon: "♜", color: "#ffa94d" }
  ];

  let state = { ...STORAGE_DEFAULTS };
  let panelOpen = false;
  let activeTab = "arena";
  let activeSemester = "";
  let managerStatus = "";
  let renderTimer = 0;
  let autoSyncTimer = 0;
  const pendingScores = new Set();
  const pendingSemesters = new Set();

  const ICONS = Object.freeze({
    swords: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5.5 4-4 1 1-4 4m-1-1 4 4M9.5 18.5l-4 4-1-1 4-4m1 1-4-4M5 2l17 17-3 3L2 5l3-3Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5M6.1 8a7 7 0 0 1 11.6-2.1L20 8M4 16l2.3 2.1A7 7 0 0 0 18 16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M18 13v6H5V6h6"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>'
  });

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }

  function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
  }

  function queryValue(rawUrl, name) {
    const match = String(rawUrl || "").match(new RegExp(`[?;&]${name}=([^;&#]+)`, "i"));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function sameOriginHref(raw, base = location.href) {
    try {
      const url = new URL(raw, base);
      return url.origin === location.origin ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  function clampScore(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.min(MAX_SCORE, number)) : null;
  }

  function displayNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    return Number.isInteger(number) ? String(number) : number.toFixed(1).replace(".", ",");
  }

  function relativeTime(value) {
    const timestamp = Number(value);
    if (!Number.isFinite(timestamp) || timestamp <= 0) return "Waiting for first update";
    const elapsed = Math.max(0, Date.now() - timestamp);
    if (elapsed < 45 * 1000) return "Updated just now";
    if (elapsed < 60 * 60 * 1000) return `Updated ${Math.max(1, Math.round(elapsed / 60000))} min ago`;
    return `Updated ${new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function rankFor(value) {
    const score = clampScore(value) ?? 0;
    return RANKS.find((rank) => score >= rank.min) || RANKS[RANKS.length - 1];
  }

  function themeFor(subject) {
    const text = `${subject?.name || ""} ${subject?.code || ""}`;
    const matched = BOSS_THEMES.find((theme) => theme.pattern.test(text));
    if (matched) return matched;
    let hash = 0;
    for (const character of `${subject?.key || text}`) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
    const fallback = [
      { name: "ACADEMIC TITAN", icon: "◆", color: "#67d7ff" },
      { name: "CREDIT DEVOURER", icon: "✦", color: "#f783ac" },
      { name: "SEMESTER WARDEN", icon: "◈", color: "#ffd43b" },
      { name: "KNOWLEDGE HYDRA", icon: "⚔", color: "#63e6be" }
    ];
    return fallback[Math.abs(hash) % fallback.length];
  }

  function writeStorage(patch) {
    state = { ...state, ...patch };
    try { chrome.storage.local.set(patch); } catch (_) { /* Local preview without extension storage. */ }
    queueRender();
  }

  function semesterKey(periodId, subjectId) {
    return `${periodId || "current"}::${subjectId}`;
  }

  function uniqueSemesters(semesters) {
    const map = new Map();
    semesters.forEach((semester) => {
      if (semester?.id) map.set(String(semester.id), { ...semester, id: String(semester.id) });
    });
    return [...map.values()];
  }

  function currentStudyId(doc = document, sourceUrl = location.href) {
    return queryValue(sourceUrl, "studium") || doc.querySelector('[name="studium"]')?.value || "";
  }

  function semesterSelect(doc) {
    return [...doc.querySelectorAll("select")].find((select) => {
      const labels = [...select.options].map((option) => normalize(option.textContent));
      return labels.filter((label) => /\b(?:ZS|LS)\s*\d{4}\s*\/\s*\d{4}\b/i.test(label)).length >= 1;
    });
  }

  function listEndpoint(doc = document, sourceUrl = location.href) {
    const configured = doc.querySelector('meta[name="ais-boss-list-url"]')?.content;
    if (configured) return sameOriginHref(configured, sourceUrl);
    try {
      const url = new URL(sourceUrl);
      if (/\/auth\/student\/list\.pl$/i.test(url.pathname)) return `${url.origin}${url.pathname}`;
      return `${url.origin}/auth/student/list.pl`;
    } catch (_) {
      return `${location.origin}/auth/student/list.pl`;
    }
  }

  function buildSemesterUrl(optionValue, doc, sourceUrl) {
    const direct = sameOriginHref(optionValue, sourceUrl);
    if (direct && (/\.pl(?:[?;]|$)/i.test(optionValue) || /\.html?(?:[?;]|$)/i.test(optionValue) || optionValue.startsWith("/"))) return direct;
    const periodId = queryValue(optionValue, "obdobi") || String(optionValue || "");
    const studyId = currentStudyId(doc, sourceUrl);
    const endpoint = listEndpoint(doc, sourceUrl);
    if (!endpoint) return "";
    const separator = endpoint.includes("?") ? ";" : "?";
    return `${endpoint}${separator}${studyId ? `studium=${encodeURIComponent(studyId)};` : ""}obdobi=${encodeURIComponent(periodId)}`;
  }

  function discoverSemesters(doc, sourceUrl) {
    const select = semesterSelect(doc);
    if (select) {
      return [...select.options]
        .filter((option) => /\b(?:ZS|LS)\s*\d{4}\s*\/\s*\d{4}\b/i.test(normalize(option.textContent)))
        .map((option) => {
          const id = queryValue(option.value, "obdobi") || String(option.value || "");
          return {
            id,
            label: normalize(option.textContent),
            url: buildSemesterUrl(option.value, doc, sourceUrl),
            selected: option.selected
          };
        });
    }

    const id = queryValue(sourceUrl, "obdobi");
    const pageText = normalize((doc.querySelector("#base-r") || doc.body)?.textContent);
    const label = pageText.match(/\b(?:ZS|LS)\s*\d{4}\s*\/\s*\d{4}(?:\s*-\s*[^,;|]+)?/i)?.[0] || (id ? `Semester ${id}` : "Current semester");
    return id ? [{ id, label, url: buildSemesterUrl(id, doc, sourceUrl), selected: true }] : [];
  }

  function numberFromText(value) {
    const match = normalize(value).replace(/,/g, ".").match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  }

  function extractCredits(doc) {
    const root = doc.querySelector("#base-r") || doc.querySelector("#base") || doc.body;
    for (const row of root?.querySelectorAll("tr") || []) {
      const cells = [...row.querySelectorAll("th,td")];
      const labelIndex = cells.findIndex((cell) => /^(?:kredity|credits|credits allocated|number of credits|počet kreditov|počet kreditů)\b/i.test(normalize(cell.textContent)));
      if (labelIndex < 0) continue;
      for (const cell of cells.slice(labelIndex + 1)) {
        const value = numberFromText(cell.textContent);
        if (value !== null && value >= 0 && value <= 60) return value;
      }
    }
    const text = normalize(root?.textContent);
    const match = text.match(/(?:kredity|credits(?: allocated)?|number of credits|počet kreditov|počet kreditů)\s*[:–-]?\s*(\d+(?:[,.]\d+)?)/i);
    return match ? Number(match[1].replace(",", ".")) : null;
  }

  function extractSemesterScore(doc) {
    const root = doc.querySelector("#base-r") || doc.querySelector("#base") || doc.body;
    const totals = [];
    for (const table of root?.querySelectorAll("table") || []) {
      const rows = [...table.rows];
      rows.forEach((row, rowIndex) => {
        const cells = [...row.cells];
        const totalIndex = cells.findIndex((cell) => /^(?:súčet|sucet|sum|total)$/i.test(normalize(cell.textContent)));
        if (totalIndex < 0) return;
        for (const resultRow of rows.slice(rowIndex + 1)) {
          const target = resultRow.cells[totalIndex];
          if (!target) continue;
          const raw = normalize(target.textContent).replace(",", ".");
          if (/^-?\d+(?:\.\d+)?$/.test(raw)) totals.push(Number(raw));
        }
      });
    }
    const valid = totals.filter((value) => Number.isFinite(value) && value >= 0);
    return valid.length ? Math.max(...valid) : null;
  }

  function subjectNameFromContainer(container, links) {
    const namedLinks = links
      .map((link) => normalize(link.textContent))
      .filter((text) => text.length >= 4 && !/^(?:detail|open|folder|operácie|operations?)$/i.test(text));
    if (namedLinks.length) return namedLinks.sort((a, b) => b.length - a.length)[0];
    const firstCell = container?.querySelector("td,th");
    const cellText = normalize(firstCell?.textContent);
    return cellText.length >= 4 ? cellText : "Unnamed subject";
  }

  function subjectCode(name) {
    return normalize(name).match(/^[A-ZČŠŽĽĎŤŇ0-9]+(?:-[A-ZČŠŽĽĎŤŇ0-9]+)+/i)?.[0]?.toUpperCase() || "SUBJECT";
  }

  function parseSubjects(doc, sourceUrl, semester) {
    const anchors = [...doc.querySelectorAll("a[href]")].filter((anchor) => {
      const href = sameOriginHref(anchor.getAttribute("href"), sourceUrl);
      return href && queryValue(href, "predmet");
    });
    const groups = new Map();
    anchors.forEach((anchor) => {
      const href = sameOriginHref(anchor.getAttribute("href"), sourceUrl);
      const id = queryValue(href, "predmet");
      const container = anchor.closest("tr") || anchor.closest("li") || anchor.parentElement;
      const groupKey = `${id}|${container ? [...doc.querySelectorAll("tr,li")].indexOf(container) : 0}`;
      if (!groups.has(groupKey)) groups.set(groupKey, { id, container, links: [] });
      groups.get(groupKey).links.push(anchor);
    });

    const seen = new Set();
    const subjects = [];
    groups.forEach((group) => {
      const key = semesterKey(semester.id, group.id);
      if (seen.has(key)) return;
      seen.add(key);
      const urls = group.links.map((link) => sameOriginHref(link.getAttribute("href"), sourceUrl)).filter(Boolean);
      const pointsUrl = urls.find((url) => queryValue(url, "prubezne") === "1") || urls.find((url) => /\/student\/list\.pl/i.test(url)) || urls[0];
      const catalogInfoUrl = sameOriginHref(`/katalog/syllabus.pl?predmet=${encodeURIComponent(group.id)};typ=1;vystup=1;jazyk=3`, sourceUrl);
      const infoUrl = urls.find((url) => /\/katalog\/|predmety|course|detail|info/i.test(url) && url !== pointsUrl)
        || catalogInfoUrl
        || urls.find((url) => url !== pointsUrl)
        || sameOriginHref(group.links.find((link) => normalize(link.textContent).length >= 4)?.getAttribute("href"), sourceUrl)
        || pointsUrl;
      const name = subjectNameFromContainer(group.container, group.links);
      subjects.push({
        key,
        subjectId: group.id,
        code: subjectCode(name),
        name,
        semesterId: String(semester.id),
        semesterLabel: semester.label,
        pointsUrl,
        infoUrl,
        credits: extractCredits(group.container ? { querySelector: () => group.container, body: group.container } : doc),
        studyId: currentStudyId(doc, sourceUrl)
      });
    });
    return subjects;
  }

  function mergeDiscovery(semesters, subjects) {
    const nextSemesters = uniqueSemesters([...(state.bossSemesters || []), ...semesters]);
    const nextCatalog = { ...(state.bossCatalog || {}) };
    subjects.forEach((subject) => {
      const existing = nextCatalog[subject.key] || {};
      nextCatalog[subject.key] = {
        ...existing,
        ...subject,
        credits: subject.credits ?? existing.credits ?? null
      };
    });
    writeStorage({ bossSemesters: nextSemesters, bossCatalog: nextCatalog });
  }

  function scanIndexDocument(doc, sourceUrl) {
    const semesters = discoverSemesters(doc, sourceUrl);
    const selected = semesters.find((semester) => semester.selected)
      || semesters.find((semester) => semester.id === queryValue(sourceUrl, "obdobi"))
      || semesters[0]
      || { id: queryValue(sourceUrl, "obdobi") || "current", label: "Current semester", url: sourceUrl };
    const subjects = parseSubjects(doc, sourceUrl, selected);
    mergeDiscovery(semesters.length ? semesters : [selected], subjects);
    if (!activeSemester) activeSemester = selected.id;
    return { semesters, selected, subjects };
  }

  async function fetchDocument(rawUrl) {
    const url = sameOriginHref(rawUrl);
    if (!url) throw new Error("This STU link is not available.");
    const response = await fetch(url, { credentials: "include", headers: { Accept: "text/html" } });
    if (!response.ok) throw new Error(`STU returned ${response.status}.`);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (doc.querySelector("#loginform") || /prihl[aá]si[ťt]|sign in/i.test(normalize(doc.title)) && !/list|portal/i.test(normalize(doc.title))) {
      throw new Error("Sign in to STU UIS and try again.");
    }
    return { doc, url: response.url || url };
  }

  async function ensureIndexData(force = false) {
    if (!force && state.bossSemesters?.length && Object.keys(state.bossCatalog || {}).length) return;
    managerStatus = "Scanning STU UIS…";
    renderPanel();
    try {
      const isIndex = /\/student\/list\.pl$/i.test(location.pathname) && !queryValue(location.href, "predmet");
      if (isIndex) {
        scanIndexDocument(document, location.href);
      } else {
        const endpoint = listEndpoint(document, location.href);
        const { doc, url } = await fetchDocument(endpoint);
        scanIndexDocument(doc, url);
      }
      managerStatus = "Subjects loaded from STU UIS.";
      const first = state.bossSemesters?.find((semester) => semester.id === activeSemester) || state.bossSemesters?.[0];
      if (first) activeSemester = first.id;
    } catch (error) {
      managerStatus = error.message || "Could not read the subject list.";
    }
    renderPanel();
    if (state.bossFightEnabled) scheduleAutoSync(80);
  }

  async function loadSemester(periodId, force = false) {
    const semester = state.bossSemesters?.find((item) => item.id === periodId);
    if (!semester || pendingSemesters.has(periodId)) return;
    activeSemester = periodId;
    const cached = Object.values(state.bossCatalog || {}).some((subject) => subject.semesterId === periodId);
    if (cached && !force) {
      managerStatus = "Loaded from local cache.";
      renderPanel();
      return;
    }
    pendingSemesters.add(periodId);
    managerStatus = `Loading ${semester.label}…`;
    renderPanel();
    try {
      const { doc, url } = await fetchDocument(semester.url);
      const parsed = scanIndexDocument(doc, url);
      managerStatus = `${parsed.subjects.length} subjects found in ${semester.label}.`;
    } catch (error) {
      managerStatus = error.message || "Could not load this semester.";
    } finally {
      pendingSemesters.delete(periodId);
      renderPanel();
    }
  }

  async function refreshBoss(key) {
    const subject = state.bossCatalog?.[key];
    if (!subject || pendingScores.has(key)) return;
    pendingScores.add(key);
    queueRender();
    const previous = state.bossScores?.[key] || {};
    let score = Number.isFinite(Number(previous.points)) ? Number(previous.points) : null;
    let credits = previous.credits ?? subject.credits ?? null;
    let error = "";
    let succeeded = false;
    try {
      const pointsPage = await fetchDocument(subject.pointsUrl);
      const freshScore = extractSemesterScore(pointsPage.doc);
      if (freshScore === null) throw new Error("SÚČET was not found on the assessment page.");
      score = freshScore;
      credits = extractCredits(pointsPage.doc) ?? credits;
      if (credits === null && subject.infoUrl && subject.infoUrl !== subject.pointsUrl) {
        const infoPage = await fetchDocument(subject.infoUrl);
        credits = extractCredits(infoPage.doc) ?? credits;
      }
      succeeded = true;
    } catch (caught) {
      error = caught.message || "Score refresh failed.";
    }

    const nextScores = {
      ...(state.bossScores || {}),
      [key]: {
        points: score,
        credits,
        updatedAt: succeeded ? Date.now() : previous.updatedAt || null,
        lastAttemptAt: Date.now(),
        error
      }
    };
    const nextCatalog = {
      ...(state.bossCatalog || {}),
      [key]: { ...subject, credits: credits ?? subject.credits ?? null }
    };
    pendingScores.delete(key);
    writeStorage({ bossScores: nextScores, bossCatalog: nextCatalog });
  }

  async function refreshAllBosses({ staleOnly = false } = {}) {
    const now = Date.now();
    const keys = (state.bossRoster || []).filter((key) => {
      if (!state.bossCatalog?.[key]) return false;
      if (!staleOnly) return true;
      const updatedAt = Number(state.bossScores?.[key]?.updatedAt) || 0;
      return !updatedAt || now - updatedAt >= AUTO_SYNC_TTL;
    });
    if (!keys.length) return;
    const queue = [...keys];
    const worker = async () => {
      while (queue.length) await refreshBoss(queue.shift());
    };
    await Promise.all([worker(), worker()]);
  }

  function scheduleAutoSync(delay = 450, force = false) {
    clearTimeout(autoSyncTimer);
    if (!state.bossFightEnabled || !(state.bossRoster || []).length) return;
    autoSyncTimer = setTimeout(() => {
      if (document.visibilityState === "hidden") return;
      void refreshAllBosses({ staleOnly: !force });
    }, delay);
  }

  function captureCurrentScorePage() {
    const subjectId = queryValue(location.href, "predmet");
    if (!subjectId || queryValue(location.href, "prubezne") !== "1") return false;
    const score = extractSemesterScore(document);
    if (score === null) return false;
    const periodId = queryValue(location.href, "obdobi");
    const credits = extractCredits(document);
    const matches = Object.values(state.bossCatalog || {}).filter((subject) => subject.subjectId === subjectId && (!periodId || subject.semesterId === periodId));
    if (!matches.length) return false;
    const nextScores = { ...(state.bossScores || {}) };
    const nextCatalog = { ...(state.bossCatalog || {}) };
    matches.forEach((subject) => {
      nextScores[subject.key] = { points: score, credits: credits ?? subject.credits ?? null, updatedAt: Date.now(), error: "" };
      nextCatalog[subject.key] = { ...subject, credits: credits ?? subject.credits ?? null };
    });
    writeStorage({ bossScores: nextScores, bossCatalog: nextCatalog });
    return true;
  }

  function captureCurrentCredits() {
    const subjectId = queryValue(location.href, "predmet");
    if (!subjectId) return;
    const credits = extractCredits(document);
    if (credits === null) return;
    const nextCatalog = { ...(state.bossCatalog || {}) };
    let changed = false;
    Object.values(nextCatalog).forEach((subject) => {
      if (subject.subjectId === subjectId && subject.credits !== credits) {
        nextCatalog[subject.key] = { ...subject, credits };
        changed = true;
      }
    });
    if (changed) writeStorage({ bossCatalog: nextCatalog });
  }

  function sidebarBossCard(subject) {
    const result = state.bossScores?.[subject.key] || {};
    const score = Number.isFinite(Number(result.points)) ? clampScore(result.points) : null;
    const progress = score ?? 0;
    const defeated = score !== null && score >= VICTORY_SCORE;
    const rank = score === null ? { grade: "—", title: "WAITING", color: "#d7af5e" } : rankFor(score);
    const boss = themeFor(subject);
    const remaining = Math.max(0, VICTORY_SCORE - (score ?? 0));
    const syncing = pendingScores.has(subject.key);
    return `
      <article class="stu-boss-sidebar-card${defeated ? " is-defeated" : ""}${syncing ? " is-syncing" : ""}" style="--boss-color:${boss.color};--rank-color:${rank.color}" title="${escapeAttribute(subject.name)}">
        <div class="stu-boss-sidebar-card-head">
          <span class="stu-boss-sidebar-avatar">${boss.icon}</span>
          <span class="stu-boss-sidebar-name"><b>${escapeHTML(boss.name)}</b><small>${escapeHTML(subject.code)} · ${escapeHTML(subject.semesterLabel)}</small></span>
          <button type="button" data-boss-remove="${escapeAttribute(subject.key)}" aria-label="Remove ${escapeAttribute(subject.code)} from Boss Fight" title="Remove boss">${ICONS.close}</button>
        </div>
        <div class="stu-boss-sidebar-score"><span>${syncing ? "Updating…" : defeated ? "Boss defeated" : score === null ? "Awaiting score" : `${displayNumber(remaining)} DMG left`}</span><b>${score === null ? "—" : displayNumber(score)}<small> / ${MAX_SCORE}</small></b></div>
        <div class="stu-boss-sidebar-hp" aria-label="${score === null ? "Score is being discovered" : `${score} points out of 100`}"><i style="width:${progress}%"></i><b style="left:${VICTORY_SCORE}%"></b></div>
        <div class="stu-boss-sidebar-card-foot"><span style="--rank-color:${rank.color}">${rank.grade} · ${rank.title}</span><a href="${escapeAttribute(subject.infoUrl || subject.pointsUrl)}" target="_blank" rel="noopener" aria-label="Open ${escapeAttribute(subject.code)} information">Info ${ICONS.external}</a></div>
      </article>`;
  }

  function renderSidebar() {
    const sidebar = document.querySelector(".stu-sidebar");
    if (!sidebar || sidebar.querySelector(SIDEBAR_SELECTOR)) return;
    const subjects = (state.bossRoster || []).map((key) => state.bossCatalog?.[key]).filter(Boolean);
    const defeated = subjects.filter((subject) => clampScore(state.bossScores?.[subject.key]?.points) >= VICTORY_SCORE).length;
    const latestUpdate = Math.max(0, ...subjects.map((subject) => Number(state.bossScores?.[subject.key]?.updatedAt) || 0));
    const syncing = subjects.some((subject) => pendingScores.has(subject.key));
    const block = document.createElement("div");
    block.dataset.stuBossSidebar = "true";
    block.className = `stu-boss-sidebar${state.bossFightEnabled ? " is-enabled" : ""}`;
    block.innerHTML = `
      <button class="stu-boss-mode-toggle" type="button" data-boss-mode-toggle aria-pressed="${Boolean(state.bossFightEnabled)}" title="${state.bossFightEnabled ? "Disable" : "Enable"} Boss Fight">
        <span class="stu-boss-sidebar-icon">${ICONS.swords}</span>
        <span class="stu-boss-sidebar-copy"><b>Boss Fight</b><small>FUN MODE</small></span>
        <span class="stu-boss-mini-switch" aria-hidden="true"><i></i></span>
      </button>
      ${state.bossFightEnabled ? `
        <div class="stu-boss-sidebar-campaign">
          <div><small>CAMPAIGN</small><b>${defeated} / ${subjects.length} defeated</b></div>
          <span class="stu-boss-auto-state${syncing ? " is-syncing" : ""}"><i></i>${syncing ? "Updating" : "Auto"}</span>
          <button type="button" data-boss-sidebar-refresh class="${syncing ? "is-syncing" : ""}" aria-label="Update scores now" title="Update scores now">${ICONS.refresh}</button>
          <button type="button" data-boss-manage aria-label="Add or remove bosses" title="Add boss">${ICONS.plus}</button>
        </div>
        <div class="stu-boss-sidebar-list">
          ${subjects.length ? subjects.map(sidebarBossCard).join("") : `<button class="stu-boss-sidebar-empty" type="button" data-boss-manage><span>${ICONS.plus}</span><b>Add your first boss</b><small>Choose a subject from STU UIS</small></button>`}
        </div>
        ${subjects.length ? `<button class="stu-boss-enter" type="button" data-boss-open title="Open campaign details"><span>${syncing ? "Scores are updating automatically" : relativeTime(latestUpdate)}</span><b>Details ${ICONS.chevron}</b></button>` : ""}` : ""}`;
    const foot = sidebar.querySelector(".stu-sidebar-foot");
    if (foot) foot.before(block); else sidebar.appendChild(block);
    block.querySelector("[data-boss-mode-toggle]")?.addEventListener("click", () => {
      const enabled = !state.bossFightEnabled;
      writeStorage({ bossFightEnabled: enabled });
      if (enabled) {
        if ((state.bossRoster || []).length) scheduleAutoSync(80, true);
        else openPanel("manage");
      } else closePanel();
    });
    block.querySelector("[data-boss-open]")?.addEventListener("click", () => openPanel("arena"));
    block.querySelectorAll("[data-boss-manage]").forEach((button) => button.addEventListener("click", () => openPanel("manage")));
    block.querySelector("[data-boss-sidebar-refresh]")?.addEventListener("click", () => scheduleAutoSync(0, true));
    block.querySelectorAll("[data-boss-remove]").forEach((button) => button.addEventListener("click", () => {
      writeStorage({ bossRoster: (state.bossRoster || []).filter((key) => key !== button.dataset.bossRemove) });
    }));
  }

  function buildPanel() {
    let panel = document.querySelector(PANEL_SELECTOR);
    if (panel) return panel;
    panel = document.createElement("div");
    panel.dataset.stuBossPanel = "true";
    panel.className = "stu-boss-overlay";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <section class="stu-boss-dialog" role="dialog" aria-modal="true" aria-label="Boss Fight">
        <header class="stu-boss-header">
          <div class="stu-boss-emblem">${ICONS.swords}</div>
          <div><small>UIS+ · FUN MODE</small><h2>Boss Fight</h2></div>
          <div class="stu-boss-header-meta"><span>VICTORY AT <b>${VICTORY_SCORE} DMG</b></span><span>MAX <b>${MAX_SCORE} HP</b></span></div>
          <button class="stu-boss-close" type="button" data-boss-close aria-label="Close Boss Fight">${ICONS.close}</button>
        </header>
        <nav class="stu-boss-tabs" aria-label="Boss Fight sections"></nav>
        <div class="stu-boss-content"></div>
        <footer class="stu-boss-footer"><span></span>Scores update automatically from STU UIS · Data stays in this browser</footer>
      </section>`;
    document.body.appendChild(panel);
    panel.addEventListener("click", handlePanelClick);
    panel.addEventListener("change", handlePanelChange);
    panel.addEventListener("click", (event) => { if (event.target === panel) closePanel(); });
    return panel;
  }

  function openPanel(tab = "arena") {
    if (!state.bossFightEnabled) writeStorage({ bossFightEnabled: true });
    activeTab = tab;
    panelOpen = true;
    const panel = buildPanel();
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("stu-boss-open");
    renderPanel();
    if (tab === "manage") ensureIndexData();
    else scheduleAutoSync(120);
    requestAnimationFrame(() => panel.querySelector("[data-boss-close]")?.focus());
  }

  function closePanel() {
    panelOpen = false;
    document.querySelector(PANEL_SELECTOR)?.classList.remove("is-open");
    document.querySelector(PANEL_SELECTOR)?.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("stu-boss-open");
  }

  function renderTabs() {
    const rosterCount = (state.bossRoster || []).length;
    return [
      { key: "arena", label: "Overview", icon: "⚔", count: rosterCount },
      { key: "manage", label: "Manage", icon: "+", count: rosterCount },
      { key: "ranks", label: "Ranks", icon: "★", count: "" }
    ].map((tab) => `<button type="button" data-boss-tab="${tab.key}" class="${activeTab === tab.key ? "is-active" : ""}"><i>${tab.icon}</i>${tab.label}${tab.count !== "" ? `<b>${tab.count}</b>` : ""}</button>`).join("");
  }

  function bossCard(subject) {
    const result = state.bossScores?.[subject.key] || {};
    const hasScore = Number.isFinite(Number(result.points));
    const score = hasScore ? clampScore(result.points) : null;
    const progress = score ?? 0;
    const defeated = score !== null && score >= VICTORY_SCORE;
    const rank = score === null ? { grade: "?", title: "UNRANKED", color: "#748197" } : rankFor(score);
    const boss = themeFor(subject);
    const credits = result.credits ?? subject.credits;
    const remaining = score === null ? VICTORY_SCORE : Math.max(0, VICTORY_SCORE - score);
    const updated = relativeTime(result.updatedAt);
    return `
      <article class="stu-boss-card${defeated ? " is-defeated" : ""}" style="--boss-color:${boss.color}">
        <div class="stu-boss-card-glow"></div>
        <header>
          <div class="stu-boss-avatar"><span>${boss.icon}</span></div>
          <div class="stu-boss-identity"><small>${escapeHTML(subject.code)} · ${escapeHTML(subject.semesterLabel)}</small><h3>${escapeHTML(boss.name)}</h3><p>${escapeHTML(subject.name)}</p></div>
          <span class="stu-boss-rank" style="--rank-color:${rank.color}"><b>${rank.grade}</b>${rank.title}</span>
        </header>
        <div class="stu-boss-hp-copy"><span>${defeated ? "FINAL SCORE" : "DAMAGE DEALT"}</span><strong>${score === null ? "—" : displayNumber(score)}<small> / ${MAX_SCORE}</small></strong></div>
        <div class="stu-boss-hp" aria-label="${score === null ? "Score not synced" : `${score} points out of 100`}">
          <i style="width:${progress}%"></i><b style="left:${VICTORY_SCORE}%" title="Victory threshold: ${VICTORY_SCORE}"></b>
        </div>
        <div class="stu-boss-threshold"><span>0</span><span>VICTORY ${VICTORY_SCORE}</span><span>${MAX_SCORE}</span></div>
        ${defeated ? `
          <div class="stu-boss-victory"><span>💥</span><div><b>BOSS DEFEATED!</b><small>${escapeHTML(boss.name)} has been defeated.</small></div></div>
          <div class="stu-boss-rewards"><span>🎓 Subject completed</span><span>⭐ +${credits === null || credits === undefined ? "?" : displayNumber(credits)} credits</span></div>` : `
          <div class="stu-boss-progress-copy"><span>${score === null ? "◇ AWAITING SCORE" : "⚔ BATTLE IN PROGRESS"}</span><b>${score === null ? "UIS+ is checking SÚČET automatically" : `${displayNumber(remaining)} DMG until victory`}</b></div>`}
        ${result.error ? `<p class="stu-boss-error">${escapeHTML(result.error)}</p>` : ""}
        <footer>
          <span>${pendingScores.has(subject.key) ? "Updating from STU UIS…" : escapeHTML(updated)}</span>
          <div><button type="button" data-boss-remove="${escapeAttribute(subject.key)}">Remove</button><a href="${escapeAttribute(subject.infoUrl || subject.pointsUrl)}" target="_blank" rel="noopener">Subject info ↗</a></div>
        </footer>
      </article>`;
  }

  function renderArena() {
    const subjects = (state.bossRoster || []).map((key) => state.bossCatalog?.[key]).filter(Boolean);
    if (!subjects.length) {
      return `<div class="stu-boss-empty"><div class="stu-boss-empty-icon">⚔</div><small>YOUR ARENA IS EMPTY</small><h3>Choose your first subject boss</h3><p>Add subjects from any discovered semester. UIS+ will turn each SÚČET score into battle damage.</p><button type="button" data-boss-show-manage>Choose Bosses</button></div>`;
    }
    const defeated = subjects.filter((subject) => clampScore(state.bossScores?.[subject.key]?.points) >= VICTORY_SCORE).length;
    return `
      <div class="stu-boss-arena-head">
        <div><small>SEMESTER CAMPAIGN</small><h3>${defeated} / ${subjects.length} BOSSES DEFEATED</h3></div>
        <div><span class="stu-boss-panel-auto${pendingScores.size ? " is-syncing" : ""}"><i></i>${pendingScores.size ? "Updating scores…" : "Auto-sync is on"}</span><button type="button" data-boss-show-manage>Manage Bosses</button></div>
      </div>
      <div class="stu-boss-grid">${subjects.map(bossCard).join("")}</div>`;
  }

  function renderManager() {
    const semesters = state.bossSemesters || [];
    if (!activeSemester && semesters[0]) activeSemester = semesters[0].id;
    const subjects = Object.values(state.bossCatalog || {})
      .filter((subject) => !activeSemester || subject.semesterId === activeSemester)
      .sort((a, b) => a.name.localeCompare(b.name));
    const roster = new Set(state.bossRoster || []);
    return `
      <div class="stu-boss-manager-head">
        <div><small>BUILD YOUR CAMPAIGN</small><h3>Select subject bosses</h3><p>Mix subjects from different semesters. Your selection is stored only in this browser.</p></div>
        <a href="${escapeAttribute(sameOriginHref(document.querySelector('meta[name="ais-boss-list-url"]')?.content || "/auth/student/list.pl"))}" target="_blank" rel="noopener">Open STU subject list ↗</a>
      </div>
      <div class="stu-boss-semester-bar">
        <label><span>Semester</span><select data-boss-semester ${semesters.length ? "" : "disabled"}>${semesters.length ? semesters.map((semester) => `<option value="${escapeAttribute(semester.id)}" ${semester.id === activeSemester ? "selected" : ""}>${escapeHTML(semester.label)}</option>`).join("") : '<option>No semesters discovered</option>'}</select></label>
        <button type="button" data-boss-rescan>${pendingSemesters.has(activeSemester) ? "Loading…" : "Refresh semester"}</button>
        <span>${escapeHTML(managerStatus)}</span>
      </div>
      ${subjects.length ? `<div class="stu-boss-subject-list">${subjects.map((subject) => {
        const selected = roster.has(subject.key);
        const theme = themeFor(subject);
        return `<button type="button" data-boss-select="${escapeAttribute(subject.key)}" aria-pressed="${selected}" class="${selected ? "is-selected" : ""}" style="--boss-color:${theme.color}"><i>${theme.icon}</i><span><small>${escapeHTML(subject.code)} · ${escapeHTML(subject.semesterLabel)}</small><b>${escapeHTML(subject.name)}</b><em>${escapeHTML(theme.name)}</em></span><strong>${selected ? "IN ARENA" : "ADD BOSS"}</strong></button>`;
      }).join("")}</div>` : `<div class="stu-boss-manager-empty"><b>No subjects cached for this semester.</b><span>Open the STU subject list or press “Refresh semester”.</span><button type="button" data-boss-discover>Scan STU UIS</button></div>`}`;
  }

  function renderRanks() {
    return `
      <div class="stu-boss-ranks-head"><small>FINAL BATTLE RESULTS</small><h3>RANK DISTRIBUTION</h3><p>Your final SÚČET determines the rank shown after the battle.</p></div>
      <div class="stu-boss-rank-table">
        <div class="is-header"><span>SCORE</span><span>RANK</span><span>STATUS</span></div>
        ${RANKS.map((rank) => `<div style="--rank-color:${rank.color}"><span>${rank.min}–${rank.max}</span><strong><i>${rank.grade}</i>${rank.grade} — ${rank.title}</strong><em>${rank.min >= VICTORY_SCORE ? "BOSS DEFEATED" : "MISSION FAILED"}</em></div>`).join("")}
      </div>
      <div class="stu-boss-rules"><div><b>${MAX_SCORE}</b><span>Boss HP / maximum score</span></div><div><b>${VICTORY_SCORE}</b><span>Damage required for victory</span></div><div><b>SÚČET</b><span>Your live semester damage</span></div><div><b>+ECTS</b><span>Credits earned after victory</span></div></div>`;
  }

  function renderPanel() {
    const panel = document.querySelector(PANEL_SELECTOR);
    if (!panel) return;
    panel.querySelector(".stu-boss-tabs").innerHTML = renderTabs();
    const content = panel.querySelector(".stu-boss-content");
    content.innerHTML = activeTab === "manage" ? renderManager() : activeTab === "ranks" ? renderRanks() : renderArena();
  }

  function queueRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      document.querySelector(SIDEBAR_SELECTOR)?.remove();
      renderSidebar();
      if (panelOpen) renderPanel();
    }, 35);
  }

  function handlePanelClick(event) {
    const target = event.target.closest("button,a");
    if (!target) return;
    if (target.matches("[data-boss-close]")) return closePanel();
    if (target.dataset.bossTab) {
      activeTab = target.dataset.bossTab;
      renderPanel();
      if (activeTab === "manage") ensureIndexData();
      return;
    }
    if (target.matches("[data-boss-show-manage]")) {
      activeTab = "manage";
      renderPanel();
      ensureIndexData();
      return;
    }
    if (target.matches("[data-boss-refresh-all]")) return void refreshAllBosses();
    if (target.dataset.bossRefresh) return void refreshBoss(target.dataset.bossRefresh);
    if (target.dataset.bossRemove) {
      writeStorage({ bossRoster: (state.bossRoster || []).filter((key) => key !== target.dataset.bossRemove) });
      return;
    }
    if (target.dataset.bossSelect) {
      const roster = new Set(state.bossRoster || []);
      const adding = !roster.has(target.dataset.bossSelect);
      if (!adding) roster.delete(target.dataset.bossSelect); else roster.add(target.dataset.bossSelect);
      writeStorage({ bossRoster: [...roster] });
      if (adding) setTimeout(() => void refreshBoss(target.dataset.bossSelect), 80);
      return;
    }
    if (target.matches("[data-boss-rescan]")) return void loadSemester(activeSemester, true);
    if (target.matches("[data-boss-discover]")) return void ensureIndexData(true);
  }

  function handlePanelChange(event) {
    const select = event.target.closest("[data-boss-semester]");
    if (!select) return;
    activeSemester = select.value;
    loadSemester(activeSemester);
  }

  function discoverCurrentPage() {
    if (!/\/student\/list\.pl$/i.test(location.pathname)) {
      captureCurrentCredits();
      return;
    }
    if (queryValue(location.href, "predmet")) captureCurrentScorePage();
    else scanIndexDocument(document, location.href);
  }

  function start() {
    try {
      chrome.storage.local.get(STORAGE_DEFAULTS, (stored) => {
        state = { ...STORAGE_DEFAULTS, ...(stored || {}) };
        renderSidebar();
        buildPanel();
        if (state.bossFightEnabled) setTimeout(() => {
          discoverCurrentPage();
          scheduleAutoSync(500);
        }, 350);
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        Object.entries(changes).forEach(([key, change]) => { state[key] = change.newValue; });
        if (changes.enabled?.newValue === false || changes.bossFightEnabled?.newValue === false) closePanel();
        if (changes.bossFightEnabled?.newValue === true) setTimeout(() => {
          discoverCurrentPage();
          scheduleAutoSync(250);
        }, 100);
        if ((changes.bossRoster || changes.bossCatalog) && state.bossFightEnabled) scheduleAutoSync(120);
        queueRender();
      });
    } catch (_) {
      state = { ...STORAGE_DEFAULTS };
      renderSidebar();
      buildPanel();
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(".stu-sidebar") && !document.querySelector(SIDEBAR_SELECTOR)) renderSidebar();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && panelOpen) closePanel(); });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") scheduleAutoSync(350);
    });
    window.addEventListener("focus", () => scheduleAutoSync(350));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
