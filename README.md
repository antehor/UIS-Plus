<div align="center">
  <img src="icons/icon-512.png" width="112" alt="UIS+ browser extension logo">
  <h1>UIS+</h1>
  <p><strong>A better way to use STU UIS — formerly STU AIS.</strong></p>
  <p>A modern, fast and private browser interface for the University Information System<br>of the Slovak University of Technology in Bratislava.</p>

  <p>
    <a href="https://github.com/antehor/UIS-Plus/releases/latest"><strong>Download UIS+</strong></a>
    ·
    <a href="#installation">Installation</a>
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
[Slovak University of Technology in Bratislava (STU)](https://www.stuba.sk/). It keeps the real
STU pages, forms, sessions and data while adding clearer navigation, responsive layouts, light and
dark themes, a compact mode, and faster access to everyday study tools.

![UIS+ light theme for the STU University Information System (formerly AIS+)](assets/uis-plus-light.png)

## Why UIS+

| Standard STU UIS workflow | With UIS+ |
|---|---|
| Important student tools are spread across several menus | A persistent sidebar opens the relevant STU section |
| Dense pages are difficult to scan on large screens | Readable tables, balanced spacing and responsive content |
| One fixed visual style | Light, dark and system themes |
| Navigation language can change between pages | Stable English, Slovak or Czech extension controls |
| Frequent pages take several clicks | Personal destinations are resolved from the signed-in UIS session |

## Features

- **Student navigation** for My studies, Timetable, Exams, Grades, Credits, Courses, Documents,
  Messages, Announcements and Settings.
- **Collapsible responsive sidebar** that remembers its state and becomes a mobile drawer.
- **English, Slovak and Czech** interface controls independent of the current page language.
- **Light, dark and system themes**, plus an optional compact density.
- **Real STU UIS functionality remains intact:** UIS+ restyles the existing pages instead of
  replacing STU forms, links, sessions or server responses.
- **Dynamic personal links:** timetable and study-plan URLs are discovered from authenticated UIS
  pages, so student identifiers are never hard-coded or published.
- **Private by design:** no analytics, advertising, external API, account access or data transfer.
- **Minimal permissions:** Manifest V3, local `storage`, and access only to `https://is.stuba.sk/*`.
- **Optional Boss Fight mode:** turn course assessment progress into a private, local game layer.

<details>
<summary><strong>Show the dark theme</strong></summary>

![UIS+ dark mode for is.stuba.sk, previously known as STU AIS](assets/uis-plus-dark.png)

</details>

## Installation

### Google Chrome

1. Download [`UIS-plus-v2.3.0.zip`](https://github.com/antehor/UIS-Plus/releases/latest) from the
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

- Click the **UIS+ extension icon** to enable or disable the redesign and choose a theme or density.
- Use the **globe button** in the top bar to switch between `EN`, `SK` and `CZ`.
- Use the **panel button** beside the UIS+ logo to collapse or expand the sidebar.
- Personal destinations are resolved from links in the signed-in STU UIS session.
- Enable **Boss Fight** only if you want the optional local game layer; see
  [Boss Fight documentation](docs/BOSS-FIGHT.md).

<details>
<summary><strong>Preview Boss Fight</strong></summary>

![UIS+ Boss Fight progress in the sidebar](assets/boss-fight-sidebar.png)

![UIS+ Boss Fight campaign details](assets/boss-fight-arena.png)

</details>

## Privacy and permissions

UIS+ runs entirely in the browser. It stores interface preferences and, when Boss Fight is enabled,
selected course links and the last score detected from STU UIS. It does not collect, sell, share or
send personal or academic data to an external service. See the full [privacy policy](PRIVACY.md).

## Compatibility

| Browser | Status |
|---|---|
| Google Chrome (current) | Supported |
| Microsoft Edge (current) | Supported |
| Other Chromium browsers | Expected to work; not officially tested |
| Firefox | Not packaged yet |

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

- funkčný bočný panel pre **Moje štúdium, Rozvrh, Skúšky, Hodnotenie, Kredity, Predmety,
  Dokumenty, Správy, Oznamy a Nastavenia**;
- zbaliteľný panel s uloženým stavom a responzívnym mobilným zobrazením;
- stabilné rozhranie v angličtine, slovenčine alebo češtine;
- svetlú, tmavú a systémovú tému aj kompaktné zobrazenie;
- automatické vyhľadanie osobných odkazov v prihlásenom STU UIS;
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
