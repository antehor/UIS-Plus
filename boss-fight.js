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

  /* Grades follow the STU scale; the boss is beaten from E (56 points) up. */
  const RANKS = [
    { min: 92, max: 100, grade: "A", key: "gradeA" },
    { min: 83, max: 91, grade: "B", key: "gradeB" },
    { min: 74, max: 82, grade: "C", key: "gradeC" },
    { min: 65, max: 73, grade: "D", key: "gradeD" },
    { min: 56, max: 64, grade: "E", key: "gradeE" },
    { min: 0, max: 55, grade: "FX", key: "gradeFX" }
  ];

  /* Muted hues that hold up on both the light and the dark surface. */
  const BOSS_THEMES = [
    { pattern: /B-SPSS|širokopásmové systémy a siete/i, name: "Electro Overlord", icon: "bolt", color: "#c98a0c" },
    { pattern: /siet|network|prenos|broadband|širokopás/i, name: "Network Overlord", icon: "network", color: "#2f80d8" },
    { pattern: /elektr|obvod|circuit|energy|napät/i, name: "Electro Overlord", icon: "bolt", color: "#c98a0c" },
    { pattern: /program|software|algorit|code|web/i, name: "Code Tyrant", icon: "code", color: "#7357e0" },
    { pattern: /matem|algebra|analýz|calculus|štatist/i, name: "Calculus Colossus", icon: "sigma", color: "#d4524f" },
    { pattern: /fyz|quant|optic|physics/i, name: "Quantum Warden", icon: "atom", color: "#1f9a76" },
    { pattern: /bezpe|security|crypto|šifr/i, name: "Cipher Reaper", icon: "lock", color: "#c2185b" },
    { pattern: /komunik|signal|digitálne komunik/i, name: "Signal Sovereign", icon: "wave", color: "#2a8fc9" },
    { pattern: /projekt|project|bakalár/i, name: "Project Leviathan", icon: "flag", color: "#d0702a" }
  ];

  const FALLBACK_THEMES = [
    { name: "Academic Titan", icon: "shield", color: "#5967d1" },
    { name: "Credit Devourer", icon: "crown", color: "#c24f86" },
    { name: "Semester Warden", icon: "book", color: "#a88412" },
    { name: "Knowledge Hydra", icon: "spark", color: "#2f9467" }
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

  const ICON_PATHS = {
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4M7 17l-3 3M3 19l2 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 4v5h-5"/>',
    close: '<path d="m7 7 10 10M17 7 7 17"/>',
    external: '<path d="M14 4.5h5.5V10"/><path d="M19 5 11 13"/><path d="M18 13.5v5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    check: '<path d="M4.5 12.5 9.5 17.5 19.5 7"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
    trophy: '<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z"/><path d="M7.5 6h-3a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5V17M8.5 20.5h7M9.5 17h5"/>',
    cap: '<path d="m3 8 9-4.5L21 8l-9 4.5z"/><path d="M7 10.6V16c3 1.9 7 1.9 10 0v-5.4"/><path d="M21 8v6"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    network: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2v4.3M12 11.5l-5.6 5.8M12 11.5l5.6 5.8"/>',
    code: '<path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
    sigma: '<path d="M17.5 6V4h-11l6 8-6 8h11v-2"/>',
    atom: '<circle cx="12" cy="12" r="1.4"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    wave: '<path d="M2.5 12h3l2.5-6 4 12 3-9 2 3h4.5"/>',
    flag: '<path d="M5 21V4M5 4.5h11.5l-2 4 2 4H5"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/>',
    crown: '<path d="m3.5 8 4.2 3.5L12 5l4.3 6.5L20.5 8l-1.8 10H5.3z"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19v3.5H5.5A1.5 1.5 0 0 1 4 20z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'
  };

  function icon(name) {
    return `<svg class="stu-boss-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ICON_PATHS.shield}</svg>`;
  }

  /* ------------------------------------------------------------- copy */

  const COPY = {
    sk: {
      modeLabel: "Herný režim",
      enable: "Zapnúť Boss Fight",
      disable: "Vypnúť Boss Fight",
      campaign: "Kampaň",
      defeatedOf: (d, n) => `${d} z ${n} porazených`,
      refreshNow: "Aktualizovať body",
      manage: "Pridať alebo odobrať bossov",
      removeBoss: "Odobrať bossa",
      firstBoss: "Pridajte prvého bossa",
      firstBossHint: "Vyberte si predmet z UIS",
      updating: "Aktualizuje sa…",
      awaiting: "Čaká sa na body",
      toVictory: (n) => `Ešte ${n} b. do víťazstva`,
      defeated: "Boss porazený",
      details: "Detaily",
      points: "b.",
      waitingFirst: "Čaká sa na prvú aktualizáciu",
      updatedNow: "Aktualizované práve teraz",
      updatedMin: (n) => `Aktualizované pred ${n} min`,
      updatedAt: (time) => `Aktualizované o ${time}`,
      scoresUpdating: "Body sa aktualizujú",
      info: "Predmet",
      openInfo: (code) => `Otvoriť informácie o predmete ${code}`,
      lead: "Body zo stĺpca SÚČET sa menia na poškodenie bossa.",
      victoryAt: (n) => `Víťazstvo od ${n} b.`,
      maxHp: (n) => `Maximum ${n} b.`,
      close: "Zavrieť",
      sections: "Sekcie Boss Fight",
      tabOverview: "Prehľad",
      tabManage: "Spravovať",
      tabRanks: "Hodnotenie",
      footer: "Body sa aktualizujú automaticky z UIS · údaje zostávajú v tomto prehliadači",
      emptyEyebrow: "Aréna je prázdna",
      emptyTitle: "Vyberte si prvého bossa",
      emptyBody: "Pridajte predmety z ľubovoľného semestra. UIS+ premení body zo stĺpca SÚČET na poškodenie.",
      chooseBosses: "Vybrať bossov",
      semesterCampaign: "Semestrálna kampaň",
      bossesDefeated: (d, n) => `${d} z ${n} bossov porazených`,
      autoOn: "Automatická aktualizácia je zapnutá",
      updatingScores: "Body sa aktualizujú…",
      manageBosses: "Spravovať bossov",
      finalScore: "Konečné body",
      damageDealt: "Udelené poškodenie",
      victoryMark: (n) => `víťazstvo ${n}`,
      defeatedBody: (name) => `${name} je porazený.`,
      subjectDone: "Predmet absolvovaný",
      credits: (c) => `+${c} kreditov`,
      checking: "UIS+ automaticky hľadá SÚČET",
      inProgress: "Boj prebieha",
      updatingFromUis: "Aktualizuje sa z UIS…",
      remove: "Odobrať",
      subjectInfo: "Informácie o predmete",
      managerEyebrow: "Zostavte si kampaň",
      managerTitle: "Vyberte predmety",
      managerBody: "Kombinujte predmety z rôznych semestrov. Výber sa ukladá len v tomto prehliadači.",
      openList: "Zoznam predmetov v UIS",
      semester: "Semester",
      noSemesters: "Žiadne semestre",
      loading: "Načítava sa…",
      refreshSemester: "Obnoviť semester",
      inArena: "V aréne",
      add: "Pridať",
      noSubjects: "Pre tento semester nie sú uložené žiadne predmety.",
      noSubjectsHint: "Otvorte zoznam predmetov v UIS alebo stlačte „Obnoviť semester“.",
      scan: "Načítať z UIS",
      ranksEyebrow: "Výsledok boja",
      ranksTitle: "Stupnica hodnotenia",
      ranksBody: "Konečný SÚČET určuje známku po skončení semestra.",
      colScore: "Body",
      colGrade: "Známka",
      colStatus: "Výsledok",
      pass: "Boss porazený",
      fail: "Boss prežil",
      ruleHp: "HP bossa = maximum bodov",
      ruleWin: "Poškodenie potrebné na víťazstvo",
      ruleLive: "Vaše priebežné poškodenie",
      ruleEcts: "Kredity za víťazstvo",
      scanning: "Načítavam predmety z UIS…",
      loaded: "Predmety sú načítané z UIS.",
      listFailed: "Zoznam predmetov sa nepodarilo načítať.",
      fromCache: "Načítané z uloženej kópie.",
      loadingSemester: (label) => `Načítavam ${label}…`,
      foundSubjects: (n, label) => `${label}: nájdené predmety — ${n}.`,
      semesterFailed: "Semester sa nepodarilo načítať.",
      linkUnavailable: "Tento odkaz UIS nie je dostupný.",
      httpError: (status) => `UIS vrátil chybu ${status}.`,
      signIn: "Prihláste sa do UIS a skúste to znova.",
      noTotal: "Na stránke hodnotenia sa nenašiel SÚČET.",
      refreshFailed: "Body sa nepodarilo aktualizovať.",
      currentSemester: "Aktuálny semester",
      unnamed: "Predmet bez názvu",
      gradeA: "výborne", gradeB: "veľmi dobre", gradeC: "dobre", gradeD: "uspokojivo", gradeE: "dostatočne", gradeFX: "nedostatočne", gradeNone: "bez bodov"
    },
    cs: {
      modeLabel: "Herní režim",
      enable: "Zapnout Boss Fight",
      disable: "Vypnout Boss Fight",
      campaign: "Kampaň",
      defeatedOf: (d, n) => `${d} z ${n} poražených`,
      refreshNow: "Aktualizovat body",
      manage: "Přidat nebo odebrat bosse",
      removeBoss: "Odebrat bosse",
      firstBoss: "Přidejte prvního bosse",
      firstBossHint: "Vyberte si předmět z UIS",
      updating: "Aktualizuje se…",
      awaiting: "Čeká se na body",
      toVictory: (n) => `Ještě ${n} b. do vítězství`,
      defeated: "Boss poražen",
      details: "Podrobnosti",
      points: "b.",
      waitingFirst: "Čeká se na první aktualizaci",
      updatedNow: "Aktualizováno právě teď",
      updatedMin: (n) => `Aktualizováno před ${n} min`,
      updatedAt: (time) => `Aktualizováno v ${time}`,
      scoresUpdating: "Body se aktualizují",
      info: "Předmět",
      openInfo: (code) => `Otevřít informace o předmětu ${code}`,
      lead: "Body ze sloupce SOUČET se mění na poškození bosse.",
      victoryAt: (n) => `Vítězství od ${n} b.`,
      maxHp: (n) => `Maximum ${n} b.`,
      close: "Zavřít",
      sections: "Sekce Boss Fight",
      tabOverview: "Přehled",
      tabManage: "Spravovat",
      tabRanks: "Hodnocení",
      footer: "Body se aktualizují automaticky z UIS · data zůstávají v tomto prohlížeči",
      emptyEyebrow: "Aréna je prázdná",
      emptyTitle: "Vyberte si prvního bosse",
      emptyBody: "Přidejte předměty z libovolného semestru. UIS+ promění body ze sloupce SOUČET na poškození.",
      chooseBosses: "Vybrat bosse",
      semesterCampaign: "Semestrální kampaň",
      bossesDefeated: (d, n) => `${d} z ${n} bossů poraženo`,
      autoOn: "Automatická aktualizace je zapnutá",
      updatingScores: "Body se aktualizují…",
      manageBosses: "Spravovat bosse",
      finalScore: "Konečné body",
      damageDealt: "Udělené poškození",
      victoryMark: (n) => `vítězství ${n}`,
      defeatedBody: (name) => `${name} je poražen.`,
      subjectDone: "Předmět absolvován",
      credits: (c) => `+${c} kreditů`,
      checking: "UIS+ automaticky hledá SOUČET",
      inProgress: "Boj probíhá",
      updatingFromUis: "Aktualizuje se z UIS…",
      remove: "Odebrat",
      subjectInfo: "Informace o předmětu",
      managerEyebrow: "Sestavte si kampaň",
      managerTitle: "Vyberte předměty",
      managerBody: "Kombinujte předměty z různých semestrů. Výběr se ukládá jen v tomto prohlížeči.",
      openList: "Seznam předmětů v UIS",
      semester: "Semestr",
      noSemesters: "Žádné semestry",
      loading: "Načítá se…",
      refreshSemester: "Obnovit semestr",
      inArena: "V aréně",
      add: "Přidat",
      noSubjects: "Pro tento semestr nejsou uloženy žádné předměty.",
      noSubjectsHint: "Otevřete seznam předmětů v UIS nebo stiskněte „Obnovit semestr“.",
      scan: "Načíst z UIS",
      ranksEyebrow: "Výsledek boje",
      ranksTitle: "Stupnice hodnocení",
      ranksBody: "Konečný SOUČET určuje známku po skončení semestru.",
      colScore: "Body",
      colGrade: "Známka",
      colStatus: "Výsledek",
      pass: "Boss poražen",
      fail: "Boss přežil",
      ruleHp: "HP bosse = maximum bodů",
      ruleWin: "Poškození potřebné k vítězství",
      ruleLive: "Vaše průběžné poškození",
      ruleEcts: "Kredity za vítězství",
      scanning: "Načítám předměty z UIS…",
      loaded: "Předměty jsou načtené z UIS.",
      listFailed: "Seznam předmětů se nepodařilo načíst.",
      fromCache: "Načteno z uložené kopie.",
      loadingSemester: (label) => `Načítám ${label}…`,
      foundSubjects: (n, label) => `${label}: nalezené předměty — ${n}.`,
      semesterFailed: "Semestr se nepodařilo načíst.",
      linkUnavailable: "Tento odkaz UIS není dostupný.",
      httpError: (status) => `UIS vrátil chybu ${status}.`,
      signIn: "Přihlaste se do UIS a zkuste to znovu.",
      noTotal: "Na stránce hodnocení nebyl nalezen SOUČET.",
      refreshFailed: "Body se nepodařilo aktualizovat.",
      currentSemester: "Aktuální semestr",
      unnamed: "Předmět bez názvu",
      gradeA: "výborně", gradeB: "velmi dobře", gradeC: "dobře", gradeD: "uspokojivě", gradeE: "dostatečně", gradeFX: "nedostatečně", gradeNone: "bez bodů"
    },
    en: {
      modeLabel: "Game mode",
      enable: "Turn Boss Fight on",
      disable: "Turn Boss Fight off",
      campaign: "Campaign",
      defeatedOf: (d, n) => `${d} of ${n} defeated`,
      refreshNow: "Update scores now",
      manage: "Add or remove bosses",
      removeBoss: "Remove boss",
      firstBoss: "Add your first boss",
      firstBossHint: "Pick a subject from UIS",
      updating: "Updating…",
      awaiting: "Waiting for a score",
      toVictory: (n) => `${n} pts to victory`,
      defeated: "Boss defeated",
      details: "Details",
      points: "pts",
      waitingFirst: "Waiting for the first update",
      updatedNow: "Updated just now",
      updatedMin: (n) => `Updated ${n} min ago`,
      updatedAt: (time) => `Updated at ${time}`,
      scoresUpdating: "Scores are updating",
      info: "Subject",
      openInfo: (code) => `Open information about ${code}`,
      lead: "Your SÚČET points turn into damage against the boss.",
      victoryAt: (n) => `Victory at ${n} pts`,
      maxHp: (n) => `Maximum ${n} pts`,
      close: "Close",
      sections: "Boss Fight sections",
      tabOverview: "Overview",
      tabManage: "Manage",
      tabRanks: "Grades",
      footer: "Scores update automatically from UIS · data stays in this browser",
      emptyEyebrow: "The arena is empty",
      emptyTitle: "Choose your first boss",
      emptyBody: "Add subjects from any semester. UIS+ turns each SÚČET score into damage.",
      chooseBosses: "Choose bosses",
      semesterCampaign: "Semester campaign",
      bossesDefeated: (d, n) => `${d} of ${n} bosses defeated`,
      autoOn: "Automatic updates are on",
      updatingScores: "Updating scores…",
      manageBosses: "Manage bosses",
      finalScore: "Final score",
      damageDealt: "Damage dealt",
      victoryMark: (n) => `victory ${n}`,
      defeatedBody: (name) => `${name} has been defeated.`,
      subjectDone: "Subject completed",
      credits: (c) => `+${c} credits`,
      checking: "UIS+ is looking for SÚČET automatically",
      inProgress: "Battle in progress",
      updatingFromUis: "Updating from UIS…",
      remove: "Remove",
      subjectInfo: "Subject information",
      managerEyebrow: "Build your campaign",
      managerTitle: "Choose subjects",
      managerBody: "Mix subjects from different semesters. Your selection is stored only in this browser.",
      openList: "Subject list in UIS",
      semester: "Semester",
      noSemesters: "No semesters found",
      loading: "Loading…",
      refreshSemester: "Refresh semester",
      inArena: "In arena",
      add: "Add",
      noSubjects: "No subjects are saved for this semester.",
      noSubjectsHint: "Open the subject list in UIS or press “Refresh semester”.",
      scan: "Load from UIS",
      ranksEyebrow: "Battle result",
      ranksTitle: "Grading scale",
      ranksBody: "Your final SÚČET decides the grade at the end of the semester.",
      colScore: "Points",
      colGrade: "Grade",
      colStatus: "Result",
      pass: "Boss defeated",
      fail: "Boss survived",
      ruleHp: "Boss HP = maximum points",
      ruleWin: "Damage needed for victory",
      ruleLive: "Your current damage",
      ruleEcts: "Credits for victory",
      scanning: "Loading subjects from UIS…",
      loaded: "Subjects loaded from UIS.",
      listFailed: "Could not read the subject list.",
      fromCache: "Loaded from the saved copy.",
      loadingSemester: (label) => `Loading ${label}…`,
      foundSubjects: (n, label) => `${label}: ${n} subjects found.`,
      semesterFailed: "Could not load this semester.",
      linkUnavailable: "This UIS link is not available.",
      httpError: (status) => `UIS returned ${status}.`,
      signIn: "Sign in to UIS and try again.",
      noTotal: "SÚČET was not found on the assessment page.",
      refreshFailed: "Could not update the score.",
      currentSemester: "Current semester",
      unnamed: "Unnamed subject",
      gradeA: "excellent", gradeB: "very good", gradeC: "good", gradeD: "satisfactory", gradeE: "sufficient", gradeFX: "fail", gradeNone: "no score"
    }
  };

  function lang() {
    try {
      const value = window.UISPlus ? window.UISPlus.language() : "en";
      return COPY[value] ? value : "en";
    } catch (_) {
      return "en";
    }
  }

  function t(key, ...args) {
    const entry = COPY[lang()][key] ?? COPY.en[key];
    if (typeof entry === "function") return entry(...args);
    return entry ?? key;
  }

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
    if (!Number.isFinite(timestamp) || timestamp <= 0) return t("waitingFirst");
    const elapsed = Math.max(0, Date.now() - timestamp);
    if (elapsed < 45 * 1000) return t("updatedNow");
    if (elapsed < 60 * 60 * 1000) return t("updatedMin", Math.max(1, Math.round(elapsed / 60000)));
    return t("updatedAt", new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  function rankFor(value) {
    const score = clampScore(value) ?? 0;
    return RANKS.find((rank) => score >= rank.min) || RANKS[RANKS.length - 1];
  }

  function rankBadge(score) {
    if (score === null) return `<span class="stu-boss-grade is-empty" title="${escapeAttribute(t("gradeNone"))}">—</span>`;
    const rank = rankFor(score);
    const passed = score >= VICTORY_SCORE;
    return `<span class="stu-boss-grade${passed ? " is-pass" : ""}" title="${escapeAttribute(t(rank.key))}">${rank.grade}</span>`;
  }

  function themeFor(subject) {
    const text = `${subject?.name || ""} ${subject?.code || ""}`;
    const matched = BOSS_THEMES.find((theme) => theme.pattern.test(text));
    if (matched) return matched;
    let hash = 0;
    for (const character of `${subject?.key || text}`) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
    return FALLBACK_THEMES[Math.abs(hash) % FALLBACK_THEMES.length];
  }

  /* Subject links read "B-DK2 Digitálne komunikácie 2"; the code is shown on
     its own, so it is dropped from the title. */
  function subjectTitle(subject) {
    const name = normalize(subject?.name);
    const code = normalize(subject?.code);
    const rest = code && code !== "SUBJECT" && name.toUpperCase().startsWith(code) ? name.slice(code.length).replace(/^[\s·:–-]+/, "") : name;
    return rest || name || t("unnamed");
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
    const label = pageText.match(/\b(?:ZS|LS)\s*\d{4}\s*\/\s*\d{4}(?:\s*-\s*[^,;|]+)?/i)?.[0] || (id ? `Semester ${id}` : t("currentSemester"));
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
    return cellText.length >= 4 ? cellText : t("unnamed");
  }

  function subjectCode(name) {
    return normalize(name).match(/^[A-ZČŠŽĽĎŤŇ0-9]+(?:-[A-ZČŠŽĽĎŤŇ0-9]+)+/i)?.[0]?.toUpperCase() || "SUBJECT";
  }

  /* A real subject link always reads "B-DK2 Digitálne komunikácie 2". The
     assessment detail of a single subject (sometimes served at a bare
     list.pl after a form post) is a vertical table whose first cell says
     "Predmet" next to icon-only links carrying the same predmet= parameter;
     without this check that page produced phantom subjects named "Predmet". */
  function isRealSubject(subject) {
    return Boolean(subject) && subjectCode(subject.name) !== "SUBJECT";
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
      const name = subjectNameFromContainer(group.container, group.links);
      if (!isRealSubject({ name })) return;
      seen.add(key);
      const urls = group.links.map((link) => sameOriginHref(link.getAttribute("href"), sourceUrl)).filter(Boolean);
      const pointsUrl = urls.find((url) => queryValue(url, "prubezne") === "1") || urls.find((url) => /\/student\/list\.pl/i.test(url)) || urls[0];
      const catalogInfoUrl = sameOriginHref(`/katalog/syllabus.pl?predmet=${encodeURIComponent(group.id)};typ=1;vystup=1;jazyk=3`, sourceUrl);
      const infoUrl = urls.find((url) => /\/katalog\/|predmety|course|detail|info/i.test(url) && url !== pointsUrl)
        || catalogInfoUrl
        || urls.find((url) => url !== pointsUrl)
        || sameOriginHref(group.links.find((link) => normalize(link.textContent).length >= 4)?.getAttribute("href"), sourceUrl)
        || pointsUrl;
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

  /* A fresh scan is the truth for the semester it covers: entries of that
     semester it no longer lists are dropped (unless they are in the arena),
     so the manager does not accumulate stale or broken rows. An empty scan
     changes nothing, in case the page was not the subject list after all. */
  function mergeDiscovery(semesters, subjects, scannedSemesterId) {
    const nextSemesters = uniqueSemesters([...(state.bossSemesters || []), ...semesters]);
    const nextCatalog = { ...(state.bossCatalog || {}) };
    if (scannedSemesterId && subjects.length) {
      const fresh = new Set(subjects.map((subject) => subject.key));
      const roster = new Set(state.bossRoster || []);
      Object.values(nextCatalog).forEach((subject) => {
        if (subject.semesterId === String(scannedSemesterId) && !fresh.has(subject.key) && !roster.has(subject.key)) {
          delete nextCatalog[subject.key];
        }
      });
    }
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

  /* Cleans catalogs saved by earlier versions, which could hold such
     phantom "Predmet" entries — also out of the arena. */
  function dropPhantomSubjects() {
    const catalog = state.bossCatalog || {};
    const phantom = Object.keys(catalog).filter((key) => !isRealSubject(catalog[key]));
    if (!phantom.length) return;
    const nextCatalog = { ...catalog };
    phantom.forEach((key) => delete nextCatalog[key]);
    writeStorage({
      bossCatalog: nextCatalog,
      bossRoster: (state.bossRoster || []).filter((key) => !phantom.includes(key))
    });
  }

  function scanIndexDocument(doc, sourceUrl) {
    const semesters = discoverSemesters(doc, sourceUrl);
    const selected = semesters.find((semester) => semester.selected)
      || semesters.find((semester) => semester.id === queryValue(sourceUrl, "obdobi"))
      || semesters[0]
      || { id: queryValue(sourceUrl, "obdobi") || "current", label: t("currentSemester"), url: sourceUrl };
    const subjects = parseSubjects(doc, sourceUrl, selected);
    mergeDiscovery(semesters.length ? semesters : [selected], subjects, selected.id);
    if (!activeSemester) activeSemester = selected.id;
    return { semesters, selected, subjects };
  }

  async function fetchDocument(rawUrl) {
    const url = sameOriginHref(rawUrl);
    if (!url) throw new Error(t("linkUnavailable"));
    const response = await fetch(url, { credentials: "include", headers: { Accept: "text/html" } });
    if (!response.ok) throw new Error(t("httpError", response.status));
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (doc.querySelector("#loginform") || /prihl[aá]si[ťt]|sign in/i.test(normalize(doc.title)) && !/list|portal/i.test(normalize(doc.title))) {
      throw new Error(t("signIn"));
    }
    return { doc, url: response.url || url };
  }

  async function ensureIndexData(force = false) {
    if (!force && state.bossSemesters?.length && Object.keys(state.bossCatalog || {}).length) return;
    managerStatus = t("scanning");
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
      managerStatus = t("loaded");
      const first = state.bossSemesters?.find((semester) => semester.id === activeSemester) || state.bossSemesters?.[0];
      if (first) activeSemester = first.id;
    } catch (error) {
      managerStatus = error.message || t("listFailed");
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
      managerStatus = t("fromCache");
      renderPanel();
      return;
    }
    pendingSemesters.add(periodId);
    managerStatus = t("loadingSemester", semester.label);
    renderPanel();
    try {
      const { doc, url } = await fetchDocument(semester.url);
      const parsed = scanIndexDocument(doc, url);
      managerStatus = t("foundSubjects", parsed.subjects.length, semester.label);
    } catch (error) {
      managerStatus = error.message || t("semesterFailed");
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
      if (freshScore === null) throw new Error(t("noTotal"));
      score = freshScore;
      credits = extractCredits(pointsPage.doc) ?? credits;
      if (credits === null && subject.infoUrl && subject.infoUrl !== subject.pointsUrl) {
        const infoPage = await fetchDocument(subject.infoUrl);
        credits = extractCredits(infoPage.doc) ?? credits;
      }
      succeeded = true;
    } catch (caught) {
      error = caught.message || t("refreshFailed");
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

  function scoreOf(subject) {
    const result = state.bossScores?.[subject.key] || {};
    return Number.isFinite(Number(result.points)) ? clampScore(result.points) : null;
  }

  function progressBar(score, large) {
    const value = score ?? 0;
    const passed = score !== null && score >= VICTORY_SCORE;
    return `<div class="stu-boss-bar${large ? " is-lg" : ""}${passed ? " is-pass" : ""}" role="progressbar" aria-valuemin="0" aria-valuemax="${MAX_SCORE}" aria-valuenow="${value}" aria-label="${escapeAttribute(`${displayNumber(value)} / ${MAX_SCORE} ${t("points")}`)}">
      <i style="width:${value}%"></i><b style="left:${VICTORY_SCORE}%" title="${escapeAttribute(t("victoryAt", VICTORY_SCORE))}"></b>
    </div>`;
  }

  function sidebarBossCard(subject) {
    const score = scoreOf(subject);
    const defeated = score !== null && score >= VICTORY_SCORE;
    const boss = themeFor(subject);
    const remaining = Math.max(0, VICTORY_SCORE - (score ?? 0));
    const syncing = pendingScores.has(subject.key);
    const status = syncing ? t("updating") : defeated ? t("defeated") : score === null ? t("awaiting") : t("toVictory", displayNumber(remaining));
    const code = subject.code && subject.code !== "SUBJECT" ? subject.code : "";
    return `
      <article class="stu-boss-mini${defeated ? " is-defeated" : ""}${syncing ? " is-syncing" : ""}" style="--boss-color:${boss.color}" title="${escapeAttribute(subject.name)}">
        <div class="stu-boss-mini-head">
          <span class="stu-boss-avatar">${icon(boss.icon)}</span>
          <span class="stu-boss-mini-name"><b>${escapeHTML(subjectTitle(subject))}</b><small>${escapeHTML(boss.name)}${code ? ` · <span class="stu-boss-code">${escapeHTML(code)}</span>` : ""}</small></span>
          <button class="stu-boss-icon-button is-quiet" type="button" data-boss-remove="${escapeAttribute(subject.key)}" aria-label="${escapeAttribute(`${t("removeBoss")}: ${subjectTitle(subject)}`)}" title="${escapeAttribute(t("removeBoss"))}">${icon("close")}</button>
        </div>
        <div class="stu-boss-mini-score">
          <strong>${score === null ? "—" : displayNumber(score)}</strong><span>/ ${MAX_SCORE} ${escapeHTML(t("points"))}</span>
          ${rankBadge(score)}
        </div>
        ${progressBar(score, false)}
        <div class="stu-boss-mini-foot">
          <span class="${defeated ? "is-pass" : ""}">${defeated ? icon("check") : ""}${escapeHTML(status)}</span>
          <a href="${escapeAttribute(subject.infoUrl || subject.pointsUrl)}" target="_blank" rel="noopener" aria-label="${escapeAttribute(t("openInfo", code || subjectTitle(subject)))}">${escapeHTML(t("info"))}${icon("external")}</a>
        </div>
      </article>`;
  }

  function renderSidebar() {
    const sidebar = document.querySelector(".stu-sidebar");
    if (!sidebar || sidebar.querySelector(SIDEBAR_SELECTOR)) return;
    const enabled = Boolean(state.bossFightEnabled);
    const subjects = (state.bossRoster || []).map((key) => state.bossCatalog?.[key]).filter(Boolean);
    const defeated = subjects.filter((subject) => (scoreOf(subject) ?? 0) >= VICTORY_SCORE).length;
    const latestUpdate = Math.max(0, ...subjects.map((subject) => Number(state.bossScores?.[subject.key]?.updatedAt) || 0));
    const syncing = subjects.some((subject) => pendingScores.has(subject.key));
    const block = document.createElement("div");
    block.dataset.stuBossSidebar = "true";
    block.className = `stu-boss-sidebar${enabled ? " is-enabled" : ""}`;
    block.innerHTML = `
      <button class="stu-boss-mode-toggle" type="button" role="switch" data-boss-mode-toggle aria-checked="${enabled}" title="${escapeAttribute(enabled ? t("disable") : t("enable"))}">
        <span class="stu-boss-mode-icon">${icon("swords")}</span>
        <span class="stu-boss-mode-copy"><b>Boss Fight</b><small>${escapeHTML(t("modeLabel"))}</small></span>
        <span class="stu-boss-switch" aria-hidden="true"><i></i></span>
      </button>
      ${enabled ? `
        <div class="stu-boss-campaign">
          <p><b>${escapeHTML(t("campaign"))}</b><span>${escapeHTML(t("defeatedOf", defeated, subjects.length))}</span></p>
          <button class="stu-boss-icon-button${syncing ? " is-syncing" : ""}" type="button" data-boss-sidebar-refresh aria-label="${escapeAttribute(t("refreshNow"))}" title="${escapeAttribute(t("refreshNow"))}">${icon("refresh")}</button>
          <button class="stu-boss-icon-button" type="button" data-boss-manage aria-label="${escapeAttribute(t("manage"))}" title="${escapeAttribute(t("manage"))}">${icon("plus")}</button>
        </div>
        <div class="stu-boss-list">
          ${subjects.length ? subjects.map(sidebarBossCard).join("") : `
            <button class="stu-boss-empty-mini" type="button" data-boss-manage>
              <span>${icon("plus")}</span><b>${escapeHTML(t("firstBoss"))}</b><small>${escapeHTML(t("firstBossHint"))}</small>
            </button>`}
        </div>
        ${subjects.length ? `
          <button class="stu-boss-enter" type="button" data-boss-open>
            <span>${escapeHTML(syncing ? t("scoresUpdating") : relativeTime(latestUpdate))}</span>
            <b>${escapeHTML(t("details"))}${icon("chevron")}</b>
          </button>` : ""}` : ""}`;
    const scroller = sidebar.querySelector(".stu-sidebar-scroll");
    const foot = sidebar.querySelector(".stu-sidebar-foot");
    if (scroller) scroller.appendChild(block);
    else if (foot) foot.before(block);
    else sidebar.appendChild(block);
    block.querySelector("[data-boss-mode-toggle]")?.addEventListener("click", () => {
      const next = !state.bossFightEnabled;
      writeStorage({ bossFightEnabled: next });
      if (next) {
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
      <section class="stu-boss-dialog" role="dialog" aria-modal="true" aria-labelledby="stu-boss-title">
        <header class="stu-boss-header">
          <span class="stu-boss-emblem">${icon("swords")}</span>
          <div class="stu-boss-heading"><h2 id="stu-boss-title">Boss Fight</h2><p>${escapeHTML(t("lead"))}</p></div>
          <div class="stu-boss-header-meta"><span>${escapeHTML(t("victoryAt", VICTORY_SCORE))}</span><span>${escapeHTML(t("maxHp", MAX_SCORE))}</span></div>
          <button class="stu-boss-icon-button stu-boss-close" type="button" data-boss-close aria-label="${escapeAttribute(t("close"))}" title="${escapeAttribute(t("close"))}">${icon("close")}</button>
        </header>
        <nav class="stu-boss-tabs" aria-label="${escapeAttribute(t("sections"))}"></nav>
        <div class="stu-boss-content"></div>
        <footer class="stu-boss-footer"><span class="stu-boss-dot"></span>${escapeHTML(t("footer"))}</footer>
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
      { key: "arena", label: t("tabOverview"), icon: "grid", count: rosterCount },
      { key: "manage", label: t("tabManage"), icon: "list", count: "" },
      { key: "ranks", label: t("tabRanks"), icon: "star", count: "" }
    ].map((tab) => `<button type="button" data-boss-tab="${tab.key}" class="${activeTab === tab.key ? "is-active" : ""}" aria-current="${activeTab === tab.key ? "page" : "false"}">${icon(tab.icon)}<span>${escapeHTML(tab.label)}</span>${tab.count !== "" ? `<b>${tab.count}</b>` : ""}</button>`).join("");
  }

  function bossCard(subject) {
    const result = state.bossScores?.[subject.key] || {};
    const score = scoreOf(subject);
    const defeated = score !== null && score >= VICTORY_SCORE;
    const boss = themeFor(subject);
    const credits = result.credits ?? subject.credits;
    const remaining = score === null ? VICTORY_SCORE : Math.max(0, VICTORY_SCORE - score);
    const syncing = pendingScores.has(subject.key);
    const code = subject.code && subject.code !== "SUBJECT" ? subject.code : "";
    const meta = [code, subject.semesterLabel].filter(Boolean).map(escapeHTML).join(" · ");
    return `
      <article class="stu-boss-card${defeated ? " is-defeated" : ""}" style="--boss-color:${boss.color}">
        <header>
          <span class="stu-boss-avatar is-lg">${icon(boss.icon)}</span>
          <div class="stu-boss-identity">
            ${meta ? `<small>${meta}</small>` : ""}
            <h3>${escapeHTML(subjectTitle(subject))}</h3>
            <p>${escapeHTML(boss.name)}</p>
          </div>
          ${rankBadge(score)}
        </header>
        <div class="stu-boss-hp-copy">
          <span>${escapeHTML(defeated ? t("finalScore") : t("damageDealt"))}</span>
          <strong>${score === null ? "—" : displayNumber(score)}<small> / ${MAX_SCORE} ${escapeHTML(t("points"))}</small></strong>
        </div>
        ${progressBar(score, true)}
        <div class="stu-boss-threshold"><span>0</span><span style="left:${VICTORY_SCORE}%">${escapeHTML(t("victoryMark", VICTORY_SCORE))}</span><span>${MAX_SCORE}</span></div>
        ${defeated ? `
          <div class="stu-boss-status is-pass">${icon("trophy")}<div><b>${escapeHTML(t("defeated"))}</b><small>${escapeHTML(t("defeatedBody", boss.name))}</small></div></div>
          <div class="stu-boss-rewards">
            <span>${icon("cap")}${escapeHTML(t("subjectDone"))}</span>
            <span>${icon("star")}${escapeHTML(t("credits", credits === null || credits === undefined ? "?" : displayNumber(credits)))}</span>
          </div>` : `
          <div class="stu-boss-status">${icon(score === null ? "refresh" : "swords")}<div><b>${escapeHTML(score === null ? t("awaiting") : t("inProgress"))}</b><small>${escapeHTML(score === null ? t("checking") : t("toVictory", displayNumber(remaining)))}</small></div></div>`}
        ${result.error ? `<p class="stu-boss-error">${escapeHTML(result.error)}</p>` : ""}
        <footer>
          <span>${escapeHTML(syncing ? t("updatingFromUis") : relativeTime(result.updatedAt))}</span>
          <div>
            <button class="stu-boss-button" type="button" data-boss-remove="${escapeAttribute(subject.key)}">${escapeHTML(t("remove"))}</button>
            <a class="stu-boss-button" href="${escapeAttribute(subject.infoUrl || subject.pointsUrl)}" target="_blank" rel="noopener">${escapeHTML(t("subjectInfo"))}${icon("external")}</a>
          </div>
        </footer>
      </article>`;
  }

  function renderArena() {
    const subjects = (state.bossRoster || []).map((key) => state.bossCatalog?.[key]).filter(Boolean);
    if (!subjects.length) {
      return `
        <div class="stu-boss-empty">
          <span class="stu-boss-emblem is-lg">${icon("swords")}</span>
          <small>${escapeHTML(t("emptyEyebrow"))}</small>
          <h3>${escapeHTML(t("emptyTitle"))}</h3>
          <p>${escapeHTML(t("emptyBody"))}</p>
          <button class="stu-boss-button is-primary" type="button" data-boss-show-manage>${icon("plus")}${escapeHTML(t("chooseBosses"))}</button>
        </div>`;
    }
    const defeated = subjects.filter((subject) => (scoreOf(subject) ?? 0) >= VICTORY_SCORE).length;
    return `
      <div class="stu-boss-section-head">
        <div><small>${escapeHTML(t("semesterCampaign"))}</small><h3>${escapeHTML(t("bossesDefeated", defeated, subjects.length))}</h3></div>
        <div class="stu-boss-section-actions">
          <span class="stu-boss-sync${pendingScores.size ? " is-syncing" : ""}"><span class="stu-boss-dot"></span>${escapeHTML(pendingScores.size ? t("updatingScores") : t("autoOn"))}</span>
          <button class="stu-boss-button" type="button" data-boss-show-manage>${icon("list")}${escapeHTML(t("manageBosses"))}</button>
        </div>
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
      <div class="stu-boss-section-head">
        <div><small>${escapeHTML(t("managerEyebrow"))}</small><h3>${escapeHTML(t("managerTitle"))}</h3><p>${escapeHTML(t("managerBody"))}</p></div>
        <a class="stu-boss-button" href="${escapeAttribute(sameOriginHref(document.querySelector('meta[name="ais-boss-list-url"]')?.content || "/auth/student/list.pl"))}" target="_blank" rel="noopener">${escapeHTML(t("openList"))}${icon("external")}</a>
      </div>
      <div class="stu-boss-semester-bar">
        <label><span>${escapeHTML(t("semester"))}</span><select data-boss-semester ${semesters.length ? "" : "disabled"}>${semesters.length ? semesters.map((semester) => `<option value="${escapeAttribute(semester.id)}" ${semester.id === activeSemester ? "selected" : ""}>${escapeHTML(semester.label)}</option>`).join("") : `<option>${escapeHTML(t("noSemesters"))}</option>`}</select></label>
        <button class="stu-boss-button" type="button" data-boss-rescan>${icon("refresh")}${escapeHTML(pendingSemesters.has(activeSemester) ? t("loading") : t("refreshSemester"))}</button>
        <span role="status">${escapeHTML(managerStatus)}</span>
      </div>
      ${subjects.length ? `<div class="stu-boss-subject-list">${subjects.map((subject) => {
        const selected = roster.has(subject.key);
        const theme = themeFor(subject);
        const code = subject.code && subject.code !== "SUBJECT" ? subject.code : "";
        const meta = [code, subject.semesterLabel, theme.name].filter(Boolean).map(escapeHTML).join(" · ");
        return `<button type="button" data-boss-select="${escapeAttribute(subject.key)}" aria-pressed="${selected}" class="${selected ? "is-selected" : ""}" style="--boss-color:${theme.color}">
          <span class="stu-boss-avatar">${icon(theme.icon)}</span>
          <span class="stu-boss-subject-copy"><b>${escapeHTML(subjectTitle(subject))}</b><small>${meta}</small></span>
          <span class="stu-boss-pick">${icon(selected ? "check" : "plus")}${escapeHTML(selected ? t("inArena") : t("add"))}</span>
        </button>`;
      }).join("")}</div>` : `
        <div class="stu-boss-manager-empty">
          <b>${escapeHTML(t("noSubjects"))}</b>
          <span>${escapeHTML(t("noSubjectsHint"))}</span>
          <button class="stu-boss-button is-primary" type="button" data-boss-discover>${icon("refresh")}${escapeHTML(t("scan"))}</button>
        </div>`}`;
  }

  function renderRanks() {
    return `
      <div class="stu-boss-section-head">
        <div><small>${escapeHTML(t("ranksEyebrow"))}</small><h3>${escapeHTML(t("ranksTitle"))}</h3><p>${escapeHTML(t("ranksBody"))}</p></div>
      </div>
      <div class="stu-boss-rank-table" role="table">
        <div class="is-header" role="row"><span role="columnheader">${escapeHTML(t("colScore"))}</span><span role="columnheader">${escapeHTML(t("colGrade"))}</span><span role="columnheader">${escapeHTML(t("colStatus"))}</span></div>
        ${RANKS.map((rank) => {
          const passed = rank.min >= VICTORY_SCORE;
          return `<div role="row"><span role="cell">${rank.min}–${rank.max}</span><strong role="cell"><span class="stu-boss-grade${passed ? " is-pass" : ""}">${rank.grade}</span>${escapeHTML(t(rank.key))}</strong><em role="cell" class="${passed ? "is-pass" : ""}">${escapeHTML(passed ? t("pass") : t("fail"))}</em></div>`;
        }).join("")}
      </div>
      <div class="stu-boss-rules">
        <div><b>${MAX_SCORE}</b><span>${escapeHTML(t("ruleHp"))}</span></div>
        <div><b>${VICTORY_SCORE}</b><span>${escapeHTML(t("ruleWin"))}</span></div>
        <div><b>SÚČET</b><span>${escapeHTML(t("ruleLive"))}</span></div>
        <div><b>+ECTS</b><span>${escapeHTML(t("ruleEcts"))}</span></div>
      </div>`;
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
    /* Signed out: there is no sidebar to live in and every score request
       would only bounce back to the sign-in form. */
    if (document.querySelector('#loginform, form[action*="/system/login.pl"]')) return;
    try {
      chrome.storage.local.get(STORAGE_DEFAULTS, (stored) => {
        state = { ...STORAGE_DEFAULTS, ...(stored || {}) };
        dropPhantomSubjects();
        /* The observer below may already have drawn the block from the
           defaults while storage was loading, so redraw rather than skip. */
        queueRender();
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
