<div align="center">
  <img src="icons/icon-512.png" width="112" alt="UIS+ browser extension logo">
  <h1>UIS+</h1>
  <p><strong>A modern interface for STU UIS — the university information system at is.stuba.sk.</strong></p>
  <p>
    Redesigned navigation, a rebuilt weekly timetable, a command palette and a dark theme<br>
    for students of the Slovak University of Technology in Bratislava. Formerly AIS+.
  </p>

  <p>
    <a href="https://github.com/antehor/UIS-Plus/releases/latest"><strong>Download UIS+</strong></a>
    ·
    <a href="#installation">Installation</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#frequently-asked-questions">FAQ</a>
    ·
    <a href="#slovenčina">Slovenčina</a>
    ·
    <a href="https://github.com/antehor/UIS-Plus/issues">Report a problem</a>
  </p>

  <p>
    <img alt="Latest UIS+ release" src="https://img.shields.io/github/v/release/antehor/UIS-Plus?display_name=tag&style=flat-square&color=9b1237">
    <img alt="MIT license" src="https://img.shields.io/github/license/antehor/UIS-Plus?style=flat-square&color=9b1237">
    <img alt="Chrome Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest%20V3-9b1237?style=flat-square">
    <img alt="Chrome and Edge" src="https://img.shields.io/badge/browser-Chrome%20%7C%20Edge-9b1237?style=flat-square">
    <img alt="No tracking" src="https://img.shields.io/badge/tracking-none-1f8a52?style=flat-square">
  </p>
</div>

---

> [!IMPORTANT]
> **UIS+ is the new name of AIS+.** STU now calls the system **UIS — Univerzitný informačný
> systém** (University Information System). If you used **AIS+**, searched for **STU AIS**, or know
> the old **Akademický informačný systém**, this is the same extension and the same `is.stuba.sk`
> service, updated for the new UIS name. Existing settings remain compatible.

**UIS+** is an open-source Chrome and Microsoft Edge extension that modernizes
[`is.stuba.sk`](https://is.stuba.sk/) for students of the
[Slovak University of Technology in Bratislava (STU)](https://www.stuba.sk/). It restyles the real
STU pages instead of replacing them, so every form, link, session and server response stays exactly
as the university serves it.

![UIS+ light theme for the STU University Information System, formerly AIS+](assets/uis-plus-light.png)

## Contents

- [Why UIS+](#why-uis)
- [Features](#features)
- [Installation](#installation)
- [Updating from AIS+](#updating-from-ais)
- [Using UIS+](#using-uis)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Privacy and permissions](#privacy-and-permissions)
- [How it works](#how-it-works)
- [Compatibility](#compatibility)
- [Frequently asked questions](#frequently-asked-questions)
- [Slovenčina](#slovenčina)
- [Contributing](#contributing)

## Why UIS+

| Standard STU UIS workflow | With UIS+ |
|---|---|
| Study tools are spread across several nested menus | A persistent sidebar built from your own live UIS menu |
| The timetable is a wide day-per-row table | A vertical week grid with colour-coded lectures and seminars |
| Reaching an application takes several clicks | `Ctrl + K` opens a command palette over every UIS application |
| Dense tables are hard to scan on large screens | Readable data tables, balanced spacing and responsive layouts |
| One fixed visual style | Light, dark and system themes, plus a compact density |
| Navigation language can change between pages | Your reading language is carried through every link |

## Features

### Navigation

- **Sidebar built from the live UIS menu.** Destinations are read from the personal administration
  page of your own signed-in session and cached locally, so no student-specific URL is hard-coded.
- **Command palette** (`Ctrl + K`) that searches every UIS application, the UIS+ sections and the
  links on the current page.
- **Collapsible sidebar** that remembers its state and turns into a drawer on small screens.
- **Unread counters** for messages and new documents, taken from the header UIS already renders.

### Rebuilt applications

- **Timetable.** The native day-per-row table is parsed and re-rendered as a vertical week grid:
  day columns, the current day highlighted, colour-coded lectures and seminars, room and teacher
  lines, an upcoming-lessons list, per-course filters and a local `.ics` export.
- **Mailbox and document server.** A two-column layout with the folder tree, mailbox quota and
  legend beside a full-width listing, modern toolbars and pill paginators.
- **Message view.** The message itself beside a rail with the sender, message details and
  attachments.
- **Personal administration.** A greeting header, notice cards grouped by severity, a responsive
  module grid and your next lessons in the side rail.

### Interface

- **Light, dark and system themes**, plus an optional compact density.
- **English, Slovak and Czech** interface controls, or `Auto` to follow the page.
- **Real STU UIS functionality stays intact** — UIS+ restyles existing pages and never replaces
  STU forms, links, sessions or server responses.
- **Optional Boss Fight mode** turns course assessment progress into a private, local game layer.

<details>
<summary><strong>Show the dark theme</strong></summary>

![UIS+ dark mode for is.stuba.sk, previously known as STU AIS](assets/uis-plus-dark.png)

</details>

## Installation

### Google Chrome

1. Download [`UIS-plus-v3.0.0.zip`](https://github.com/antehor/UIS-Plus/releases/latest) from the
   latest release.
2. Extract the archive to a permanent folder.
3. Open `chrome://extensions`.
4. Enable **Developer mode**.
5. Select **Load unpacked** and choose the extracted folder containing `manifest.json`.
6. Open or reload [is.stuba.sk](https://is.stuba.sk/).

### Microsoft Edge

1. Download and extract the latest UIS+ release.
2. Open `edge://extensions` and enable **Developer mode**.
3. Select **Load unpacked** and choose the folder containing `manifest.json`.
4. Open or reload [is.stuba.sk](https://is.stuba.sk/).

> Keep the extracted folder in place after installation. For more detail, open
> [`INSTALL.html`](INSTALL.html) or read the [installation guide](docs/INSTALLATION.md).

<details>
<summary><strong>Install from source</strong></summary>

```bash
git clone https://github.com/antehor/UIS-Plus.git
```

Load the cloned `UIS-Plus` directory as an unpacked extension. UIS+ has no build step and requires
no package manager.

</details>

## Updating from AIS+

UIS+ is a direct continuation of AIS+. To migrate:

1. Download and extract the latest UIS+ release over the existing extension folder, or install it
   as a new unpacked extension.
2. Open `chrome://extensions` or `edge://extensions` and press **Reload**.
3. Refresh the `is.stuba.sk` tab.

The storage keys are unchanged, so themes, language, compact mode, sidebar state and Boss Fight data
remain available when the same browser extension installation is updated.

## Using UIS+

- Click the **UIS+ extension icon** to enable or disable the redesign and choose a theme, language
  or density.
- Use the **moon and sun button** in the top bar to switch between light and dark.
- Use the **flag button** in the breadcrumb bar to switch between `SK`, `CZ` and `EN`.
- Use **Collapse sidebar** at the bottom of the navigation rail to shrink it to icons.
- Open the **timetable once** so the personal administration page can list your next lessons; the
  events are cached locally in the browser.
- Enable **Boss Fight** only if you want the optional local game layer; see
  [Boss Fight documentation](docs/BOSS-FIGHT.md).

<details>
<summary><strong>Preview Boss Fight</strong></summary>

![UIS+ Boss Fight progress in the sidebar](assets/boss-fight-sidebar.png)

![UIS+ Boss Fight campaign details](assets/boss-fight-arena.png)

</details>

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` | Open the command palette |
| `Ctrl + [` | Collapse or expand the sidebar |
| `↑` `↓` | Move through palette results |
| `Enter` | Open the selected result |
| `Esc` | Close the palette, drawer or mobile menu |

## Privacy and permissions

UIS+ runs entirely in the browser. It stores interface preferences, the UIS menu it discovered on
your personal administration page, and — when Boss Fight is enabled — selected course links and the
last score detected from STU UIS. It does not collect, sell, share or send personal or academic data
to an external service, and it makes no network request of its own.

| Permission | Why it is needed |
|---|---|
| `storage` | Keeps your theme, language, density, sidebar state and cached menu on this device |
| `https://is.stuba.sk/*` | The only site the extension is allowed to touch |

No `tabs`, no host access beyond `is.stuba.sk`, no background worker, no analytics. See the full
[privacy policy](PRIVACY.md).

## How it works

UIS+ is a Manifest V3 content script that runs on `is.stuba.sk`:

| File | Responsibility |
|---|---|
| `styles.css` | Design tokens, native chrome reset and the application shell |
| `components.css` | Restyles the STU markup: breadcrumbs, tabs, tables, folder trees, forms |
| `pages.css` | Layouts for individual applications, such as the timetable grid |
| `content.js` | Builds the topbar, sidebar, breadcrumb bar, command palette and drawer |
| `pages.js` | Parses and rebuilds individual applications from the served markup |
| `boss-fight.js` | The optional local game layer |

Everything rendered comes from the page STU already served to you; nothing is invented and no
request is made on your behalf.

## Compatibility

| Browser | Status |
|---|---|
| Google Chrome (current) | Supported |
| Microsoft Edge (current) | Supported |
| Other Chromium browsers | Expected to work; not officially tested |
| Firefox | Not packaged yet |

## Frequently asked questions

### Is UIS+ an official STU product?

No. UIS+ is an independent open-source project. It is not affiliated with, endorsed by or operated
by the Slovak University of Technology in Bratislava.

### Does UIS+ see my password or my grades?

No. UIS+ never handles credentials and makes no network requests. It only restyles pages that your
browser has already loaded inside your own signed-in session.

### Will it break STU UIS?

UIS+ restyles the existing markup and leaves STU forms, links and server responses untouched. If
anything ever looks wrong, disable the extension in its popup and the original interface returns
immediately.

### Why is my timetable empty on the home page?

The upcoming-lessons card reads a local cache. Open **Rozvrh hodín** once and it fills in.

### Does it work with the old name, AIS?

Yes. `is.stuba.sk` is the same service that used to be called AIS, and this is the same extension
that used to be called AIS+.

### Can I use it on Firefox?

Not yet. The extension targets Chromium's Manifest V3; a Firefox package is not built.

## Search names and compatibility

The following names all refer to the system or this extension's history:

- **STU UIS**, **UIS STU**, **Univerzitný informačný systém STU** — the current name;
- **STU AIS**, **AIS STU**, **Akademický informačný systém STU** — the former name;
- **UIS+** — the current extension name;
- **AIS+** or **AIS Plus** — the former extension name.

The official service remains at `is.stuba.sk`; UIS+ works with that domain.

## Slovenčina

<details open>
<summary><strong>UIS+ — modernejší Univerzitný informačný systém STU (pôvodne AIS+)</strong></summary>

**UIS+** je open-source rozšírenie pre Chrome a Microsoft Edge, ktoré modernizuje
**Univerzitný informačný systém Slovenskej technickej univerzity v Bratislave** na `is.stuba.sk`.
Projekt predtým niesol názov **AIS+** podľa staršieho označenia **Akademický informačný systém
(AIS)**. Ide o priame pokračovanie rovnakého rozšírenia; mení sa názov, nie kompatibilita.

### Čo ponúka

- bočný panel poskladaný z **vášho vlastného menu UIS**, nie z pevne zadaných odkazov;
- **paletu príkazov** (`Ctrl + K`) na rýchly skok do ľubovoľnej aplikácie UIS;
- **prestavaný rozvrh**: zvislá týždenná mriežka, farebne odlíšené prednášky a cvičenia,
  najbližšie hodiny, filtre predmetov a export do `.ics`;
- **poštovú schránku a dokumentový server** v dvoch stĺpcoch so stromom priečinkov;
- svetlú, tmavú a systémovú tému aj kompaktné zobrazenie;
- stabilné rozhranie v slovenčine, češtine alebo angličtine;
- žiadne sledovanie, analytiku ani odosielanie osobných údajov;
- iba lokálne uloženie nastavení a prístup k `is.stuba.sk`.

### Rýchla inštalácia

1. Stiahnite ZIP z [najnovšieho vydania](https://github.com/antehor/UIS-Plus/releases/latest) a rozbaľte ho.
2. V Chrome otvorte `chrome://extensions`; v Edge otvorte `edge://extensions`.
3. Zapnite **Režim pre vývojárov**.
4. Kliknite na **Načítať rozbalené** a vyberte priečinok s `manifest.json`.
5. Otvorte alebo obnovte [is.stuba.sk](https://is.stuba.sk/).

Podrobný návod je v súbore [docs/INSTALLATION.md](docs/INSTALLATION.md).

</details>

## Contributing

Bug fixes, accessibility improvements, translations and support for additional UIS pages are
welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md). There is no build step; reload the unpacked
extension to test changes.

## Author

Created and maintained by **Yehor Halytskyi**.

- GitHub: [@antehor](https://github.com/antehor)
- LinkedIn: [Yehor Halytskyi](https://www.linkedin.com/in/yehor-halytskyi-392b92427/)

## License and status

UIS+ is available under the [MIT License](LICENSE).

UIS+ is an independent community project and is not an official product of the Slovak University
of Technology in Bratislava. STU, UIS, AIS and related names belong to their respective owners.

<div align="center">
  <strong>UIS+</strong><br>
  <em>Modern STU UIS. The extension formerly known as AIS+.</em>
</div>
