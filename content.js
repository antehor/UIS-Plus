/* ==========================================================================
   UIS+ — application shell for https://is.stuba.sk
   Builds the topbar, sidebar, breadcrumb bar, command palette and drawer.
   Page-specific work lives in pages.js and reads window.UISPlus.
   ========================================================================== */

(function uisPlusShell() {
  "use strict";

  const ROOT_CLASS = "stu-modern";
  const BOOT_CLASS = "stu-boot";
  const SHELL_SELECTOR = "[data-stu-shell]";
  const MENU_CACHE_KEY = "uisMenuCache";
  const MENU_CACHE_TTL = 1000 * 60 * 60 * 24 * 14;
  const ASSIGNMENTS_KEY = "uisAssignments";

  const DEFAULTS = Object.freeze({
    enabled: true,
    theme: "system",
    sidebarCollapsed: false
  });

  /* ------------------------------------------------------------------ icons */

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1H9.5v-5.5h5V21h3a1 1 0 0 0 1-1V9.5"/>',
    study: '<path d="m3 8 9-4.5L21 8l-9 4.5z"/><path d="M7 10.6V16c3 1.9 7 1.9 10 0v-5.4"/><path d="M21 8v6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/>',
    elearning: '<path d="M4 4.5h6a2.5 2.5 0 0 1 2 2.5 2.5 2.5 0 0 1 2-2.5h6v13h-6a2.5 2.5 0 0 0-2 2 2.5 2.5 0 0 0-2-2H4z"/><path d="M12 7v12.5"/>',
    research: '<path d="M9.5 3v6.2L4.3 18a2 2 0 0 0 1.7 3h12a2 2 0 0 0 1.7-3l-5.2-8.8V3"/><path d="M8.5 3h7"/><path d="M7.4 14.5h9.2"/>',
    personal: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 7.4 5.6a2 2 0 0 0 2.2 0L20.5 7"/>',
    docs: '<path d="M6 2.5h7l5 5V21a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 21z"/><path d="M13 2.5v5h5"/><path d="M9 13h6M9 17h4"/>',
    tech: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
    contact: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="2.5" y="13" width="4.5" height="6.5" rx="2"/><rect x="17" y="13" width="4.5" height="6.5" rx="2"/><path d="M19 19.5a2.5 2.5 0 0 1-2.5 2.5H13"/>',
    help: '<circle cx="12" cy="12" r="9.2"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><path d="M12 17.4h.01"/>',
    bell: '<path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 6.5-2.5 8.5h17c0-2-2.5-2-2.5-8.5"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevronRight: '<path d="m9.5 5 7 7-7 7"/>',
    chevronLeft: '<path d="m14.5 5-7 7 7 7"/>',
    chevronDown: '<path d="m5 9 7 7 7-7"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    panel: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M9.5 4.5v15"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2 12h2M20 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/>',
    moon: '<path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5a8.5 8.5 0 1 0 11.8 11.8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3.2 9.5h17.6M3.2 14.5h17.6"/><path d="M12 3a15 15 0 0 1 0 18A15 15 0 0 1 12 3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.3 2"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11"/><circle cx="12" cy="10" r="2.6"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    filter: '<path d="M3.5 5.5h17l-6.6 7.6V20l-3.8-2.3v-4.6z"/>',
    calendarPlus: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/><path d="M12 12.5v5M9.5 15h5"/>',
    info: '<circle cx="12" cy="12" r="9.2"/><path d="M12 11v5.5M12 7.8h.01"/>',
    check: '<path d="M4.5 12.5 9.5 17.5 19.5 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9.2"/><path d="m8.2 12.3 2.6 2.6 5-5.2"/>',
    alert: '<path d="M12 3.5 21 19.5H3z"/><path d="M12 9.5v4.2M12 17h.01"/>',
    external: '<path d="M14 3.5h6.5V10"/><path d="M20 4 10.5 13.5"/><path d="M18.5 14v5.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1H10"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 4v5h-5"/>',
    megaphone: '<path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H8l8 4.5V6L8 10.5H5.5A1.5 1.5 0 0 0 4 12"/><path d="M19 10a3.5 3.5 0 0 1 0 4"/>',
    reply: '<path d="M9.5 6 4 11.5 9.5 17"/><path d="M4 11.5h9a7 7 0 0 1 7 7v1"/>',
    send: '<path d="M21 3 10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8z"/>',
    folder: '<path d="M3.5 6.5a2 2 0 0 1 2-2h3.4l2 2.4h7.6a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    layers: '<path d="m12 3 9 4.8-9 4.9-9-4.9z"/><path d="m3.6 12 8.4 4.6 8.4-4.6"/><path d="m3.6 16.4 8.4 4.6 8.4-4.6"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19v3.5H5.5A1.5 1.5 0 0 1 4 20z"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.8-1.3 7.2 4.8-2.6 4.8 2.6-1.3-7.2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.4 3.2M6.6 6.6C3.9 8.3 2.5 12 2.5 12S6 18.5 12 18.5a9 9 0 0 0 5.4-1.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M3 3l18 18"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 10.5h6M9 14.5h6M9 18h3.5"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M15.5 4.8a3.4 3.4 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    game: '<rect x="2.5" y="7" width="19" height="11" rx="4"/><path d="M7 12.5h4M9 10.5v4M15.5 11.5h.01M17.5 13.5h.01"/>'
  };

  /* ------------------------------------------------------------- vocabulary */

  const LABELS = {
    sk: {
      app: "Univerzitný informačný systém",
      university: "Slovenská technická univerzita v Bratislave",
      home: "Domov",
      study: "Moje štúdium",
      timetable: "Rozvrh hodín",
      elearning: "eLearning",
      research: "Veda a výskum",
      personal: "Osobný manažment",
      mail: "Poštová schránka",
      docs: "Dokumentový server",
      tech: "Technológie a správa",
      contact: "Kontaktné centrum",
      help: "Pomoc a návody",
      searchPlaceholder: "Hľadať v UIS (predmety, dokumenty, osoby…)",
      searchTitle: "Hľadať aplikáciu alebo sekciu…",
      navigation: "Navigácia",
      notifications: "Upozornenia",
      noNotifications: "Žiadne nové upozornenia",
      messages: "Správy",
      documents: "Dokumenty",
      tasks: "Úlohy",
      profile: "Profil",
      student: "študent",
      theme: "Prepnúť tému",
      openMenu: "Otvoriť navigáciu",
      close: "Zavrieť",
      collapse: "Zbaliť bočný panel",
      expand: "Rozbaliť bočný panel",
      language: "Jazyk",
      sections: "Sekcie",
      applications: "Aplikácie",
      onThisPage: "Na tejto stránke",
      nothingFound: "Nič sa nenašlo",
      navigate: "otvoriť",
      close_esc: "Esc"
    },
    cs: {
      app: "Univerzitní informační systém",
      university: "Slovenská technická univerzita v Bratislavě",
      home: "Domů",
      study: "Moje studium",
      timetable: "Rozvrh hodin",
      elearning: "eLearning",
      research: "Věda a výzkum",
      personal: "Osobní management",
      mail: "Poštovní schránka",
      docs: "Dokumentový server",
      tech: "Technologie a správa",
      contact: "Kontaktní centrum",
      help: "Nápověda a návody",
      searchPlaceholder: "Hledat v UIS (předměty, dokumenty, osoby…)",
      searchTitle: "Hledat aplikaci nebo sekci…",
      navigation: "Navigace",
      notifications: "Upozornění",
      noNotifications: "Žádná nová upozornění",
      messages: "Zprávy",
      documents: "Dokumenty",
      tasks: "Úkoly",
      profile: "Profil",
      student: "student",
      theme: "Přepnout motiv",
      openMenu: "Otevřít navigaci",
      close: "Zavřít",
      collapse: "Sbalit boční panel",
      expand: "Rozbalit boční panel",
      language: "Jazyk",
      sections: "Sekce",
      applications: "Aplikace",
      onThisPage: "Na této stránce",
      nothingFound: "Nic nenalezeno",
      navigate: "otevřít",
      close_esc: "Esc"
    },
    en: {
      app: "University information system",
      university: "Slovak University of Technology in Bratislava",
      home: "Home",
      study: "My studies",
      timetable: "Timetable",
      elearning: "eLearning",
      research: "Research",
      personal: "Personal management",
      mail: "Mailbox",
      docs: "Document server",
      tech: "Technology and administration",
      contact: "Contact centre",
      help: "Help and guides",
      searchPlaceholder: "Search UIS (courses, documents, people…)",
      searchTitle: "Search for an application or section…",
      navigation: "Navigation",
      notifications: "Notifications",
      noNotifications: "No new notifications",
      messages: "Messages",
      documents: "Documents",
      tasks: "Tasks",
      profile: "Profile",
      student: "student",
      theme: "Switch theme",
      openMenu: "Open navigation",
      close: "Close",
      collapse: "Collapse sidebar",
      expand: "Expand sidebar",
      language: "Language",
      sections: "Sections",
      applications: "Applications",
      onThisPage: "On this page",
      nothingFound: "Nothing found",
      navigate: "open",
      close_esc: "Esc"
    }
  };

  /* --------------------------------------------------------------- nav model
     Every entry resolves against the live UIS menu that is harvested from the
     personal administration page, so no student-specific URL is hard-coded.
     `fallback` is only used until that menu has been seen once.             */

  const NAV_ITEMS = [
    { key: "home", icon: "home", fallback: "/auth/", match: [/^\/auth\/?$/] },
    { key: "study", icon: "study", menu: [/^port[áa]l [šs]t?ud[ei]nta$/i, /^student'?s portal$/i], fallback: "/auth/student/moje_studium.pl?_m=3110", match: [/^\/auth\/student\//] },
    { key: "timetable", icon: "calendar", menu: [/^osobn[ýyí] rozvrh$/i, /^(?:personal|my) timetable$/i], fallback: "/auth/katalog/rozvrhy_view.pl?rozvrh_student_obec=1;zobraz=1", match: [/rozvrhy_view/] },
    { key: "elearning", icon: "elearning", section: [/^elearning$/i], fallback: "/auth/el/", match: [/^\/auth\/el\//] },
    { key: "personal", icon: "personal", section: [/osobn[ýyí] mana[žz]/i, /personal management/i], fallback: "/auth/lide/", match: [/^\/auth\/lide\//] },
    { key: "mail", icon: "mail", counter: "messages", menu: [/^po[šs]tov[áa] schr[áa]nka$/i, /^po[šs]tovn[íi] schr[áa]nka$/i, /^mail ?box$/i], fallback: "/auth/posta/", match: [/^\/auth\/posta\//] },
    { key: "docs", icon: "docs", counter: "documents", menu: [/^dokumentov[ýy] server$/i, /^document server$/i], fallback: "/auth/dok_server/", match: [/^\/auth\/dok_server\//] },
    { key: "tech", icon: "tech", section: [/technol[óo]g/i], fallback: "/auth/sprava/", match: [/^\/auth\/sprava\//] },
    { key: "separator" },
    { key: "contact", icon: "contact", menu: [/^kontaktn[éeíi] centrum$/i, /^contact cent(?:re|er)$/i], fallback: "/auth/kontakt/", match: [/^\/auth\/kontakt/] },
    { key: "help", icon: "help", menu: [/dokument[áa]cia uis/i, /dokumentace uis/i, /uis documentation/i, /^n[áa]pov[ěe]da/i], fallback: "/auth/dokumentace/", match: [/^\/auth\/dokumentace/, /help\.pl/] }
  ];

  /* --------------------------------------------------------------- state */

  let settings = { ...DEFAULTS };
  let menuCache = { sections: [], savedAt: 0 };
  let counters = { messages: 0, documents: 0, tasks: 0 };
  /* Open submission places ("Miesta odovzdania") read by the page layer from
     the student portal; kept so every page can count what is still due. */
  let assignments = { items: [], savedAt: 0 };
  let observer = null;
  let observerTimer = 0;

  /* -------------------------------------------------------------- helpers */

  function svg(name, className) {
    const body = ICONS[name] || ICONS.chevronRight;
    return `<svg class="stu-icon${className ? " " + className : ""}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  }

  function escapeHTML(value) {
    return String(value === undefined || value === null ? "" : value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[c]));
  }

  function text(node) {
    return String(node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function absolute(href) {
    try {
      return new URL(href, location.origin).href;
    } catch (_) {
      return "";
    }
  }

  /* UIS separates query parameters with ";" and switches the whole interface
     from the "lang" parameter. Navigation links must carry the language the
     student is currently reading, otherwise every jump falls back to the
     server default and the interface flips between Slovak and English. */
  function withLang(href, target) {
    const url = absolute(href);
    if (!url || !url.startsWith(location.origin)) return url;

    const code = (target || pageLanguage()) === "cs" ? "cz" : (target || pageLanguage());
    if (/[?;&]lang=(?:en|sk|cz|cs)(?=[;&]|#|$)/i.test(url)) {
      return url.replace(/([?;&]lang=)(?:en|sk|cz|cs)(?=[;&]|#|$)/i, `$1${code}`);
    }

    const hashAt = url.indexOf("#");
    const hash = hashAt >= 0 ? url.slice(hashAt) : "";
    const base = hashAt >= 0 ? url.slice(0, hashAt) : url;
    return `${base}${base.includes("?") ? ";" : "?"}lang=${code}${hash}`;
  }

  function pageLanguage() {
    const query = new URLSearchParams(location.search.replace(/;/g, "&")).get("lang");
    if (query === "sk") return "sk";
    if (query === "cz" || query === "cs") return "cs";
    if (query === "en") return "en";
    const html = (document.documentElement.lang || "").toLowerCase();
    if (html.startsWith("sk")) return "sk";
    if (html.startsWith("cs")) return "cs";
    const sample = (document.body ? document.body.innerText : "").slice(0, 2500);
    if (/Osobn[áa] administrat[íi]va|Univerzitn[ýy] informa[čc]n[ýy]|Prihl[áa]sen/i.test(sample)) return "sk";
    if (/Osobní administrativa|Univerzitní informační|Přihlášen/i.test(sample)) return "cs";
    return "en";
  }

  /* The interface always speaks the language STU serves the page in; the
     language picker in the breadcrumb bar switches both at once. */
  function language() {
    return pageLanguage();
  }

  function label(key) {
    const lang = document.documentElement.dataset.stuLanguage || language();
    return (LABELS[lang] && LABELS[lang][key]) || LABELS.en[key] || key;
  }

  function storageGet(defaults) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(defaults, (value) => resolve(value || defaults));
      } catch (_) {
        resolve(defaults);
      }
    });
  }

  function storageSet(values) {
    try {
      chrome.storage.local.set(values);
    } catch (_) { /* The extension context can be reloading. */ }
  }

  function toast(message) {
    const existing = document.querySelector(".stu-toast");
    if (existing) existing.remove();
    const node = document.createElement("div");
    node.className = "stu-toast";
    node.dataset.stuShell = "true";
    node.textContent = message;
    document.body.appendChild(node);
    requestAnimationFrame(() => node.classList.add("is-visible"));
    setTimeout(() => {
      node.classList.remove("is-visible");
      setTimeout(() => node.remove(), 220);
    }, 2600);
  }

  /* ------------------------------------------------------------- live menu */

  function harvestMenu() {
    const blocks = [...document.querySelectorAll(".polozky-obal")];
    if (!blocks.length) return false;

    const sections = blocks.map((block) => {
      const title = text(block.querySelector(".sekce-nadpis"));
      const items = [...block.querySelectorAll("a[href]")]
        .map((link) => ({ text: text(link), href: absolute(link.getAttribute("href")) }))
        .filter((item) => item.text && item.href);
      return { title, items };
    }).filter((section) => section.title && section.items.length);

    if (!sections.length) return false;
    menuCache = { sections, lang: pageLanguage(), savedAt: Date.now() };
    storageSet({ [MENU_CACHE_KEY]: menuCache });
    return true;
  }

  function menuItems() {
    return menuCache.sections.flatMap((section) =>
      section.items.map((item) => ({ ...item, section: section.title })));
  }

  /* `claimed` holds the destinations other entries already point at, so a
     section entry never duplicates a link that has its own place in the rail —
     otherwise "Osobný manažment" lands on the mailbox, which is the first item
     of that section and already the "Poštová schránka" entry. */
  function resolveNav(item, claimed) {
    if (item.menu) {
      const hit = menuItems().find((entry) => item.menu.some((pattern) => pattern.test(entry.text)));
      if (hit) return { href: withLang(hit.href) };
    }
    if (item.section) {
      const section = menuCache.sections.find((entry) => item.section.some((pattern) => pattern.test(entry.title)));
      if (section && section.items.length) {
        const free = claimed
          ? section.items.find((entry) => !claimed.has(entry.href))
          : section.items[0];
        const picked = free || section.items[0];
        /* When the section's own first entry is already in the rail we fall
           through to another application, so the label follows the target
           rather than promising the section. */
        /* The cached menu is in the language of the page it was read from;
           its wording is only borrowed while the interface uses that language. */
        const sameLanguage = menuCache.lang === (document.documentElement.dataset.stuLanguage || language());
        const renamed = picked !== section.items[0] && sameLanguage ? picked.text : "";
        return { href: withLang(picked.href), text: renamed };
      }
    }
    return { href: withLang(item.fallback || "/auth/") };
  }

  function isActiveNav(item) {
    if (!item.match) return false;
    const path = location.pathname + location.search;
    return item.match.some((pattern) => pattern.test(path));
  }

  /* --------------------------------------------------------- page metadata */

  function dueAssignments() {
    const now = Date.now();
    return (assignments.items || [])
      .filter((item) => Number(item.deadline) > now)
      .sort((a, b) => a.deadline - b.deadline);
  }

  /* "Úlohy" counts the native UIS tasks plus every open submission place
     whose deadline has not passed yet. */
  function readCounters() {
    const result = { messages: 0, documents: 0, tasks: 0 };
    const ema = document.querySelector("#ema");
    if (!ema) {
      result.tasks = dueAssignments().length;
      return result;
    }
    const raw = text(ema);
    const pairs = [
      ["messages", /(\d+)\s*(?:spr[áa]v|zpr[áa]v|message)/i],
      ["documents", /(\d+)\s*(?:dokument|document)/i],
      ["tasks", /(\d+)\s*(?:[úu]loh|[úu]kol|task)/i]
    ];
    pairs.forEach(([key, pattern]) => {
      const found = raw.match(pattern);
      if (found) result[key] = Number(found[1]) || 0;
    });
    result.tasks += dueAssignments().length;
    return result;
  }

  function setAssignments(items) {
    assignments = { items: Array.isArray(items) ? items : [], savedAt: Date.now() };
    storageSet({ [ASSIGNMENTS_KEY]: assignments });
    counters = readCounters();
    const bell = document.querySelector(".stu-topbar [data-stu-drawer-open]");
    if (bell) {
      const count = pageAlerts().length + counters.tasks;
      bell.querySelector("b")?.remove();
      if (count) bell.insertAdjacentHTML("beforeend", `<b>${count > 9 ? "9+" : count}</b>`);
    }
  }

  function counterHref(kind) {
    const map = { messages: "/auth/posta/", documents: "/auth/dok_server/nove_dok.pl", tasks: "/auth/student/odevzdavarny.pl" };
    return withLang(map[kind] || "/auth/");
  }

  function userDetails() {
    const raw = text(document.querySelector("#log"))
      .replace(/^(logged in(?: as)?|login|signed in(?: as)?|prihl[áa]sen[ýya]|p[řr]ihl[áa][šs]en[ýya]?)\s*:?\s*/i, "");
    const name = raw && raw.length < 90 ? raw : "";
    const profile = [...document.querySelectorAll("#hlavicka a[href], #base-r a[href]")]
      .find((link) => /^(profil|profile|osobn[éa] [úu]daje|m[ôo]j profil)$/i.test(text(link)));
    const initials = name
      ? name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
      : "UIS";
    return { name: name || label("app"), initials, href: profile ? profile.href : "" };
  }

  function userRole() {
    const sample = text(document.querySelector("#base-r"));
    const faculty = sample.match(/\b(FEI|FIIT|SjF|SvF|FCHPT|FAD|MTF|ÚM)\b/);
    const role = /študentka|studentka/i.test(sample) ? "študentka" : label("student");
    return faculty ? `${role}, ${faculty[1]}` : role;
  }

  /* "#svatek" reads "16. 9. 2026 18:52 Ľudomila, Ľudmila" on the Slovak and
     Czech pages and "Oct 13, 2026 6:02 p.m. Koloman" on the English one — the
     server date and time followed by the name-day. Only the moment is useful
     in the bar, and the weekday is prepended so it reads like a calendar
     header. */
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  function serverMoment() {
    const raw = text(document.querySelector("#svatek"));
    let stamp = raw.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})(?:\s+\d{1,2}[:.]\d{2})?/);
    let date = stamp ? new Date(Number(stamp[3]), Number(stamp[2]) - 1, Number(stamp[1])) : null;
    if (!stamp) {
      stamp = raw.match(/\b([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})(?:\s+\d{1,2}[:.]\d{2}(?:\s*[ap]\.?\s?m\.?)?)?/i);
      const month = stamp ? MONTHS.indexOf(stamp[1].toLowerCase()) : -1;
      date = month >= 0 ? new Date(Number(stamp[3]), month, Number(stamp[2])) : null;
    }
    if (!stamp || !date) return raw;
    const lang = document.documentElement.dataset.stuLanguage || language();
    const names = {
      sk: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"],
      cs: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
      en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };
    const weekday = (names[lang] || names.en)[date.getDay()] || "";
    const moment = stamp[0].trim();
    return weekday ? `${weekday}${lang === "en" ? "," : ""} ${moment}` : moment;
  }

  /* The sign-in form is served at /auth/ itself, so the path alone cannot tell
     the login screen from the personal administration home. */
  function isLoginPage() {
    return Boolean(document.querySelector('#loginform, form[action*="/system/login.pl"]'));
  }

  function pageAlerts() {
    const nodes = [...document.querySelectorAll(".zasadka table, .uis_msg, .portlet")];
    return nodes
      .filter((node) => !node.closest(SHELL_SELECTOR))
      .map((node) => ({ element: node, text: text(node).slice(0, 210) }))
      .filter((entry) => entry.text && !/^žiadna\s|^žádná\s|^no\s/i.test(entry.text));
  }

  /* ------------------------------------------------------------ theme */

  function effectiveTheme(theme) {
    const value = theme || settings.theme;
    if (value === "dark" || value === "light") return value;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme() {
    const theme = effectiveTheme();
    document.documentElement.dataset.stuTheme = theme;
    const button = document.querySelector(".stu-topbar [data-stu-theme-toggle]");
    if (button) button.innerHTML = svg(theme === "dark" ? "sun" : "moon");
  }

  function toggleTheme() {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    settings.theme = next;
    storageSet({ theme: next });
    applyTheme();
  }

  /* ------------------------------------------------------------ language */

  function languageHref(target) {
    const code = target === "cs" ? "cz" : target;
    const native = [...document.querySelectorAll("#vlajky a[href], #hlavicka a[href]")]
      .find((link) => new RegExp(`[?;&]lang=${code}(?:[;&]|$)`, "i").test(link.href));
    if (native) return native.href;

    const raw = location.href;
    if (/[?;&]lang=(?:en|sk|cz|cs)(?=[;&]|#|$)/i.test(raw)) {
      return raw.replace(/([?;&]lang=)(?:en|sk|cz|cs)(?=[;&]|#|$)/i, `$1${code}`);
    }
    const hashAt = raw.indexOf("#");
    const hash = hashAt >= 0 ? raw.slice(hashAt) : "";
    const base = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
    return `${base}${base.includes("?") ? ";" : "?"}lang=${code}${hash}`;
  }

  function flag(code) {
    const flags = {
      sk: '<svg class="stu-flag" viewBox="0 0 9 6"><rect width="9" height="2" fill="#fff"/><rect y="2" width="9" height="2" fill="#0b4ea2"/><rect y="4" width="9" height="2" fill="#ee1c25"/></svg>',
      cs: '<svg class="stu-flag" viewBox="0 0 9 6"><rect width="9" height="3" fill="#fff"/><rect y="3" width="9" height="3" fill="#d7141a"/><path d="M0 0l4.5 3L0 6z" fill="#11457e"/></svg>',
      en: '<svg class="stu-flag" viewBox="0 0 9 6"><rect width="9" height="6" fill="#00247d"/><path d="M0 0l9 6M9 0L0 6" stroke="#fff" stroke-width="1.2"/><path d="M4.5 0v6M0 3h9" stroke="#fff" stroke-width="2"/><path d="M4.5 0v6M0 3h9" stroke="#cf142b" stroke-width="1.1"/></svg>'
    };
    return flags[code] || flags.en;
  }

  /* -------------------------------------------------------------- topbar */

  /* Nobody is signed in yet: no search, counters or profile, only the brand
     and the controls that make sense before signing in. */
  function buildGuestTopbar() {
    const header = document.createElement("header");
    header.className = "stu-topbar is-guest";
    header.dataset.stuShell = "true";
    header.innerHTML = `
      <a class="stu-brand" href="${escapeHTML(withLang("/"))}">
        <span class="stu-brand-mark">${"<i></i>".repeat(12)}</span>
        <span class="stu-brand-wordmark">STU</span>
        <span class="stu-brand-copy"><b>Slovenská technická</b><small>Univerzita v Bratislave</small></span>
      </a>
      <div class="stu-top-actions">
        <button class="stu-top-button" type="button" data-stu-theme-toggle aria-label="${escapeHTML(label("theme"))}" title="${escapeHTML(label("theme"))}">${svg("moon")}</button>
        <a class="stu-top-button" href="${escapeHTML(withLang("/navod/"))}" aria-label="${escapeHTML(label("help"))}" title="${escapeHTML(label("help"))}">${svg("help")}</a>
      </div>`;
    document.body.appendChild(header);
    header.querySelector("[data-stu-theme-toggle]").addEventListener("click", toggleTheme);
  }

  function buildTopbar() {
    const user = userDetails();
    const role = userRole();
    const alerts = pageAlerts();
    const alertCount = alerts.length + counters.tasks;

    const header = document.createElement("header");
    header.className = "stu-topbar";
    header.dataset.stuShell = "true";
    header.innerHTML = `
      <a class="stu-brand" href="${escapeHTML(withLang("/auth/"))}">
        <span class="stu-brand-mark">${"<i></i>".repeat(12)}</span>
        <span class="stu-brand-wordmark">STU</span>
        <span class="stu-brand-copy"><b>Slovenská technická</b><small>Univerzita v Bratislave</small></span>
      </a>
      <div class="stu-search">
        <button class="stu-search-field" type="button" data-stu-palette-open>
          ${svg("search")}
          <span>${escapeHTML(label("searchPlaceholder"))}</span>
          <kbd>Ctrl + K</kbd>
        </button>
      </div>
      <div class="stu-top-actions">
        <button class="stu-top-button" type="button" data-stu-drawer-open aria-label="${escapeHTML(label("notifications"))}" title="${escapeHTML(label("notifications"))}">
          ${svg("bell")}${alertCount ? `<b>${alertCount > 9 ? "9+" : alertCount}</b>` : ""}
        </button>
        <a class="stu-top-button" href="${escapeHTML(withLang(counterHref("messages")))}" aria-label="${escapeHTML(label("mail"))}" title="${escapeHTML(label("mail"))}">
          ${svg("mail")}${counters.messages ? `<b>${counters.messages > 99 ? "99+" : counters.messages}</b>` : ""}
        </a>
        <button class="stu-top-button" type="button" data-stu-theme-toggle aria-label="${escapeHTML(label("theme"))}" title="${escapeHTML(label("theme"))}">${svg("moon")}</button>
        <a class="stu-top-button" href="${escapeHTML(withLang("/auth/dokumentace/"))}" aria-label="${escapeHTML(label("help"))}" title="${escapeHTML(label("help"))}">${svg("help")}</a>
        <span class="stu-top-divider"></span>
        ${user.href ? `<a class="stu-user-chip" href="${escapeHTML(user.href)}">` : `<button class="stu-user-chip" type="button" data-stu-palette-open>`}
          <span class="stu-avatar">${escapeHTML(user.initials)}</span>
          <span class="stu-user-copy"><b>${escapeHTML(user.name)}</b><small>${escapeHTML(role)}</small></span>
          ${svg("chevronDown")}
        ${user.href ? "</a>" : "</button>"}
        <button class="stu-top-button stu-menu-button" type="button" data-stu-menu-open aria-label="${escapeHTML(label("openMenu"))}">${svg("menu")}</button>
      </div>`;
    document.body.appendChild(header);

    header.querySelector("[data-stu-theme-toggle]").addEventListener("click", toggleTheme);
    header.querySelector("[data-stu-drawer-open]").addEventListener("click", () => toggleDrawer(true, alerts));
    header.querySelector("[data-stu-menu-open]").addEventListener("click", () => {
      document.documentElement.classList.add("stu-menu-open");
    });
    header.querySelectorAll("[data-stu-palette-open]").forEach((node) => {
      node.addEventListener("click", () => togglePalette(true));
    });
  }

  /* ------------------------------------------------------------- sidebar */

  function buildSidebar() {
    const aside = document.createElement("aside");
    aside.className = "stu-sidebar";
    aside.dataset.stuShell = "true";
    aside.setAttribute("aria-label", label("navigation"));

    /* Resolve the entries with an explicit target first, then the section
       entries, so the latter can avoid a destination that is already taken. */
    const claimed = new Set();
    NAV_ITEMS.filter((item) => item.key !== "separator" && !item.section)
      .forEach((item) => claimed.add(resolveNav(item).href));

    const nav = NAV_ITEMS.map((item) => {
      if (item.key === "separator") return '<div class="stu-nav-separator"></div>';
      const target = resolveNav(item, claimed);
      claimed.add(target.href);
      const active = isActiveNav(item);
      const count = item.counter ? counters[item.counter] : 0;
      const text = target.text || label(item.key);
      return `<a class="stu-nav-item${active ? " is-active" : ""}" href="${escapeHTML(target.href)}" data-stu-nav="${item.key}" title="${escapeHTML(text)}">
        ${svg(item.icon)}<span>${escapeHTML(text)}</span>${count ? `<b>${count > 99 ? "99+" : count}</b>` : ""}
      </a>`;
    }).join("");

    const collapsed = Boolean(settings.sidebarCollapsed);
    /* Only the upper part scrolls; the status line and the collapse button are
       pinned to the bottom so they are reachable without scrolling. */
    aside.innerHTML = `
      <div class="stu-sidebar-scroll">
        <nav class="stu-nav">${nav}</nav>
      </div>
      <div class="stu-sidebar-bottom">
        <div class="stu-sidebar-foot">
          <span class="stu-status-dot"></span>
          <span>is.stuba.sk</span>
          <b>LOCAL</b>
        </div>
        <button class="stu-sidebar-toggle" type="button" data-stu-sidebar-toggle
          aria-label="${escapeHTML(collapsed ? label("expand") : label("collapse"))}"
          title="${escapeHTML(collapsed ? label("expand") : label("collapse"))}">
          ${svg("panel")}<span>${escapeHTML(label("collapse"))}</span>
        </button>
      </div>`;

    document.body.appendChild(aside);

    aside.querySelector("[data-stu-sidebar-toggle]").addEventListener("click", () => {
      settings.sidebarCollapsed = !settings.sidebarCollapsed;
      storageSet({ sidebarCollapsed: settings.sidebarCollapsed });
      applySidebarState();
    });

    const scrim = document.createElement("div");
    scrim.className = "stu-scrim";
    scrim.dataset.stuShell = "true";
    scrim.addEventListener("click", () => document.documentElement.classList.remove("stu-menu-open"));
    document.body.appendChild(scrim);

    aside.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      document.documentElement.classList.remove("stu-menu-open");
    }));
  }

  function applySidebarState() {
    const collapsed = Boolean(settings.sidebarCollapsed);
    document.documentElement.classList.toggle("stu-sidebar-collapsed", collapsed);
    const toggle = document.querySelector("[data-stu-sidebar-toggle]");
    if (toggle) {
      const text = collapsed ? label("expand") : label("collapse");
      toggle.setAttribute("aria-label", text);
      toggle.setAttribute("title", text);
    }
  }

  /* --------------------------------------------------------- breadcrumb bar */

  function buildCrumbBar() {
    const crumbs = document.querySelector('#base-r nav[aria-label="breadcrumb"]');
    if (!crumbs || crumbs.closest(".stu-crumbbar")) return;

    const bar = document.createElement("div");
    bar.className = "stu-crumbbar";
    crumbs.parentNode.insertBefore(bar, crumbs);
    bar.appendChild(crumbs);

    const current = pageLanguage();
    const meta = document.createElement("div");
    meta.className = "stu-crumb-meta";
    meta.innerHTML = `
      <span>${escapeHTML(serverMoment())}</span>
      <span class="stu-crumb-sep"></span>
      <b>UIS</b>
      <div class="stu-lang">
        <button class="stu-lang-button" type="button" data-stu-lang-toggle aria-label="${escapeHTML(label("language"))}">
          ${flag(current)}<span>${current === "cs" ? "CZ" : current.toUpperCase()}</span>${svg("chevronDown")}
        </button>
        <div class="stu-lang-menu">
          <a href="${escapeHTML(languageHref("sk"))}" class="${current === "sk" ? "is-current" : ""}">${flag("sk")}<span>Slovenčina</span><b>SK</b></a>
          <a href="${escapeHTML(languageHref("cs"))}" class="${current === "cs" ? "is-current" : ""}">${flag("cs")}<span>Čeština</span><b>CZ</b></a>
          <a href="${escapeHTML(languageHref("en"))}" class="${current === "en" ? "is-current" : ""}">${flag("en")}<span>English</span><b>EN</b></a>
        </div>
      </div>`;
    bar.appendChild(meta);

    const picker = meta.querySelector(".stu-lang");
    meta.querySelector("[data-stu-lang-toggle]").addEventListener("click", (event) => {
      event.stopPropagation();
      picker.classList.toggle("is-open");
    });
    document.addEventListener("click", () => picker.classList.remove("is-open"));
  }

  /* -------------------------------------------------------- command palette */

  function paletteEntries() {
    const sections = NAV_ITEMS
      .filter((item) => item.key !== "separator")
      .map((item) => {
        const target = resolveNav(item);
        return { group: label("sections"), icon: item.icon, title: target.text || label(item.key), href: target.href };
      });

    const apps = menuItems().map((item) => ({
      group: label("applications"),
      icon: "layers",
      title: item.text,
      hint: item.section,
      href: withLang(item.href)
    }));

    const onPage = [...document.querySelectorAll("#base-r a[href]")]
      .filter((link) => {
        const value = text(link);
        return value.length > 2 && value.length < 70 && !link.closest(SHELL_SELECTOR);
      })
      .slice(0, 60)
      .map((link) => ({ group: label("onThisPage"), icon: "chevronRight", title: text(link), href: link.href }));

    const seen = new Set();
    return [...sections, ...apps, ...onPage].filter((entry) => {
      const key = `${entry.title.toLowerCase()}|${entry.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function normalise(value) {
    return String(value).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function buildPalette() {
    const palette = document.createElement("div");
    palette.className = "stu-palette";
    palette.dataset.stuShell = "true";
    palette.innerHTML = `
      <div class="stu-palette-panel" role="dialog" aria-modal="true">
        <div class="stu-palette-head">
          ${svg("search")}
          <input type="text" autocomplete="off" spellcheck="false" placeholder="${escapeHTML(label("searchTitle"))}" data-stu-palette-input>
          <kbd>${escapeHTML(label("close_esc"))}</kbd>
        </div>
        <div class="stu-palette-list" data-stu-palette-list></div>
      </div>`;
    document.body.appendChild(palette);

    const input = palette.querySelector("[data-stu-palette-input]");
    const list = palette.querySelector("[data-stu-palette-list]");
    let entries = [];
    let filtered = [];
    let cursor = 0;

    function render() {
      if (!filtered.length) {
        list.innerHTML = `<div class="stu-palette-empty">${escapeHTML(label("nothingFound"))}</div>`;
        return;
      }
      let group = "";
      list.innerHTML = filtered.slice(0, 40).map((entry, index) => {
        const header = entry.group !== group ? `<div class="stu-palette-group">${escapeHTML(entry.group)}</div>` : "";
        group = entry.group;
        return `${header}<a class="stu-palette-item${index === cursor ? " is-active" : ""}" href="${escapeHTML(entry.href)}" data-index="${index}">
          ${svg(entry.icon)}<span>${escapeHTML(entry.title)}</span>${entry.hint ? `<small>${escapeHTML(entry.hint)}</small>` : ""}
        </a>`;
      }).join("");
    }

    function filter() {
      const query = normalise(input.value.trim());
      filtered = !query
        ? entries.slice(0, 40)
        : entries.filter((entry) => normalise(`${entry.title} ${entry.hint || ""}`).includes(query));
      cursor = 0;
      render();
    }

    input.addEventListener("input", filter);
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const max = Math.min(filtered.length, 40);
        if (!max) return;
        cursor = (cursor + (event.key === "ArrowDown" ? 1 : -1) + max) % max;
        render();
        list.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter") {
        event.preventDefault();
        const target = filtered[cursor];
        if (target) location.assign(target.href);
      } else if (event.key === "Escape") {
        togglePalette(false);
      }
    });

    palette.addEventListener("click", (event) => {
      if (event.target === palette) togglePalette(false);
    });

    palette.refresh = () => {
      entries = paletteEntries();
      input.value = "";
      filter();
      input.focus();
    };

    return palette;
  }

  function togglePalette(open) {
    const palette = document.querySelector(".stu-palette");
    if (!palette) return;
    document.documentElement.classList.toggle("stu-palette-open", open);
    if (open && palette.refresh) palette.refresh();
  }

  /* --------------------------------------------------------------- drawer */

  function buildDrawer() {
    const drawer = document.createElement("aside");
    drawer.className = "stu-drawer";
    drawer.dataset.stuShell = "true";
    drawer.innerHTML = `
      <div class="stu-drawer-head">
        <div><small>UIS+</small><h2>${escapeHTML(label("notifications"))}</h2></div>
        <button type="button" data-stu-drawer-close aria-label="${escapeHTML(label("close"))}">${svg("close")}</button>
      </div>
      <div class="stu-drawer-list" data-stu-drawer-list></div>`;
    document.body.appendChild(drawer);
    drawer.querySelector("[data-stu-drawer-close]").addEventListener("click", () => toggleDrawer(false));
    return drawer;
  }

  function toggleDrawer(open, alerts) {
    const drawer = document.querySelector(".stu-drawer");
    if (!drawer) return;
    if (open) {
      const list = drawer.querySelector("[data-stu-drawer-list]");
      const entries = alerts || pageAlerts();
      const counterCards = [
        counters.messages ? { kind: "messages", count: counters.messages, label: label("messages"), href: counterHref("messages") } : null,
        counters.documents ? { kind: "documents", count: counters.documents, label: label("documents"), href: counterHref("documents") } : null,
        counters.tasks ? { kind: "tasks", count: counters.tasks, label: label("tasks"), href: counterHref("tasks") } : null
      ].filter(Boolean);

      const html = [
        ...counterCards.map((card) => `<a href="${escapeHTML(card.href)}">
          <span class="stu-alert-indicator"></span><span><b>${card.count}</b> ${escapeHTML(card.label)}</span>
        </a>`),
        ...entries.map((entry, index) => `<button type="button" data-stu-alert="${index}">
          <span class="stu-alert-indicator"></span><span>${escapeHTML(entry.text)}</span>
        </button>`)
      ].join("");

      list.innerHTML = html || `<div class="stu-drawer-empty">${svg("bell")}<p>${escapeHTML(label("noNotifications"))}</p></div>`;
      list.querySelectorAll("[data-stu-alert]").forEach((button) => {
        button.addEventListener("click", () => {
          const target = entries[Number(button.dataset.stuAlert)];
          toggleDrawer(false);
          if (target && target.element) {
            target.element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    }
    document.documentElement.classList.toggle("stu-notifications-open", Boolean(open));
  }

  /* ------------------------------------------------------------- lifecycle */

  function buildShell() {
    document.querySelectorAll(SHELL_SELECTOR).forEach((node) => node.remove());
    document.documentElement.dataset.stuLanguage = language();
    if (isLoginPage()) {
      buildGuestTopbar();
      buildCrumbBar();
      return;
    }
    counters = readCounters();
    buildTopbar();
    buildSidebar();
    buildDrawer();
    buildPalette();
    buildCrumbBar();
  }

  function teardown() {
    if (observer) observer.disconnect();
    document.querySelectorAll(SHELL_SELECTOR).forEach((node) => node.remove());
    document.documentElement.classList.remove(
      ROOT_CLASS, BOOT_CLASS, "stu-compact", "stu-sidebar-collapsed",
      "stu-menu-open", "stu-notifications-open", "stu-palette-open", "stu-login"
    );
    delete document.documentElement.dataset.stuTheme;
    delete document.documentElement.dataset.stuLanguage;
  }

  function apply() {
    if (!settings.enabled) {
      teardown();
      return;
    }
    const root = document.documentElement;
    root.classList.add(ROOT_CLASS, BOOT_CLASS);
    root.classList.add("stu-compact");
    root.classList.toggle("stu-login", isLoginPage());
    applySidebarState();
    applyTheme();
    if (!document.body) return;

    if ((location.pathname === "/auth/" || location.pathname === "/auth") && !isLoginPage()) harvestMenu();

    buildShell();
    if (window.UISPlusPages && typeof window.UISPlusPages.run === "function") {
      try {
        window.UISPlusPages.run();
      } catch (error) {
        console.warn("UIS+ page layer failed:", error);
      }
    }
  }

  function observe() {
    if (observer) observer.disconnect();
    if (!document.body) return;
    observer = new MutationObserver((mutations) => {
      const onlyShell = mutations.every((mutation) =>
        [...mutation.addedNodes].every((node) => node.nodeType === 1 && node.closest && node.closest(SHELL_SELECTOR)));
      if (onlyShell) return;
      clearTimeout(observerTimer);
      observerTimer = setTimeout(() => {
        if (window.UISPlusPages && typeof window.UISPlusPages.refresh === "function") {
          try {
            window.UISPlusPages.refresh();
          } catch (_) { /* Keep the shell alive even if a page hook throws. */ }
        }
      }, 220);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function bindGlobalKeys() {
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        togglePalette(!document.documentElement.classList.contains("stu-palette-open"));
      } else if (event.key === "Escape") {
        document.documentElement.classList.remove("stu-menu-open");
        togglePalette(false);
        toggleDrawer(false);
      } else if (event.key === "[" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        settings.sidebarCollapsed = !settings.sidebarCollapsed;
        storageSet({ sidebarCollapsed: settings.sidebarCollapsed });
        applySidebarState();
      }
    });
  }

  /* Tells the background worker whether this browser is signed in to UIS and
     how many messages are unread, for the toolbar badge and the keep-alive.
     The page language is kept so the popup can speak it too. */
  function reportState() {
    const signedIn = !isLoginPage() && Boolean(document.querySelector("#base-r, #base"));
    const state = { signedIn, unread: signedIn ? readCounters().messages : 0, lang: pageLanguage() };
    storageSet({ uisPageLanguage: state.lang });
    try {
      chrome.runtime.sendMessage({ type: "uis-state", ...state }, () => void chrome.runtime.lastError);
    } catch (_) { /* The extension context can be reloading. */ }
  }

  /* ------------------------------------------------------------- public API */

  window.UISPlus = {
    svg,
    icons: ICONS,
    label,
    labels: LABELS,
    language,
    pageLanguage,
    escapeHTML,
    text,
    absolute,
    withLang,
    toast,
    settings: () => ({ ...settings }),
    menu: () => menuCache,
    menuItems,
    counters: () => ({ ...counters }),
    assignments: () => ({ items: dueAssignments(), savedAt: assignments.savedAt }),
    setAssignments,
    user: userDetails,
    userRole,
    isLoginPage,
    shellSelector: SHELL_SELECTOR
  };

  /* ---------------------------------------------------------------- start */

  document.documentElement.classList.add(BOOT_CLASS);
  document.documentElement.dataset.stuTheme = effectiveTheme("system");

  async function start() {
    const stored = await storageGet({ ...DEFAULTS, [MENU_CACHE_KEY]: null, [ASSIGNMENTS_KEY]: null });
    settings = { ...DEFAULTS, ...stored };
    if (stored[ASSIGNMENTS_KEY] && Array.isArray(stored[ASSIGNMENTS_KEY].items)) assignments = stored[ASSIGNMENTS_KEY];
    const cached = stored[MENU_CACHE_KEY];
    if (cached && cached.sections && Date.now() - (cached.savedAt || 0) < MENU_CACHE_TTL) {
      menuCache = cached;
    }

    apply();
    reportState();
    if (settings.enabled) {
      observe();
      bindGlobalKeys();
    }

    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        const relevant = Object.keys(changes).filter((key) => Object.hasOwn(DEFAULTS, key));
        if (!relevant.length) return;
        relevant.forEach((key) => { settings[key] = changes[key].newValue; });
        apply();
        if (settings.enabled) observe();
      });
    } catch (_) { /* Storage events are optional. */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (settings.theme === "system") applyTheme();
  });
})();
