/* ==========================================================================
   UIS+ — page layer
   Rebuilds individual STU UIS applications into the UIS+ layout. Every value
   rendered here is read from the page that STU itself served; nothing is
   invented and no request is made on the student's behalf.
   ========================================================================== */

(function uisPlusPages() {
  "use strict";

  const DAY_ORDER = ["po", "ut", "st", "št", "pi", "so", "ne"];

  const DAY_NAMES = {
    sk: ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"],
    cs: ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"],
    en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  };

  const COPY = {
    sk: {
      timetable: "Rozvrh hodín",
      timetableLead: "Prehľad vašich prednášok, cvičení a ďalších aktivít.",
      upcoming: "Nadchádzajúce hodiny",
      showAll: "Zobraziť všetky",
      today: "Dnes",
      tomorrow: "Zajtra",
      quickFilters: "Rýchle filtre predmetov",
      addToCalendar: "Pridať do kalendára",
      noLessons: "V tomto týždni nemáte naplánované žiadne hodiny.",
      lecture: "prednáška",
      seminar: "cvičenie",
      validity: "Platnosť rozvrhu",
      sender: "Odosielateľ",
      messageInfo: "Informácie o správe",
      attachments: "Prílohy",
      noAttachments: "Táto správa neobsahuje žiadne prílohy.",
      writeToSender: "Napísať odosielateľovi",
      mailbox: "Poštová schránka",
      folders: "Priečinky",
      docServer: "Dokumentový server",
      studyState: "Stav štúdia",
      announcements: "Aktuálne oznamy",
      tip: "Tip",
      tipBody: "Stlačte Ctrl + K a rýchlo preskočte na ľubovoľnú aplikáciu UIS.",
      quickAccess: "Rýchly prístup",
      greeting: "Dobrý deň",
      mystudy: "Moje štúdium",
      openTimetable: "Otvoriť rozvrh",
      openTimetableHint: "Otvorte rozvrh a najbližšie hodiny sa zobrazia aj tu.",
      signInTitle: "Prihlásenie do UIS",
      showPassword: "Zobraziť heslo",
      hidePassword: "Skryť heslo",
      assignments: "Úlohy na odovzdanie",
      dueToday: "dnes",
      dueTomorrow: "zajtra",
      dueIn: (n) => `o ${n} ${n < 5 ? "dni" : "dní"}`,
      dueUntil: "do"
    },
    cs: {
      timetable: "Rozvrh hodin",
      timetableLead: "Přehled vašich přednášek, cvičení a dalších aktivit.",
      upcoming: "Nadcházející hodiny",
      showAll: "Zobrazit vše",
      today: "Dnes",
      tomorrow: "Zítra",
      quickFilters: "Rychlé filtry předmětů",
      addToCalendar: "Přidat do kalendáře",
      noLessons: "V tomto týdnu nemáte naplánované žádné hodiny.",
      lecture: "přednáška",
      seminar: "cvičení",
      validity: "Platnost rozvrhu",
      sender: "Odesílatel",
      messageInfo: "Informace o zprávě",
      attachments: "Přílohy",
      noAttachments: "Tato zpráva neobsahuje žádné přílohy.",
      writeToSender: "Napsat odesílateli",
      mailbox: "Poštovní schránka",
      folders: "Složky",
      docServer: "Dokumentový server",
      studyState: "Stav studia",
      announcements: "Aktuální oznámení",
      tip: "Tip",
      tipBody: "Stiskněte Ctrl + K a rychle přeskočte na libovolnou aplikaci UIS.",
      quickAccess: "Rychlý přístup",
      greeting: "Dobrý den",
      mystudy: "Moje studium",
      openTimetable: "Otevřít rozvrh",
      openTimetableHint: "Otevřete rozvrh a nejbližší hodiny se zobrazí i zde.",
      signInTitle: "Přihlášení do UIS",
      showPassword: "Zobrazit heslo",
      hidePassword: "Skrýt heslo",
      assignments: "Úkoly k odevzdání",
      dueToday: "dnes",
      dueTomorrow: "zítra",
      dueIn: (n) => `za ${n} ${n < 5 ? "dny" : "dní"}`,
      dueUntil: "do"
    },
    en: {
      timetable: "Timetable",
      timetableLead: "An overview of your lectures, seminars and other activities.",
      upcoming: "Upcoming lessons",
      showAll: "Show all",
      today: "Today",
      tomorrow: "Tomorrow",
      quickFilters: "Quick course filters",
      addToCalendar: "Add to calendar",
      noLessons: "No lessons are scheduled for this week.",
      lecture: "lecture",
      seminar: "seminar",
      validity: "Timetable validity",
      sender: "Sender",
      messageInfo: "Message information",
      attachments: "Attachments",
      noAttachments: "This message has no attachments.",
      writeToSender: "Write to sender",
      mailbox: "Mailbox",
      folders: "Folders",
      docServer: "Document server",
      studyState: "Study status",
      announcements: "Announcements",
      tip: "Tip",
      tipBody: "Press Ctrl + K to jump to any UIS application.",
      quickAccess: "Quick access",
      greeting: "Good day",
      mystudy: "My studies",
      openTimetable: "Open timetable",
      openTimetableHint: "Open the timetable once and your next lessons will show up here.",
      signInTitle: "Sign in to UIS",
      showPassword: "Show password",
      hidePassword: "Hide password",
      assignments: "Assignments due",
      dueToday: "today",
      dueTomorrow: "tomorrow",
      dueIn: (n) => `in ${n} days`,
      dueUntil: "until"
    }
  };

  /* ----------------------------------------------------------- utilities */

  function api() {
    return window.UISPlus || null;
  }

  function lang() {
    const value = api() ? api().language() : "en";
    return COPY[value] ? value : "en";
  }

  function t(key, ...args) {
    const entry = COPY[lang()][key] || COPY.en[key] || key;
    return typeof entry === "function" ? entry(...args) : entry;
  }

  function svg(name) {
    return api() ? api().svg(name) : "";
  }

  function esc(value) {
    return api() ? api().escapeHTML(value) : String(value || "");
  }

  function txt(node) {
    return String(node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function el(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  /* Local cache. Only ever holds data STU already showed this student, so the
     home page can list their next lessons without asking UIS again. */
  const CACHE_KEY = "uisTimetableCache";
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 30;

  function cacheSave(events) {
    try {
      chrome.storage.local.set({ [CACHE_KEY]: { events, savedAt: Date.now() } });
    } catch (_) { /* Storage is optional. */ }
  }

  function cacheLoad() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get({ [CACHE_KEY]: null }, (stored) => {
          const value = stored && stored[CACHE_KEY];
          resolve(value && Date.now() - (value.savedAt || 0) < CACHE_TTL ? value.events : null);
        });
      } catch (_) {
        resolve(null);
      }
    });
  }

  function mainpage() {
    return document.querySelector("#base-r .mainpage") || document.querySelector("#base-r");
  }

  function contentRoot() {
    const crumbs = document.querySelector("#base-r .stu-crumbbar");
    return crumbs ? crumbs.parentElement : mainpage();
  }

  /* -------------------------------------------------------- page header */

  const PAGE_ICONS = [
    [/rozvrh/i, "calendar"],
    [/po[šs]t|email|spr[áa]v|mail/i, "mail"],
    [/dokument/i, "docs"],
    [/št[úu]di|studi|index/i, "study"],
    [/predmet|katal[óo]g|course/i, "book"],
    [/hodnoten|v[ýy]sledk|grade/i, "award"],
    [/veda|v[ýy]skum|research/i, "research"],
    [/nastaven|setting/i, "tech"],
    [/kontakt/i, "contact"]
  ];

  function pageIcon(title) {
    const hit = PAGE_ICONS.find(([pattern]) => pattern.test(title));
    return hit ? hit[1] : "layers";
  }

  function buildPageHead(options) {
    const root = contentRoot();
    if (!root || root.querySelector(":scope > .stu-page-head")) return null;

    const heading = mainpage() ? mainpage().querySelector("h1") : null;
    const crumb = document.querySelector("#base-r li.breadcrumb-item.active span");
    const title = (options && options.title) || txt(heading) || txt(crumb) || document.title;
    if (!title) return null;

    let lead = options && options.lead;
    if (!lead) {
      const small = root.querySelector(":scope > div.small") || (mainpage() && mainpage().querySelector("div.small"));
      if (small && txt(small).length > 30) {
        lead = txt(small);
        small.classList.add("stu-lifted");
      }
    }

    const head = el(`
      <div class="stu-page-head">
        <div class="stu-page-icon">${svg((options && options.icon) || pageIcon(title))}</div>
        <div class="stu-page-copy">
          <h1>${esc(title)}</h1>
          ${lead ? `<p>${esc(lead)}</p>` : ""}
        </div>
        <div class="stu-page-aside"></div>
      </div>`);

    if (heading) heading.classList.add("stu-lifted");

    const crumbbar = root.querySelector(":scope > .stu-crumbbar");
    if (crumbbar) crumbbar.after(head);
    else root.prepend(head);
    return head;
  }

  /* ------------------------------------------------------------- tables */

  function enhanceTables() {
    const page = mainpage();
    if (!page) return;

    page.querySelectorAll("table").forEach((table) => {
      if (table.closest("[data-stu-shell]") || table.classList.contains("portal_menu")) return;
      if (table.classList.contains("stu-table") || table.dataset.stuSkip) return;

      /* Only tables that own the data rows themselves. Searching at any depth
         would match the outer layout table that wraps a whole application, and
         styling that one as a grid breaks the page structure. */
      const isData = table.querySelector([
        ":scope > thead > tr.zahlavi",
        ":scope > tbody > tr.lbn",
        ":scope > tbody > tr.uis-hl-table",
        ":scope > tbody > tr.sudy",
        ":scope > tr.lbn"
      ].join(", "));
      if (!isData) return;

      table.classList.add("stu-table");
      if (!table.parentElement.classList.contains("stu-table-scroll")) {
        const wrap = document.createElement("div");
        wrap.className = "stu-table-scroll";
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      }
    });

    page.querySelectorAll(".uis_msg").forEach((node) => {
      if (node.dataset.stuKind) return;
      if (node.classList.contains("ko") || node.classList.contains("error")) node.dataset.stuKind = "danger";
      else if (node.classList.contains("warning") || node.classList.contains("warn")) node.dataset.stuKind = "warning";
      else if (node.classList.contains("ok")) node.dataset.stuKind = "success";
      else node.dataset.stuKind = "info";
    });

    /* Each notice opens with a literal "•" text node; drop it so the cards do
       not carry a stray bullet. Hiding it in CSS would hide the text with it,
       because the notice body is a sibling text node, not an element. */
    page.querySelectorAll(".toast").forEach((toast) => {
      if (toast.dataset.stuBullet) return;
      toast.dataset.stuBullet = "1";
      [...toast.childNodes].forEach((node) => {
        if (node.nodeType !== 3) return;
        const cleaned = node.nodeValue.replace(/^[\s ]*(?:[•·‣]+|::)[\s ]*/, "");
        if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
      });
    });

    /* STU puts each icon grid inside a narrow layout table, which collapses it
       into a single column. Let those ancestors span the content width so the
       tiles can actually flow as a grid. */
    page.querySelectorAll(".rada-ikon").forEach((grid) => {
      for (let node = grid.parentElement; node && node !== page; node = node.parentElement) {
        if (node.tagName === "TABLE" || node.tagName === "TD" || node.tagName === "DIV") {
          node.style.width = "100%";
          node.style.maxWidth = "none";
        }
      }
    });

    page.querySelectorAll('input[type="submit"]').forEach((input) => {
      if (/odoslať|odeslat|send|uložiť|uložit|save|vykonať|vykonat|hľadať|hledat|search|potvrdi/i.test(input.value || "")) {
        input.classList.add("stu-primary-button");
      }
    });
  }

  /* --------------------------------------------------------------- rails */

  /* Only ever moves direct children of the content root. Moving a deeper node
     first would make the layout a descendant of a node moved afterwards, which
     throws HierarchyRequestError and leaves the rail empty. */
  function movableChildren(root) {
    return [...root.children].filter((node) =>
      !node.classList.contains("stu-crumbbar") &&
      !node.classList.contains("stu-page-head") &&
      !node.classList.contains("stu-hero") &&
      !node.classList.contains("stu-layout") &&
      !node.classList.contains("stu-split") &&
      node.tagName !== "SCRIPT");
  }

  function buildLayout(railHTML, options) {
    const root = contentRoot();
    if (!root || !railHTML || root.querySelector(":scope > .stu-layout")) return null;

    const nodes = movableChildren(root);
    if (!nodes.length) return null;

    const layout = el('<div class="stu-layout has-rail"><div class="stu-layout-main"></div><div class="stu-rail"></div></div>');
    const main = layout.querySelector(".stu-layout-main");
    const rail = layout.querySelector(".stu-rail");

    nodes[0].parentNode.insertBefore(layout, nodes[0]);
    nodes.forEach((node) => {
      if (node === layout || node.contains(layout)) return;
      if ((options && options.keepOutside || []).includes(node)) return;
      main.appendChild(node);
    });
    rail.innerHTML = railHTML;
    return { layout, main, rail };
  }

  /* ====================================================================== */
  /*  Timetable                                                             */
  /* ====================================================================== */

  function parseTimetable() {
    const table = [...document.querySelectorAll("#base-r table")]
      .find((node) => node.querySelector("td.rozvrh-pred, td.rozvrh-cvic, td.rozvrh-zap"));
    if (!table || !table.tHead) return null;

    /* Time axis: each header cell owns a span of layout columns. */
    const slots = [];
    let column = 0;
    [...table.tHead.rows[0].cells].forEach((cell) => {
      const labelText = txt(cell);
      const range = labelText.match(/(\d{1,2})[.:](\d{2})\s*[-–]\s*(\d{1,2})[.:](\d{2})/);
      if (range) {
        slots.push({
          start: column,
          end: column + cell.colSpan,
          from: `${range[1]}:${range[2]}`,
          to: `${range[3]}:${range[4]}`,
          fromMinutes: Number(range[1]) * 60 + Number(range[2]),
          toMinutes: Number(range[3]) * 60 + Number(range[4])
        });
      }
      column += cell.colSpan;
    });
    if (!slots.length) return null;

    const slotAt = (index) => slots.findIndex((slot) => index >= slot.start && index < slot.end);
    const slotBefore = (index) => {
      let found = -1;
      slots.forEach((slot, i) => { if (slot.start < index) found = i; });
      return found;
    };

    const events = [];
    const days = [];

    [...table.tBodies].forEach((body) => {
      [...body.rows].forEach((row) => {
        const head = row.cells[0];
        if (!head || !head.classList.contains("zahlavi")) return;
        const dayLabel = txt(head);
        if (!dayLabel) return;
        const dayIndex = DAY_ORDER.indexOf(dayLabel.toLowerCase().slice(0, 2));
        const day = dayIndex >= 0 ? dayIndex : days.length;
        if (!days.includes(day)) days.push(day);

        let cursor = 0;
        [...row.cells].forEach((cell) => {
          const kindClass = cell.className || "";
          if (/rozvrh-(pred|cvic|zap|other)/.test(kindClass)) {
            const startSlot = slotAt(cursor);
            const endSlot = slotBefore(cursor + cell.colSpan);
            if (startSlot >= 0) {
              const links = [...cell.querySelectorAll("a")];
              const room = links[0] ? txt(links[0]) : "";
              const subjectLink = links[1] || links[0] || null;
              const subject = links[1] ? txt(links[1]) : "";
              const groups = txt(cell.querySelector("sup"));
              const teacher = txt(cell.querySelector("i"));
              const last = Math.max(startSlot, endSlot);
              events.push({
                day,
                startSlot,
                endSlot: last,
                from: slots[startSlot].from,
                to: slots[last].to,
                fromMinutes: slots[startSlot].fromMinutes,
                toMinutes: slots[last].toMinutes,
                kind: /rozvrh-pred/.test(kindClass) ? "pred" : (/rozvrh-cvic/.test(kindClass) ? "cvic" : "other"),
                subject: subject || room,
                room,
                groups,
                teacher,
                href: subjectLink ? subjectLink.href : ""
              });
            }
          }
          cursor += cell.colSpan;
        });
      });
    });

    days.sort((a, b) => a - b);
    return { table, slots, events, days: days.length ? days : [0, 1, 2, 3, 4] };
  }

  function weekDates() {
    const now = new Date();
    const monday = new Date(now);
    const offset = (now.getDay() + 6) % 7;
    monday.setDate(now.getDate() - offset);
    monday.setHours(0, 0, 0, 0);
    return { monday, todayIndex: offset };
  }

  function renderTimetable(model) {
    const { monday, todayIndex } = weekDates();
    const names = DAY_NAMES[lang()] || DAY_NAMES.en;

    const headerCells = model.days.map((day) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + day);
      const isToday = day === todayIndex;
      return `<div class="stu-tt-day${isToday ? " is-today" : ""}">
        <b>${esc(names[day] || "")}</b>
        <small>${date.getDate()}. ${date.getMonth() + 1}.</small>
      </div>`;
    }).join("");

    const timeCells = model.slots.map((slot, index) =>
      `<div class="stu-tt-time" style="grid-row:${index + 2}">${esc(slot.from)} – ${esc(slot.to)}</div>`).join("");

    const backCells = model.days.map((day, dayIndex) =>
      model.slots.map((slot, slotIndex) =>
        `<div class="stu-tt-cell${day === todayIndex ? " is-today-col" : ""}" style="grid-column:${dayIndex + 2};grid-row:${slotIndex + 2}"></div>`
      ).join("")).join("");

    const eventCells = model.events.map((event, index) => {
      const dayIndex = model.days.indexOf(event.day);
      if (dayIndex < 0) return "";
      return `<a class="stu-tt-event" data-kind="${event.kind}" data-event="${index}" data-subject="${esc(event.subject)}"
        ${event.href ? `href="${esc(event.href)}"` : ""}
        style="grid-column:${dayIndex + 2};grid-row:${event.startSlot + 2} / ${event.endSlot + 3}">
        <b>${esc(event.subject)}</b>
        <span class="stu-tt-when">${esc(event.from)} – ${esc(event.to)}${event.groups ? ` <sup>${esc(event.groups)}</sup>` : ""}</span>
        ${event.room ? `<em>${svg("pin")}${esc(event.room)}</em>` : ""}
        ${event.teacher ? `<em>${svg("user")}${esc(event.teacher)}</em>` : ""}
      </a>`;
    }).join("");

    return el(`
      <div class="stu-timetable">
        <div class="stu-tt-scroll">
          <div class="stu-tt-grid" style="--stu-tt-days:${model.days.length}">
            <div class="stu-tt-corner">${esc(lang() === "en" ? "Time" : "Deň / čas")}</div>
            ${headerCells}
            ${timeCells}
            ${backCells}
            ${eventCells}
          </div>
        </div>
      </div>`);
  }

  function upcomingList(events) {
    const { todayIndex } = weekDates();
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const names = DAY_NAMES[lang()] || DAY_NAMES.en;

    const ordered = (events || [])
      .map((event) => {
        let distance = (event.day - todayIndex + 7) % 7;
        if (distance === 0 && event.toMinutes < nowMinutes) distance = 7;
        return { event, distance };
      })
      .sort((a, b) => (a.distance - b.distance) || (a.event.fromMinutes - b.event.fromMinutes))
      .slice(0, 4);

    if (!ordered.length) return "";

    return ordered.map(({ event, distance }) => {
      const when = distance === 0 ? t("today") : (distance === 1 ? t("tomorrow") : names[event.day]);
      return `<a class="stu-upcoming-item" data-kind="${event.kind}" ${event.href ? `href="${esc(event.href)}"` : ""}>
        <span class="stu-upcoming-dot"></span>
        <span class="stu-upcoming-copy">
          <b>${esc(event.subject)}</b>
          <span>${esc(when)} · ${esc(event.from)} – ${esc(event.to)}</span>
          ${event.room ? `<em>${svg("pin")}${esc(event.room)}</em>` : ""}
          ${event.teacher ? `<em>${svg("user")}${esc(event.teacher)}</em>` : ""}
        </span>
      </a>`;
    }).join("");
  }

  function validityInfo() {
    const raw = txt(document.querySelector("#base-r"));
    const match = raw.match(/(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})\s*[-–]\s*(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/);
    return match ? { from: match[1], to: match[2] } : null;
  }

  function icsFor(model) {
    const pad = (value) => String(value).padStart(2, "0");
    const { monday } = weekDates();
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//UIS+//STU timetable//EN", "CALSCALE:GREGORIAN"];

    model.events.forEach((event, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + event.day);
      const stamp = (minutes) =>
        `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}00`;
      const escape = (value) => String(value || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
      lines.push(
        "BEGIN:VEVENT",
        `UID:uisplus-${index}-${stamp(event.fromMinutes)}@is.stuba.sk`,
        `DTSTART:${stamp(event.fromMinutes)}`,
        `DTEND:${stamp(event.toMinutes)}`,
        "RRULE:FREQ=WEEKLY",
        `SUMMARY:${escape(event.subject)}`,
        `LOCATION:${escape(event.room)}`,
        `DESCRIPTION:${escape([event.teacher, event.groups].filter(Boolean).join(" · "))}`,
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  function timetablePage() {
    const model = parseTimetable();
    buildPageHead({ title: t("timetable"), lead: t("timetableLead"), icon: "calendar" });
    if (!model) return;

    /* The page header already carries a description, so the native one-liner
       about the HTML preview would just repeat it. */
    const nativeLead = contentRoot() && contentRoot().querySelector(":scope > div.small");
    if (nativeLead) nativeLead.classList.add("stu-lifted");

    const root = contentRoot();
    if (!root || root.querySelector(".stu-timetable")) return;

    model.table.dataset.stuSkip = "true";
    const grid = renderTimetable(model);

    /* The native table stays in the DOM (printing, scripts) but is hidden. */
    model.table.style.display = "none";
    model.table.parentNode.insertBefore(grid, model.table);

    const subjects = [...new Set(model.events.map((event) => event.subject))].filter(Boolean);
    const validity = validityInfo();
    const upcoming = upcomingList(model.events);
    cacheSave(model.events);

    const railHTML = `
      ${upcoming ? `<div class="stu-rail-card">
        <div class="stu-rail-head">${svg("clock")}<h2>${esc(t("upcoming"))}</h2></div>
        <div class="stu-rail-body"><div class="stu-upcoming">${upcoming}</div></div>
      </div>` : ""}
      ${validity ? `<div class="stu-week-card">
        <div class="stu-week-icon">${svg("calendar")}</div>
        <div class="stu-week-copy">
          <b>${esc(t("validity"))}</b>
          <small>${esc(validity.from)} – ${esc(validity.to)}</small>
        </div>
      </div>` : ""}
      <div class="stu-rail-card">
        <div class="stu-rail-body" style="padding-top:16px">
          <button type="button" class="stu-outline-button" data-stu-ics style="width:100%">
            ${svg("calendarPlus")}${esc(t("addToCalendar"))}
          </button>
        </div>
      </div>
      ${subjects.length ? `<div class="stu-rail-card">
        <div class="stu-rail-head">${svg("filter")}<h2>${esc(t("quickFilters"))}</h2></div>
        <div class="stu-rail-body"><div class="stu-filters">
          ${subjects.map((subject, index) => `<label class="stu-filter">
            <input type="checkbox" checked data-stu-filter="${esc(subject)}" id="stu-filter-${index}">
            <span>${esc(subject)}</span>
          </label>`).join("")}
        </div></div>
      </div>` : ""}
      <div class="stu-tip">
        ${svg("info")}
        <div class="stu-tip-copy"><b>${esc(t("tip"))}</b><p>${esc(t("tipBody"))}</p></div>
      </div>`;

    const built = buildLayout(railHTML);
    if (!built) return;

    built.rail.querySelectorAll("[data-stu-filter]").forEach((input) => {
      input.addEventListener("change", () => {
        const active = [...built.rail.querySelectorAll("[data-stu-filter]")]
          .filter((node) => node.checked)
          .map((node) => node.dataset.stuFilter);
        grid.querySelectorAll(".stu-tt-event").forEach((node) => {
          node.classList.toggle("is-dimmed", !active.includes(node.dataset.subject));
        });
      });
    });

    const icsButton = built.rail.querySelector("[data-stu-ics]");
    if (icsButton) {
      icsButton.addEventListener("click", () => {
        const blob = new Blob([icsFor(model)], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "uis-rozvrh.ics";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      });
    }

    if (!model.events.length) {
      grid.innerHTML = `<div class="stu-tt-empty">${esc(t("noLessons"))}</div>`;
    }
  }

  /* ====================================================================== */
  /*  Mailbox and document server                                           */
  /* ====================================================================== */

  function splitWithTree(headOptions) {
    buildPageHead(headOptions);
    const root = contentRoot();
    const tree = root ? root.querySelector("div.tree") : null;
    if (!root || !tree || root.querySelector(".stu-split")) return null;

    const split = el('<div class="stu-split"><div class="stu-split-aside"></div><div class="stu-split-main"></div></div>');
    const aside = split.querySelector(".stu-split-aside");
    const main = split.querySelector(".stu-split-main");

    const movable = [...root.children].filter((node) =>
      !node.classList.contains("stu-crumbbar") &&
      !node.classList.contains("stu-page-head") &&
      !node.classList.contains("portal_menu") &&
      node.tagName !== "SCRIPT");

    if (!movable.length) return null;
    movable[0].parentNode.insertBefore(split, movable[0]);
    movable.forEach((node) => main.appendChild(node));

    /* STU lays these applications out as a two-column table: the folder tree
       and its controls on the left, the listing on the right. Move the whole
       left cell — not just the tree — otherwise its toolbar and quota box stay
       behind and leave a wide empty gutter beside the listing. */
    /* The tree sits in nested single-cell tables, so walk every ancestor cell
       and take the outer one that actually forms the two-column layout. */
    const ancestorCells = [];
    for (let node = tree.parentElement; node; node = node.parentElement) {
      if (node.tagName === "TD") ancestorCells.push(node);
      if (node === main) break;
    }
    const cell = ancestorCells.find((candidate) =>
      candidate.parentElement && candidate.parentElement.cells.length > 1);

    if (cell) {
      while (cell.firstChild) aside.appendChild(cell.firstChild);
      const row = cell.parentElement;
      const table = cell.closest("table");
      cell.remove();

      /* With the sidebar cell gone the layout table has nothing left to lay
         out, and its auto sizing keeps the listing narrower than the column.
         Unwrap it so the listing simply fills the available width. */
      if (table && row.cells.length === 1) {
        const holder = document.createElement("div");
        while (row.cells[0].firstChild) holder.appendChild(row.cells[0].firstChild);
        table.parentNode.insertBefore(holder, table);
        table.remove();
      } else {
        [...row.cells].forEach((rest) => { rest.style.width = "auto"; });
        if (table) {
          table.style.width = "100%";
          table.dataset.stuSkip = "true";
        }
      }
      /* The listing toolbar belongs above the table, not in the sidebar. */
      const toolbar = aside.querySelector(".jstm-toolbox");
      if (toolbar) main.prepend(toolbar);

      /* The emptied layout scaffolding would otherwise push the sidebar down. */
      [...aside.children].forEach((node) => {
        if (node.querySelector("img, input, select, svg")) return;
        if (txt(node)) return;
        node.remove();
      });

      /* Everything the sidebar carries besides the folder tree — the quota
         readout and the legend — becomes a single card so the column reads as
         a stack of panels rather than loose text. */
      const treeNode = aside.querySelector("div.tree");
      const trailing = [];
      let after = treeNode ? treeNode.nextSibling : null;
      while (after) {
        const next = after.nextSibling;
        trailing.push(after);
        after = next;
      }
      if (trailing.length) {
        const card = document.createElement("div");
        card.className = "stu-aside-card";
        aside.appendChild(card);
        trailing.forEach((node) => card.appendChild(node));
        if (!txt(card)) card.remove();
      }
    } else {
      aside.appendChild(tree);
    }

    return { split, aside, main };
  }

  function mailboxPage() {
    markUnreadMail();
    const built = splitWithTree({ title: t("mailbox"), icon: "mail" });
    if (!built) return;

    const raw = txt(document.querySelector("#base-r"));
    const quota = raw.match(/(\d[\d\s]*)\s*(?:spr[áa]v|zpr[áa]v|messages?)\s*z[e]?\s*(\d[\d\s]*)/i);
    const percent = raw.match(/(\d{1,3}[.,]\d{1,2})\s*%/);
    if (quota) {
      const used = Number(quota[1].replace(/\s/g, ""));
      const total = Number(quota[2].replace(/\s/g, ""));
      const ratio = percent ? Number(percent[1].replace(",", ".")) : (total ? (used / total) * 100 : 0);
      const level = ratio > 90 ? "is-danger" : (ratio > 70 ? "is-warning" : "");
      built.aside.appendChild(el(`
        <div class="stu-quota">
          <b>${esc(lang() === "en" ? "Mailbox usage" : "Využitie schránky")}</b>
          <div class="stu-quota-bar ${level}"><i style="width:${Math.min(100, ratio).toFixed(1)}%"></i></div>
          <small>${esc(used)} / ${esc(total)} · ${ratio.toFixed(1)} %</small>
        </div>`));
    }
  }

  function docServerPage() {
    splitWithTree({ title: t("docServer"), icon: "docs" });
  }

  /* ====================================================================== */
  /*  Message detail                                                        */
  /* ====================================================================== */

  function messagePage() {
    buildPageHead({ icon: "mail" });
    const root = contentRoot();
    if (!root || root.querySelector(".stu-layout")) return;

    const form = root.querySelector("form");
    if (!form) return;

    /* The header table is the first table that carries a zahlavi caption. */
    const headerTable = [...form.querySelectorAll("table")]
      .find((table) => table.querySelector("tr.zahlavi") && table.rows.length > 3);
    if (!headerTable) return;

    headerTable.dataset.stuSkip = "true";
    headerTable.classList.add("stu-msg-headers");

    const fields = {};
    const rows = [...headerTable.rows];
    rows.forEach((row) => {
      if (row.cells.length === 2 && !row.classList.contains("zahlavi")) {
        const key = txt(row.cells[0]).replace(/:$/, "");
        if (key) fields[key.toLowerCase()] = { label: key, value: txt(row.cells[1]), cell: row.cells[1] };
      }
    });

    /* The last full-width cell holds the message body. */
    const bodyRow = rows.filter((row) => row.cells.length === 1 && txt(row.cells[0]).length > 40).pop();
    if (bodyRow) {
      const holder = el('<div class="stu-msg-body"></div>');
      while (bodyRow.cells[0].firstChild) holder.appendChild(bodyRow.cells[0].firstChild);
      headerTable.after(holder);
      bodyRow.remove();
    }

    const actionTable = [...form.querySelectorAll("table")]
      .find((table) => table !== headerTable && table.querySelector('input[type="submit"], input[type="button"]'));
    if (actionTable) {
      actionTable.dataset.stuSkip = "true";
      const wrap = el('<div class="stu-msg-actions"></div>');
      actionTable.parentNode.insertBefore(wrap, actionTable);
      wrap.appendChild(actionTable);
    }

    const pick = (...keys) => {
      const found = Object.keys(fields).find((key) => keys.some((needle) => key.includes(needle)));
      return found ? fields[found] : null;
    };

    const from = pick("od", "from", "odosielate");
    const when = pick("doruč", "doruc", "receiv", "datum", "dátum");
    const size = pick("veľkos", "velikost", "size");
    const subject = pick("predmet", "subject");

    const senderName = from ? from.value.replace(/<[^>]*>/g, "").replace(/^"|"$/g, "").trim() : "";
    const senderMail = from ? (from.value.match(/[\w.+-]+@[\w.-]+/) || [""])[0] : "";
    const senderLink = from && from.cell ? from.cell.querySelector("a[href]") : null;
    const initials = senderName
      ? senderName.split(/[\s.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
      : "?";

    const attachments = [...form.querySelectorAll("a[href]")]
      .filter((link) => /priloh|příloh|attach|download|stiahnu/i.test(`${link.textContent} ${link.getAttribute("href")}`))
      .slice(0, 8);

    const railHTML = `
      ${from ? `<div class="stu-rail-card">
        <div class="stu-rail-head">${svg("mail")}<h2>${esc(t("sender"))}</h2></div>
        <div class="stu-sender-card">
          <div class="stu-sender-top">
            <div class="stu-sender-avatar">${esc(initials)}</div>
            <div class="stu-sender-copy">
              <b>${esc(senderName || senderMail)}</b>
              ${senderMail && senderMail !== senderName ? `<small>${esc(senderMail)}</small>` : ""}
            </div>
          </div>
          ${senderLink ? `<div class="stu-button-row">
            <a class="stu-outline-button" href="${esc(senderLink.href)}">${svg("reply")}${esc(t("writeToSender"))}</a>
          </div>` : ""}
        </div>
      </div>` : ""}
      <div class="stu-rail-card">
        <div class="stu-rail-head">${svg("info")}<h2>${esc(t("messageInfo"))}</h2></div>
        <div class="stu-rail-body">
          <div class="stu-status-rows">
            ${subject ? `<div class="stu-status-row">${svg("chevronRight")}<span>${esc(subject.label)}</span><b>${esc(subject.value.slice(0, 32))}</b></div>` : ""}
            ${when ? `<div class="stu-status-row">${svg("clock")}<span>${esc(when.label)}</span><b>${esc(when.value)}</b></div>` : ""}
            ${size ? `<div class="stu-status-row">${svg("docs")}<span>${esc(size.label)}</span><b>${esc(size.value)}</b></div>` : ""}
          </div>
        </div>
      </div>
      <div class="stu-rail-card">
        <div class="stu-rail-head">${svg("folder")}<h2>${esc(t("attachments"))}</h2></div>
        <div class="stu-rail-body">
          ${attachments.length
            ? `<div class="stu-upcoming">${attachments.map((link) =>
                `<a class="stu-upcoming-item" href="${esc(link.href)}"><span class="stu-upcoming-dot"></span>
                 <span class="stu-upcoming-copy"><b>${esc(txt(link) || "…")}</b></span></a>`).join("")}</div>`
            : `<div class="stu-empty-state">${svg("docs")}<p>${esc(t("noAttachments"))}</p></div>`}
        </div>
      </div>`;

    buildLayout(railHTML);
  }

  /* ====================================================================== */
  /*  Student portal                                                        */
  /* ====================================================================== */

  function studyFacts() {
    const facts = [];
    const raw = txt(document.querySelector("#base-r"));
    const patterns = [
      [/akademick[ýy] rok\s*:?\s*(\d{4}\/\d{4})/i, "calendar"],
      [/(ZS|LS)\s*(\d{4}\/\d{4})/, "layers"],
      [/(\d)\.\s*ro[čc]n[íi]k/i, "award"],
      [/semest(?:er|r)\s*:?\s*(\d+)/i, "chart"]
    ];
    patterns.forEach(([pattern, icon]) => {
      const hit = raw.match(pattern);
      if (hit) facts.push({ icon, value: hit[0].trim() });
    });
    return facts.slice(0, 4);
  }

  function studentPage() {
    buildPageHead({ icon: "study" });
    const root = contentRoot();
    if (!root || root.querySelector(".stu-layout")) return;

    const grid = root.querySelector(".rada-ikon");
    if (!grid) return;

    const facts = studyFacts();
    const enrolled = /riadne zap[íi]san|properly enrolled|řádně zaps/i.test(txt(document.querySelector("#base-r")));

    const railHTML = `
      ${(facts.length || enrolled) ? `<div class="stu-rail-card">
        <div class="stu-rail-head">${svg("checkCircle")}<h2>${esc(t("studyState"))}</h2></div>
        <div class="stu-status-card">
          ${enrolled ? `<div class="stu-status-top">
            <div class="stu-status-icon">${svg("check")}</div>
            <div class="stu-status-copy"><b>${esc(lang() === "en" ? "Properly enrolled" : "Riadne zapísaný")}</b></div>
          </div>` : ""}
          ${facts.length ? `<div class="stu-status-rows">${facts.map((fact) =>
            `<div class="stu-status-row">${svg(fact.icon)}<b>${esc(fact.value)}</b></div>`).join("")}</div>` : ""}
        </div>
      </div>` : ""}
      <div class="stu-tip">
        ${svg("info")}
        <div class="stu-tip-copy"><b>${esc(t("tip"))}</b><p>${esc(t("tipBody"))}</p></div>
      </div>`;

    if (!facts.length && !enrolled) return;

    buildLayout(railHTML);
  }

  /* ====================================================================== */
  /*  Sign-in                                                               */
  /* ====================================================================== */

  /* STU serves the sign-in form at /auth/, the same address as the home page,
     so this has to run before the route table or the dashboard is painted on
     top of the password field. The form, its ids and its scripts stay as STU
     wrote them; only labels, autofill hints and order are adjusted. */
  function loginPage() {
    const box = document.querySelector("#loginform");
    const form = box ? box.closest("form") || box : null;
    const stack = form ? form.parentElement : null;
    if (!stack || stack.dataset.stuLogin) return;
    stack.dataset.stuLogin = "1";
    stack.classList.add("stu-login-stack");

    const head = el(`
      <div class="stu-login-head">
        <span class="stu-login-mark" aria-hidden="true">${"<i></i>".repeat(12)}</span>
        <h1>${esc(t("signInTitle"))}</h1>
        <p>${esc(api().label("university"))}</p>
      </div>`);
    const crumbbar = stack.querySelector(":scope > .stu-crumbbar");
    if (crumbbar) crumbbar.after(head);
    else stack.prepend(head);

    stack.querySelectorAll(":scope > .login-vypisek:not(#errors_place)").forEach((node) => {
      node.classList.add("stu-login-note");
    });

    box.querySelectorAll(".login-input").forEach((row) => {
      const caption = row.querySelector(".login-input-label");
      const input = row.querySelector("input");
      if (!caption || !input || !input.id || caption.tagName === "LABEL") return;
      const labelNode = document.createElement("label");
      labelNode.className = caption.className;
      labelNode.htmlFor = input.id;
      labelNode.textContent = txt(caption);
      caption.replaceWith(labelNode);
    });

    const login = box.querySelector("#credential_0");
    const password = box.querySelector("#credential_1");
    if (login) login.setAttribute("autocomplete", "username");
    if (password) {
      password.setAttribute("autocomplete", "current-password");
      const field = document.createElement("span");
      field.className = "stu-password-field";
      password.parentNode.insertBefore(field, password);
      field.appendChild(password);
      const reveal = el(`<button class="stu-password-toggle" type="button" aria-pressed="false"
        aria-label="${esc(t("showPassword"))}" title="${esc(t("showPassword"))}">${svg("eye")}</button>`);
      field.appendChild(reveal);
      reveal.addEventListener("click", () => {
        const shown = password.type === "password";
        password.type = shown ? "text" : "password";
        const caption = shown ? t("hidePassword") : t("showPassword");
        reveal.setAttribute("aria-pressed", String(shown));
        reveal.setAttribute("aria-label", caption);
        reveal.title = caption;
        reveal.innerHTML = svg(shown ? "eyeOff" : "eye");
        password.focus();
      });
      /* Never submit the password while it is visible on screen. */
      form.addEventListener("submit", () => { password.type = "password"; });
    }
  }

  /* ====================================================================== */
  /*  Module board on the personal administration home                      */
  /* ====================================================================== */

  /* STU paints every section with its own multicolour clip-art glyph. They are
     swapped for the line icons the sidebar uses, so the board reads as one set. */
  /* Order matters: "Mobilná aplikácia Moje štúdium" must not match "štúdium",
     and "Ochrana osobných údajov" must not match "Osobný manažment". */
  const MODULE_ICONS = [
    [/mobiln|mobile/i, "phone"],
    [/verejn|ve[řr]ejn|public/i, "globe"],
    [/elearn/i, "elearning"],
    [/dokument[áa]ci|documentation|n[áa]pov[ěe]d/i, "help"],
    [/her[ňn]a|oddych|game/i, "game"],
    [/prisp[ôo]sob|p[řr]izp[ůu]sob|custom|adjust/i, "sliders"],
    [/nastaven|setting|set-?up/i, "settings"],
    [/ochran|privacy|protection|gdpr/i, "lock"],
    [/[šs]t[úu]di|stud(y|ies)|college/i, "study"],
    [/veda|v[ěe]da|research/i, "research"],
    [/agend/i, "clipboard"],
    [/osobn|personal/i, "personal"],
    [/technol|spr[áa]v|admin/i, "tech"],
    [/[ľl]udia|lid[ée]|people/i, "users"],
    [/dokument/i, "docs"],
    [/po[šs]t|mail/i, "mail"]
  ];

  function enhanceModules() {
    const blocks = document.querySelectorAll("#base-r .polozky-obal");
    if (!blocks.length) return;

    blocks.forEach((block) => {
      if (block.dataset.stuModule) return;
      block.dataset.stuModule = "1";
      /* STU separates the heading from the list with "&nbsp;&nbsp;", which
         renders as an empty line under the heading; drop such filler. */
      block.querySelectorAll(".ramecek-boky > div, .polozky").forEach((box) => {
        [...box.childNodes].forEach((node) => {
          if (node.nodeType === 3 && !node.nodeValue.replace(/[\s ]/g, "")) node.remove();
        });
      });
      const slot = block.querySelector(".polozky-obr");
      if (!slot) return;
      const title = txt(block.querySelector(".sekce-nadpis"));
      const hit = MODULE_ICONS.find(([pattern]) => pattern.test(title));
      slot.classList.add("stu-module-icon");
      slot.insertAdjacentHTML("beforeend", svg(hit ? hit[1] : "layers"));
    });

    /* A heading for the board, sharing its row with STU's own "open all"
       links so they stay where STU's script expects them. */
    const bar = document.querySelector("#base-r .menitko-all");
    if (bar && !bar.querySelector(".stu-modules-title")) {
      bar.insertAdjacentHTML("afterbegin", `<h2 class="stu-modules-title">${esc(api().label("applications"))}</h2>`);
    }
  }

  /* ====================================================================== */
  /*  Assignments (student portal → "Miesta odovzdania")                    */
  /* ====================================================================== */

  /* odevzdavarny.pl lists, for the current period, the open submission
     places first ("Kam môžem odovzdať"), then the ones already handed in and
     the closed ones. Only the first table matters: an open place whose
     deadline has not passed is something still to hand in. */
  const ASSIGNMENTS_PATH = "/auth/student/odevzdavarny.pl";
  const ASSIGNMENTS_TTL = 1000 * 60 * 10;
  let assignmentsRequest = null;

  /* Slovak and Czech pages write "03.03.2026 23:59", the English one
     "03/03/2026 23:59" as month/day. */
  function parseDeadline(value) {
    const dotted = value.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})(?:\s+(\d{1,2})[:.](\d{2}))?/);
    const slashed = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2})[:.](\d{2}))?/);
    let day;
    let month;
    let parts;
    if (dotted) { parts = dotted; day = dotted[1]; month = dotted[2]; }
    else if (slashed) { parts = slashed; day = slashed[2]; month = slashed[1]; }
    else return null;
    const hasTime = parts[4] !== undefined;
    const date = new Date(Number(parts[3]), Number(month) - 1, Number(day),
      hasTime ? Number(parts[4]) : 23, hasTime ? Number(parts[5]) : 59);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }

  function parseAssignments(doc) {
    const table = [...doc.querySelectorAll("table")].find((node) =>
      [...node.querySelectorAll("thead th, tr.zahlavi th, tr.zahlavi td")]
        .some((cell) => /^(dokedy|do kdy|until)$/i.test(txt(cell))));
    if (!table) return [];

    const headers = [...table.querySelectorAll("thead th, tr.zahlavi th, tr.zahlavi td")].map(txt);
    const at = (pattern, fallback) => {
      const index = headers.findIndex((name) => pattern.test(name));
      return index >= 0 ? index : fallback;
    };
    const subjectAt = at(/^(n[áa]zov predmetu|n[áa]zev p[řr]edm[ěe]tu|course title)$/i, 0);
    const nameAt = at(/^(n[áa]zov|n[áa]zev|name)$/i, 1);
    const deadlineAt = at(/^(dokedy|do kdy|until)$/i, 4);

    return [...table.querySelectorAll("tr")]
      .filter((row) => !row.classList.contains("zahlavi") && row.cells.length > deadlineAt)
      .map((row) => {
        const cells = [...row.cells];
        const deadline = parseDeadline(txt(cells[deadlineAt]));
        const upload = cells[cells.length - 1].querySelector("a[href]");
        return {
          subject: txt(cells[subjectAt]),
          title: txt(cells[nameAt]),
          deadline,
          href: upload ? api().withLang(upload.getAttribute("href")) : ""
        };
      })
      .filter((item) => item.deadline && item.title);
  }

  function loadAssignments() {
    const known = api().assignments();
    if (Date.now() - (known.savedAt || 0) < ASSIGNMENTS_TTL) return Promise.resolve(known.items);
    if (!assignmentsRequest) {
      assignmentsRequest = fetch(api().withLang(ASSIGNMENTS_PATH), {
        credentials: "include",
        headers: { Accept: "text/html" }
      })
        .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          if (doc.querySelector("#loginform")) return api().assignments().items;
          api().setAssignments(parseAssignments(doc));
          return api().assignments().items;
        })
        .catch(() => api().assignments().items)
        .finally(() => { assignmentsRequest = null; });
    }
    return assignmentsRequest;
  }

  /* Opening the page itself refreshes the list for free — but only for the
     current period; an older period picked in the selector is not "due". */
  function assignmentsPage() {
    if (/[?;&]obdobi=/.test(location.search)) return;
    api().setAssignments(parseAssignments(document));
  }

  function dueLabel(deadline) {
    const due = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((new Date(due.getFullYear(), due.getMonth(), due.getDate()) - today) / 86400000);
    const relative = days <= 0 ? t("dueToday") : (days === 1 ? t("dueTomorrow") : t("dueIn", days));
    const time = due.toLocaleTimeString(lang() === "en" ? "en-GB" : lang(), { hour: "2-digit", minute: "2-digit" });
    const date = lang() === "en"
      ? due.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : `${due.getDate()}. ${due.getMonth() + 1}.`;
    return { text: `${t("dueUntil")} ${date} ${time}`, relative, soon: deadline - Date.now() < 1000 * 60 * 60 * 48 };
  }

  function assignmentsCard(items) {
    if (!items.length) return "";
    const listHref = api().withLang(ASSIGNMENTS_PATH);
    return `
      <div class="stu-rail-card stu-assignments">
        <div class="stu-rail-head">${svg("clipboard")}<h2>${esc(t("assignments"))}</h2>
          <a class="stu-rail-action" href="${esc(listHref)}">${esc(t("showAll"))}</a>
        </div>
        <div class="stu-rail-body">
          <div class="stu-assignment-list">
            ${items.slice(0, 5).map((item) => {
              const due = dueLabel(item.deadline);
              return `<a class="stu-assignment${due.soon ? " is-soon" : ""}" href="${esc(item.href || listHref)}">
                <b>${esc(item.title)}</b>
                <span>${esc(item.subject)}</span>
                <small>${svg("clock")}${esc(due.text)} · <em>${esc(due.relative)}</em></small>
              </a>`;
            }).join("")}
          </div>
        </div>
      </div>`;
  }

  /* ====================================================================== */
  /*  Mailbox read state                                                    */
  /* ====================================================================== */

  /* STU marks an unread message only by wrapping its subject in <b>, which
     is easy to miss once every subject shares one colour. Rows get a class so
     the theme can mark them unmistakably. */
  function markUnreadMail() {
    if (!/^\/auth\/posta\//.test(location.pathname)) return;
    document.querySelectorAll("#base-r tr.uis-hl-table").forEach((row) => {
      if (row.cells.length < 5) return;
      const unread = Boolean(row.querySelector("td > a > b, td > b > a"));
      row.classList.toggle("stu-mail-unread", unread);
      row.classList.toggle("stu-mail-read", !unread);
    });
  }

  /* ====================================================================== */
  /*  Personal administration home                                          */
  /* ====================================================================== */

  function homePage() {
    enhanceModules();
    const root = contentRoot();
    if (!root || root.querySelector(".stu-hero")) return;

    const user = api() ? api().user() : { name: "" };
    const firstName = (user.name || "").split(/\s+/)[0] || "";
    const counters = api() ? api().counters() : { messages: 0, documents: 0, tasks: 0 };
    const studyHref = api() ? api().withLang("/auth/student/moje_studium.pl?_m=3110") : "#";
    const timetableHref = api() ? api().withLang("/auth/katalog/rozvrhy_view.pl?rozvrh_student_obec=1;zobraz=1") : "#";

    const hero = el(`
      <div class="stu-hero">
        <div class="stu-hero-main">
          <small>${esc(t("greeting"))},</small>
          <h1>${esc(firstName || user.name)}!</h1>
          <p>${esc(api() ? api().label("app") : "")} · ${esc(api() ? api().label("university") : "")}</p>
          <a class="stu-hero-cta" href="${esc(studyHref)}">${esc(t("mystudy"))}${svg("chevronRight")}</a>
        </div>
        <div class="stu-hero-side">
          <a class="stu-hero-row" href="${esc(api() ? api().withLang("/auth/posta/") : "#")}">
            ${svg("mail")}<span>${esc(api() ? api().label("messages") : "")}</span><b>${esc(counters.messages)}</b>
          </a>
          <a class="stu-hero-row" href="${esc(api() ? api().withLang("/auth/dok_server/nove_dok.pl") : "#")}">
            ${svg("docs")}<span>${esc(api() ? api().label("documents") : "")}</span><b>${esc(counters.documents)}</b>
          </a>
          <a class="stu-hero-row" href="${esc(api() ? api().withLang(ASSIGNMENTS_PATH) : "#")}" data-stu-tasks>
            ${svg("checkCircle")}<span>${esc(api() ? api().label("tasks") : "")}</span><b>${esc(counters.tasks)}</b>
          </a>
        </div>
      </div>`);

    const crumbbar = root.querySelector(":scope > .stu-crumbbar");
    if (crumbbar) crumbbar.after(hero);
    else root.prepend(hero);

    /* The next lessons come from the timetable this student already opened;
       nothing is requested from UIS here. */
    cacheLoad().then((events) => {
      const upcoming = upcomingList(events);
      const railHTML = `
        <div data-stu-assignments></div>
        <div class="stu-rail-card">
          <div class="stu-rail-head">${svg("clock")}<h2>${esc(t("upcoming"))}</h2>
            <a class="stu-rail-action" href="${esc(timetableHref)}">${esc(t("showAll"))}</a>
          </div>
          <div class="stu-rail-body">
            ${upcoming
              ? `<div class="stu-upcoming">${upcoming}</div>`
              : `<div class="stu-empty-state">${svg("calendar")}<p>${esc(t("openTimetableHint"))}</p></div>`}
          </div>
        </div>
        <div class="stu-rail-card">
          <div class="stu-rail-body" style="padding-top:16px">
            <a class="stu-outline-button" href="${esc(timetableHref)}" style="width:100%">
              ${svg("calendar")}${esc(t("openTimetable"))}
            </a>
          </div>
        </div>
        <div class="stu-tip">
          ${svg("info")}
          <div class="stu-tip-copy"><b>${esc(t("tip"))}</b><p>${esc(t("tipBody"))}</p></div>
        </div>`;
      buildLayout(railHTML);
      renderAssignments();
    });

    /* Counted on every visit (at most every ten minutes); the card only
       appears while something is actually due. */
    function renderAssignments() {
      const items = api().assignments().items;
      const slot = document.querySelector("[data-stu-assignments]");
      if (slot) slot.innerHTML = assignmentsCard(items);
      const count = document.querySelector("[data-stu-tasks] b");
      if (count) count.textContent = String(api().counters().tasks);
    }
    loadAssignments().then(renderAssignments);
  }

  /* ====================================================================== */
  /*  Dispatch                                                              */
  /* ====================================================================== */

  const ROUTES = [
    { test: (path) => /rozvrhy_view/.test(path), run: timetablePage },
    { test: (path) => /^\/auth\/posta\/email\.pl/.test(path), run: messagePage },
    { test: (path) => /^\/auth\/posta\//.test(path), run: mailboxPage },
    { test: (path) => /^\/auth\/dok_server\//.test(path), run: docServerPage },
    { test: (path) => /^\/auth\/student\/odevzdavarny\.pl/.test(path), run: () => { studentPage(); assignmentsPage(); } },
    { test: (path) => /^\/auth\/student\//.test(path), run: studentPage },
    { test: (path) => /^\/auth\/?$/.test(path), run: homePage }
  ];

  function run() {
    if (!api()) return;
    if (api().isLoginPage()) {
      loginPage();
      return;
    }
    enhanceTables();

    const path = location.pathname;
    const route = ROUTES.find((entry) => entry.test(path));
    if (route) {
      route.run();
    } else {
      buildPageHead({});
    }
  }

  function refresh() {
    if (!api() || api().isLoginPage()) return;
    enhanceTables();
    enhanceModules();
    markUnreadMail();
  }

  window.UISPlusPages = { run, refresh };
})();
