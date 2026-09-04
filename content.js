(function stuModernUI() {
  "use strict";

  const ROOT_CLASS = "stu-modern";
  const DEFAULTS = Object.freeze({ enabled: true, theme: "system", compact: false, sidebarCollapsed: false, uiLanguage: "en" });
  const SHELL_SELECTOR = "[data-stu-modern-shell]";
  const PENDING_NAV_KEY = "stuModernPendingNavigation";

  const ICONS = {
    dashboard: '<path d="M3 12l9-9 9 9"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    study: '<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M7 10.5V16c3 2 7 2 10 0v-5.5"/><path d="M21 8v6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    exams: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h4"/>',
    grades: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    credits: '<circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/>',
    courses: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V4H6.5A2.5 2.5 0 004 6.5v13z"/><path d="M8 8h8M8 12h6"/>',
    documents: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>',
    messages: '<path d="M4 5h16v12H8l-4 4V5z"/><path d="M8 9h8M8 13h5"/>',
    announcements: '<path d="M4 11v3h3l8 4V7l-8 4H4z"/><path d="M18 9a4 4 0 010 7"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2h-4v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 00.3-1.9A1.7 1.7 0 003 14H2.8v-4H3a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 009 4.6 1.7 1.7 0 0010 3v-.2h4V3a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.2v4H21a1.7 1.7 0 00-1.6 1z"/>',
    moon: '<path d="M20 15.2A8 8 0 018.8 4a8 8 0 1011.2 11.2z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    bell: '<path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z"/><path d="M10 21h4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 9l-3 3 3 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevron: '<path d="M9 18l6-6-6-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    external: '<path d="M14 3h7v7M10 14L21 3"/><path d="M18 13v7H4V6h7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'
  };

  const LABELS = {
    en: {
      app: "University information system", dashboard: "Dashboard", study: "My studies",
      calendar: "Timetable", exams: "Exams", grades: "Grades", credits: "Credits",
      courses: "Courses", documents: "Documents", messages: "Messages",
      announcements: "Announcements", settings: "Settings", navigation: "Navigation",
      useful: "Quick access", notifications: "Notifications", noNotifications: "No visible notifications",
      profile: "Profile", theme: "Switch theme", openMenu: "Open navigation", close: "Close",
      collapse: "Collapse sidebar", expand: "Expand sidebar", navigating: "Opening section…",
      language: "Language", unavailable: "The requested section was not found"
    },
    sk: {
      app: "Univerzitný informačný systém", dashboard: "Prehľad", study: "Moje štúdium",
      calendar: "Rozvrh", exams: "Skúšky", grades: "Hodnotenie", credits: "Kredity",
      courses: "Predmety", documents: "Dokumenty", messages: "Správy",
      announcements: "Oznamy", settings: "Nastavenia", navigation: "Navigácia",
      useful: "Rýchly prístup", notifications: "Upozornenia", noNotifications: "Žiadne viditeľné upozornenia",
      profile: "Profil", theme: "Prepnúť tému", openMenu: "Otvoriť navigáciu", close: "Zavrieť",
      collapse: "Zbaliť bočný panel", expand: "Rozbaliť bočný panel", navigating: "Otváram sekciu…",
      language: "Jazyk", unavailable: "Požadovaná sekcia sa nenašla"
    },
    cs: {
      app: "Univerzitní informační systém", dashboard: "Přehled", study: "Moje studium",
      calendar: "Rozvrh", exams: "Zkoušky", grades: "Hodnocení", credits: "Kredity",
      courses: "Předměty", documents: "Dokumenty", messages: "Zprávy",
      announcements: "Oznámení", settings: "Nastavení", navigation: "Navigace",
      useful: "Rychlý přístup", notifications: "Upozornění", noNotifications: "Žádná viditelná upozornění",
      profile: "Profil", theme: "Přepnout motiv", openMenu: "Otevřít navigaci", close: "Zavřít",
      collapse: "Sbalit boční panel", expand: "Rozbalit boční panel", navigating: "Otevírám sekci…",
      language: "Jazyk", unavailable: "Požadovaná sekce nebyla nalezena"
    }
  };

  const NAV_ITEMS = [
    { key: "dashboard", patterns: [/personal administration/i, /osobn[áí] administr/i, /hlavn[íá] str/i, /dashboard/i, /prehľad/i], fallback: "/auth/", preferFallback: true },
    { key: "study", patterns: [/port[aá]l studenta/i, /student portal/i, /my studies/i, /moje št[uú]dium/i, /moje studium/i], fallback: "https://is.stuba.sk/auth/student/moje_studium.pl?_m=3110", preferFallback: true },
    { key: "calendar", patterns: [/m[oôů]j rozvrh/i, /my timetable/i, /osobn[ýy] rozvrh/i], via: [/port[aá]l studenta/i, /student portal/i], viaFallback: "https://is.stuba.sk/auth/student/moje_studium.pl?_m=3110" },
    { key: "exams", patterns: [/testy a sk[uú]šanie/i, /tests? and examinations?/i, /testy a zkoušen[ií]/i, /sk[uú]šky/i] },
    { key: "grades", patterns: [/hodnotenie št[uú]dia/i, /priebeh št[uú]dia/i, /v[ýy]sledky št[uú]dia/i, /study results/i, /grades?/i], via: [/port[aá]l studenta/i, /student portal/i] },
    { key: "credits", patterns: [/kontrola pl[aá]nu/i, /study plan check/i, /kontrola studijn[ií]ho pl[aá]nu/i], via: [/port[aá]l studenta/i, /student portal/i], viaFallback: "https://is.stuba.sk/auth/student/moje_studium.pl?_m=3110" },
    { key: "courses", patterns: [/katal[oó]g predmetov/i, /course catalogue/i, /katalog předmětů/i], fallback: "/katalog/" },
    { key: "documents", patterns: [/dokumentov[ýy] server/i, /document server/i, /dokumentačný server/i], fallback: "/dok_server/" },
    { key: "messages", patterns: [/poštov[aá] schr[aá]nka/i, /mailbox/i, /^pošta$/i, /^mail$/i] },
    { key: "announcements", patterns: [/oznamy/i, /announcements?/i, /aktuality/i, /novinky/i], fallback: "/auth/", preferFallback: true },
    { key: "settings", patterns: [/použ[ií]vateľsk[eé] nastavenia/i, /user settings/i, /uživatelsk[eé] nastaven[ií]/i, /^nastavenia$/i, /^settings$/i] }
  ];

  let settings = { ...DEFAULTS };
  let mutationTimer = 0;
  let observer;

  function svg(name, className = "") {
    return `<svg class="stu-icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.chevron}</svg>`;
  }

  function detectPageLanguage() {
    const queryLang = new URLSearchParams(location.search).get("lang");
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    const sample = (document.body?.innerText || "").slice(0, 3000);
    if (queryLang === "sk" || htmlLang.startsWith("sk") || /Osobná administratíva|Prihlásiť do systému|(?:Akademický|Univerzitný) informačný systém/.test(sample)) return "sk";
    if (queryLang === "cz" || htmlLang.startsWith("cs") || /Osobní administrativa|Přihlásit do systému|(?:Akademický|Univerzitní) informační systém/.test(sample)) return "cs";
    return "en";
  }

  function detectLanguage() {
    return ["en", "sk", "cs"].includes(settings.uiLanguage) ? settings.uiLanguage : detectPageLanguage();
  }

  function languageHref(language) {
    const siteCode = language === "cs" ? "cz" : language;
    const names = {
      en: /english|anglick/i,
      sk: /slovensk/i,
      cs: /česk|czech/i
    };
    const original = allOriginalLinks().find((link) => {
      if (!link.closest("#vlajky, #ikonky, #hlavicka")) return false;
      const description = `${link.textContent || ""} ${link.title || ""} ${link.querySelector("img")?.alt || ""}`;
      return new RegExp(`[?;&]lang=${siteCode}(?:[;&]|$)`, "i").test(link.href) || names[language].test(description);
    });
    if (original) return original.href;

    const raw = location.href;
    if (/[?;&]lang=(?:en|sk|cz)(?=[;&]|#|$)/i.test(raw)) {
      return raw.replace(/([?;&]lang=)(?:en|sk|cz)(?=[;&]|#|$)/i, `$1${siteCode}`);
    }
    const hashIndex = raw.indexOf("#");
    const hash = hashIndex >= 0 ? raw.slice(hashIndex) : "";
    const withoutHash = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
    return `${withoutHash}${withoutHash.includes("?") ? ";" : "?"}lang=${siteCode}${hash}`;
  }

  function label(key) {
    const language = document.documentElement.dataset.stuLanguage || detectLanguage();
    return LABELS[language]?.[key] || LABELS.en[key] || key;
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function usableHref(anchor) {
    const raw = anchor?.getAttribute("href") || "";
    return raw && !raw.startsWith("javascript:") && raw !== "#" && !anchor.closest(SHELL_SELECTOR);
  }

  function allOriginalLinks() {
    return [...document.querySelectorAll("a[href]")].filter(usableHref);
  }

  function findLink(patterns) {
    const links = allOriginalLinks();
    for (const pattern of patterns) {
      const exact = links.find((link) => pattern.test(normalizeText(link.textContent)));
      if (exact) return exact.href;
    }
    return "";
  }

  function navItem(key) {
    return NAV_ITEMS.find((item) => item.key === key);
  }

  function pendingNavigation() {
    try {
      const value = JSON.parse(sessionStorage.getItem(PENDING_NAV_KEY) || "null");
      if (!value || !navItem(value.key) || Date.now() - value.createdAt > 30000 || value.hops > 4) {
        sessionStorage.removeItem(PENDING_NAV_KEY);
        return null;
      }
      return value;
    } catch (_) {
      return null;
    }
  }

  function savePendingNavigation(key, hops = 0) {
    try {
      sessionStorage.setItem(PENDING_NAV_KEY, JSON.stringify({ key, hops, createdAt: Date.now() }));
    } catch (_) { /* Session storage can be unavailable in a locked-down browser. */ }
  }

  function clearPendingNavigation() {
    try { sessionStorage.removeItem(PENDING_NAV_KEY); } catch (_) { /* No-op. */ }
  }

  function showToast(message) {
    document.querySelector(".stu-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "stu-toast";
    toast.dataset.stuModernShell = "true";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 180);
    }, 2400);
  }

  function openResolvedNavigation(key, fromPending = false) {
    const item = navItem(key);
    if (!item) return false;

    if (item.preferFallback && item.fallback) {
      clearPendingNavigation();
      location.assign(new URL(item.fallback, location.origin).href);
      return true;
    }

    const direct = findLink(item.patterns);
    if (direct && direct !== location.href) {
      clearPendingNavigation();
      location.assign(direct);
      return true;
    }

    const state = pendingNavigation();
    const hops = state?.key === key ? state.hops : 0;
    if (item.via) {
      const via = findLink(item.via);
      if (via && via !== location.href) {
        savePendingNavigation(key, hops + 1);
        location.assign(via);
        return true;
      }
    }

    if (item.viaFallback) {
      const viaFallback = new URL(item.viaFallback, location.origin).href;
      if (location.href !== viaFallback) {
        savePendingNavigation(key, hops + 1);
        location.assign(viaFallback);
        return true;
      }
    }

    if (location.pathname !== "/auth/" && location.pathname !== "/auth") {
      savePendingNavigation(key, hops + 1);
      location.assign(new URL("/auth/", location.origin).href);
      return true;
    }

    if (item.fallback) {
      clearPendingNavigation();
      location.assign(new URL(item.fallback, location.origin).href);
      return true;
    }

    if (fromPending) clearPendingNavigation();
    showToast(label("unavailable"));
    return false;
  }

  function resumePendingNavigation() {
    const pending = pendingNavigation();
    return pending ? openResolvedNavigation(pending.key, true) : false;
  }

  function currentSection() {
    const candidates = [
      document.querySelector("#base-r h1"),
      document.querySelector("#base h1"),
      document.querySelector('[aria-label="breadcrumb"] li:last-child'),
      document.querySelector("#base-r .breadcrumb li:last-child"),
      document.querySelector("#base-r h2"),
      document.querySelector("title")
    ];
    for (const element of candidates) {
      const text = normalizeText(element?.textContent);
      if (text) return text.replace(/^[»›\-\s]+/, "");
    }
    return label("dashboard");
  }

  function userDetails() {
    const log = document.querySelector("#log");
    const text = normalizeText(log?.innerText).replace(/^(login|signed in|prihl[aá]sen[ýy]|přihl[aá]šen[ýy])\s*:?\s*/i, "");
    const profile = allOriginalLinks().find((a) => /profile|profil|osobn[íá] údaje/i.test(normalizeText(a.textContent)));
    return { name: text && text.length < 80 ? text : "STU IS", href: profile?.href || "" };
  }

  function pageAlerts() {
    const selectors = [".uis_msg", ".warning", ".error", ".notice", ".info", ".highlightbox"];
    const elements = [...new Set(selectors.flatMap((selector) => [...document.querySelectorAll(selector)]))];
    return elements
      .filter((element) => !element.closest(SHELL_SELECTOR) && element.id !== "loginform" && element.offsetParent !== null)
      .map((element) => ({ element, text: normalizeText(element.innerText).slice(0, 220) }))
      .filter((item) => item.text);
  }

  function themeIcon() {
    const effectiveDark = document.documentElement.dataset.stuTheme === "dark";
    return svg(effectiveDark ? "sun" : "moon");
  }

  function resolveEffectiveTheme(theme = settings.theme) {
    if (theme === "dark" || theme === "light") return theme;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme() {
    document.documentElement.dataset.stuTheme = resolveEffectiveTheme();
    const button = document.querySelector("[data-stu-theme-toggle]");
    if (button) button.innerHTML = themeIcon();
  }

  function setStored(values) {
    settings = { ...settings, ...values };
    try { chrome.storage.local.set(values); } catch (_) { /* Extension may be reloading. */ }
  }

  function cycleTheme() {
    const next = document.documentElement.dataset.stuTheme === "dark" ? "light" : "dark";
    setStored({ theme: next });
    applyTheme();
  }

  function buildNav() {
    const here = location.href;
    return NAV_ITEMS.map((item) => {
      const discovered = findLink(item.patterns);
      const fallback = item.fallback ? new URL(item.fallback, location.origin).href : "";
      const viaFallback = item.viaFallback ? new URL(item.viaFallback, location.origin).href : "";
      const href = item.preferFallback && fallback ? fallback : discovered || fallback || viaFallback || new URL("/auth/", location.origin).href;
      const titleMatches = item.patterns.some((pattern) => pattern.test(currentSection()));
      const active = titleMatches || (discovered && (here === discovered || (new URL(discovered).pathname !== "/" && here.startsWith(discovered))));
      return `<a class="stu-nav-item${active ? " is-active" : ""}" href="${escapeAttribute(href)}" data-stu-nav-key="${item.key}" title="${escapeAttribute(label(item.key))}">${svg(item.key)}<span>${escapeHTML(label(item.key))}</span></a>`;
    }).join("");
  }

  function usefulLinks() {
    const excluded = new Set(NAV_ITEMS.flatMap((item) => item.patterns.map(String)));
    const links = allOriginalLinks().filter((link) => {
      const text = normalizeText(link.textContent);
      return text.length >= 3 && text.length <= 42 && !/^\?|home$/i.test(text) && ![...excluded].some((source) => new RegExp(source.slice(1, source.lastIndexOf("/")), "i").test(text));
    });
    const seen = new Set();
    return links.filter((link) => {
      const key = `${link.href}|${normalizeText(link.textContent).toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);
  }

  function buildShell() {
    document.querySelectorAll(SHELL_SELECTOR).forEach((node) => node.remove());
    const language = detectLanguage();
    const pageLanguage = detectPageLanguage();
    document.documentElement.dataset.stuLanguage = language;
    const section = currentSection();
    const user = userDetails();
    const alerts = pageAlerts();
    const shell = document.createElement("div");
    shell.dataset.stuModernShell = "true";
    shell.innerHTML = `
      <div class="stu-mobile-scrim" data-stu-close-menu></div>
      <aside class="stu-sidebar" aria-label="${escapeAttribute(label("navigation"))}">
        <div class="stu-sidebar-head">
          <a class="stu-brand" href="${escapeAttribute(new URL("/auth/", location.origin).href)}" aria-label="UIS+">
            <span class="stu-brand-mark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
            <span class="stu-brand-copy"><b>UIS+</b><small>STU · Better</small></span>
          </a>
          <button class="stu-sidebar-toggle" type="button" data-stu-sidebar-toggle aria-label="${escapeAttribute(settings.sidebarCollapsed ? label("expand") : label("collapse"))}" title="${escapeAttribute(settings.sidebarCollapsed ? label("expand") : label("collapse"))}">${svg("panel")}</button>
        </div>
        <div class="stu-sidebar-label">${escapeHTML(label("navigation"))}</div>
        <nav class="stu-nav">${buildNav()}</nav>
        <div class="stu-sidebar-foot"><span class="stu-status-dot"></span><span>is.stuba.sk</span><b>LOCAL</b></div>
      </aside>
      <header class="stu-topbar">
        <button class="stu-icon-button stu-menu-button" type="button" data-stu-open-menu aria-label="${escapeAttribute(label("openMenu"))}">${svg("menu")}</button>
        <div class="stu-section-copy"><small>${escapeHTML(label("app"))}</small><strong>${escapeHTML(section)}</strong></div>
        <div class="stu-top-actions">
          <div class="stu-language-picker">
            <button class="stu-language-button" type="button" data-stu-language-toggle aria-label="${escapeAttribute(label("language"))}" aria-expanded="false">${svg("globe")}<b>${pageLanguage.toUpperCase()}</b></button>
            <div class="stu-language-menu" aria-hidden="true">
              <a href="${escapeAttribute(languageHref("en"))}" data-stu-language="en" class="${pageLanguage === "en" ? "is-current" : ""}"><b>EN</b><span>English</span></a>
              <a href="${escapeAttribute(languageHref("sk"))}" data-stu-language="sk" class="${pageLanguage === "sk" ? "is-current" : ""}"><b>SK</b><span>Slovenčina</span></a>
              <a href="${escapeAttribute(languageHref("cs"))}" data-stu-language="cs" class="${pageLanguage === "cs" ? "is-current" : ""}"><b>CZ</b><span>Čeština</span></a>
            </div>
          </div>
          <button class="stu-icon-button" type="button" data-stu-theme-toggle aria-label="${escapeAttribute(label("theme"))}">${themeIcon()}</button>
          <button class="stu-icon-button stu-notification-button" type="button" data-stu-notifications-toggle aria-label="${escapeAttribute(label("notifications"))}">${svg("bell")}${alerts.length ? `<span>${alerts.length > 9 ? "9+" : alerts.length}</span>` : ""}</button>
          ${user.href ? `<a class="stu-user-chip" href="${escapeAttribute(user.href)}">` : `<span class="stu-user-chip">`}
            <span class="stu-avatar">${svg("user")}</span><span class="stu-user-copy"><small>${escapeHTML(label("profile"))}</small><b>${escapeHTML(user.name)}</b></span>
          ${user.href ? "</a>" : "</span>"}
        </div>
      </header>
      <aside class="stu-notifications" aria-hidden="true">
        <div class="stu-drawer-head"><div><small>UIS+</small><h2>${escapeHTML(label("notifications"))}</h2></div><button class="stu-icon-button" type="button" data-stu-notifications-close aria-label="${escapeAttribute(label("close"))}">${svg("close")}</button></div>
        <div class="stu-drawer-list">
          ${alerts.length ? alerts.map((alert, index) => `<button type="button" data-stu-alert-index="${index}"><span class="stu-alert-indicator"></span><span>${escapeHTML(alert.text)}</span>${svg("chevron")}</button>`).join("") : `<div class="stu-drawer-empty">${svg("bell")}<p>${escapeHTML(label("noNotifications"))}</p></div>`}
        </div>
      </aside>`;
    document.body.appendChild(shell);

    shell.querySelector("[data-stu-open-menu]")?.addEventListener("click", () => document.documentElement.classList.add("stu-menu-open"));
    shell.querySelectorAll("[data-stu-close-menu]").forEach((button) => button.addEventListener("click", () => document.documentElement.classList.remove("stu-menu-open")));
    shell.querySelector("[data-stu-sidebar-toggle]")?.addEventListener("click", () => {
      setStored({ sidebarCollapsed: !settings.sidebarCollapsed });
      applySidebarState();
    });
    shell.querySelector("[data-stu-theme-toggle]")?.addEventListener("click", cycleTheme);
    const languagePicker = shell.querySelector(".stu-language-picker");
    const languageMenu = shell.querySelector(".stu-language-menu");
    const toggleLanguageMenu = (open) => {
      languagePicker?.classList.toggle("is-open", open);
      languagePicker?.querySelector("[data-stu-language-toggle]")?.setAttribute("aria-expanded", String(open));
      languageMenu?.setAttribute("aria-hidden", String(!open));
    };
    shell.querySelector("[data-stu-language-toggle]")?.addEventListener("click", () => toggleLanguageMenu(!languagePicker?.classList.contains("is-open")));
    shell.querySelectorAll("[data-stu-language]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      const nextLanguage = link.dataset.stuLanguage;
      const target = link.href;
      settings.uiLanguage = nextLanguage;
      toggleLanguageMenu(false);
      let opened = false;
      const openTarget = () => {
        if (opened) return;
        opened = true;
        location.assign(target);
      };
      try {
        chrome.storage.local.set({ uiLanguage: nextLanguage }, openTarget);
        setTimeout(openTarget, 180);
      } catch (_) {
        openTarget();
      }
    }));
    shell.querySelectorAll("[data-stu-nav-key]").forEach((link) => link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.documentElement.classList.remove("stu-menu-open");
      showToast(label("navigating"));
      openResolvedNavigation(link.dataset.stuNavKey);
    }));
    const drawer = shell.querySelector(".stu-notifications");
    const toggleDrawer = (open) => {
      document.documentElement.classList.toggle("stu-notifications-open", open);
      drawer?.setAttribute("aria-hidden", String(!open));
    };
    shell.querySelector("[data-stu-notifications-toggle]")?.addEventListener("click", () => toggleDrawer(!document.documentElement.classList.contains("stu-notifications-open")));
    shell.querySelector("[data-stu-notifications-close]")?.addEventListener("click", () => toggleDrawer(false));
    shell.querySelectorAll("[data-stu-alert-index]").forEach((button) => button.addEventListener("click", () => {
      const target = alerts[Number(button.dataset.stuAlertIndex)]?.element;
      toggleDrawer(false);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.animate?.([{ outlineColor: "transparent" }, { outlineColor: "var(--stu-primary)" }, { outlineColor: "transparent" }], { duration: 1300 });
    }));
    shell.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => document.documentElement.classList.remove("stu-menu-open")));
  }

  function applySidebarState() {
    document.documentElement.classList.toggle("stu-sidebar-collapsed", Boolean(settings.sidebarCollapsed));
    const toggle = document.querySelector("[data-stu-sidebar-toggle]");
    if (toggle) {
      const text = settings.sidebarCollapsed ? label("expand") : label("collapse");
      toggle.setAttribute("aria-label", text);
      toggle.setAttribute("title", text);
    }
  }

  function enhanceContent() {
    const base = document.querySelector("#base-r") || document.querySelector("#base");
    if (!base) return;
    document.body.classList.toggle("stu-login-page", Boolean(document.querySelector("#loginform")));
    document.body.classList.toggle("stu-home-page", location.pathname === "/" || location.pathname === "/auth/" && !document.querySelector("#loginform"));

    base.querySelectorAll("table").forEach((table) => {
      if (table.closest(".stu-table-scroll") || table.closest(SHELL_SELECTOR)) return;
      table.classList.add("stu-table");
      const rows = [...table.rows];
      const meaningful = rows.filter((row) => normalizeText(row.textContent));
      rows.forEach((row) => row.classList.toggle("stu-empty-row", !normalizeText(row.textContent)));
      if (location.pathname === "/" && meaningful.length >= 4 && !table.querySelector("th")) {
        table.classList.add("stu-home-grid");
      } else if (meaningful.length === 1 && !table.querySelector("input, select, textarea")) {
        table.classList.add("stu-notice-card");
      }
      if (!table.classList.contains("stu-home-grid") && !table.classList.contains("stu-notice-card") && table.scrollWidth > base.clientWidth) {
        table.classList.add("stu-wide-table");
      }
    });
    base.querySelectorAll(".uis_msg").forEach((message) => {
      if (message.classList.contains("ko")) message.dataset.stuKind = "danger";
      else if (message.classList.contains("warning") || message.classList.contains("warn")) message.dataset.stuKind = "warning";
      else message.dataset.stuKind = "info";
    });
    base.querySelectorAll('input[type="submit"], input[type="button"], button').forEach((button) => button.classList.add("stu-control-button"));

    base.querySelectorAll("div, section, article, fieldset").forEach((element) => {
      if (element.closest(SHELL_SELECTOR)) return;
      const rect = element.getBoundingClientRect();
      if (rect.width < 220 || rect.height < 28) return;
      const background = getComputedStyle(element).backgroundColor;
      const inlineBackground = `${element.style.background || ""} ${element.style.backgroundColor || ""}`;
      if (/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255,\s*1\)/.test(background) || /#fff(?:fff)?\b|\bwhite\b/i.test(inlineBackground)) {
        element.classList.add("stu-legacy-surface");
      }
    });
  }

  function applySettings() {
    if (!settings.enabled) {
      teardown();
      return;
    }
    document.documentElement.classList.add(ROOT_CLASS);
    document.documentElement.classList.toggle("stu-compact", Boolean(settings.compact));
    applySidebarState();
    applyTheme();
    if (!document.body) return;
    enhanceContent();
    if (resumePendingNavigation()) return;
    buildShell();
  }

  function teardown() {
    observer?.disconnect();
    document.querySelectorAll(SHELL_SELECTOR).forEach((node) => node.remove());
    document.documentElement.classList.remove(ROOT_CLASS, "stu-compact", "stu-sidebar-collapsed", "stu-menu-open", "stu-notifications-open");
    delete document.documentElement.dataset.stuTheme;
    delete document.documentElement.dataset.stuLanguage;
    document.body?.classList.remove("stu-login-page", "stu-home-page");
  }

  function observePage() {
    observer?.disconnect();
    observer = new MutationObserver((mutations) => {
      if (!settings.enabled || mutations.every((m) => [...m.addedNodes].every((node) => node.nodeType === 1 && node.matches?.(SHELL_SELECTOR)))) return;
      clearTimeout(mutationTimer);
      mutationTimer = setTimeout(() => {
        enhanceContent();
        const title = document.querySelector(".stu-section-copy strong");
        if (title) title.textContent = currentSection();
      }, 180);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
  }

  function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
  }

  function start() {
    try {
      chrome.storage.local.get(DEFAULTS, (stored) => {
        settings = { ...DEFAULTS, ...(stored || {}) };
        applySettings();
        if (settings.enabled) observePage();
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        const displayChanges = Object.entries(changes).filter(([key]) => Object.hasOwn(DEFAULTS, key));
        if (!displayChanges.length) return;
        for (const [key, change] of displayChanges) settings[key] = change.newValue;
        applySettings();
        if (settings.enabled) observePage();
      });
    } catch (_) {
      settings = { ...DEFAULTS };
      applySettings();
      observePage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    if (settings.theme === "system") applyTheme();
  });
})();
