# Changelog

All notable changes to UIS+ (formerly AIS+) are documented here.

## 3.0.1 — 2026-10-15

### Added

- **Assignments due.** "Úlohy" on the home page now also counts the open submission places from
  the student portal ("Miesta odovzdania", current period) whose deadline has not passed, and a
  rail card lists them with the time left; deadlines within two days are highlighted. The page is
  read at most every ten minutes, and opening it directly refreshes the list.

### Fixed

- **Unread mail.** STU marks an unread message only by bolding its subject, which got lost once
  subjects shared one colour. Unread rows now carry an accent bar, a bold sender and an
  accent-coloured subject; read rows use the regular text colour.

- **Sign-in page.** STU serves the login form at `/auth/`, the same address as the personal
  administration home, so UIS+ painted the dashboard (greeting, counters, upcoming lessons) over
  the password field. The login screen is now detected from the form itself and gets a focused
  sign-in card: labelled fields, password-manager hints, a show/hide password toggle, and the
  language picker. The sidebar, search, counters and Boss Fight stay off until you sign in.
- **STU mark** in the topbar is drawn as the 4 × 3 grid of round dots, not squares.
- **Sidebar labels** wrap onto a second line instead of being cut off with an ellipsis.
- **Boss Fight** state is no longer lost when the sidebar is drawn before storage has loaded.
- **Boss Fight phantom subjects.** Assessment sub-pages of `list.pl` carry `predmet=` links
  without a subject name and were scanned as if they were the subject list, adding entries named
  "Predmet". Only links that carry a subject code are accepted now, a rescan replaces that
  semester's list instead of only adding to it, and phantom entries saved earlier are removed.
- **English interface:** the user chip and greeting no longer show "Logged in: …" / "Logged!",
  the server date is parsed instead of shown raw with the name-day, and sidebar entries resolve
  against the English (and Czech) UIS menu names. Cached menu wording is only reused in the
  language it was read in.
- **Link colours.** The base link rule out-ranked every exception, so tabs, breadcrumbs, folder
  trees and notices were all painted in the accent colour. Tab labels are back to 13.5 px (STU
  forces .8em).

### Changed

- **Boss Fight** is redesigned to match the rest of UIS+: readable type sizes, light and dark
  theme support, line icons instead of emoji, the STU grading scale (A–FX) and Slovak, Czech and
  English text. Sidebar cards show the subject name first and never truncate it.
- **Module board** on the home page is a single "Applications" directory: sections flow in
  columns with a heading rule and a plain list of links instead of a grid of boxed tiles, long
  section names are no longer clipped, and the multicolour STU glyphs are replaced with the
  sidebar's line icons.
- **Dark theme** retuned for readability: brighter text tones, a softer link colour, darker
  button fills so white labels keep their contrast, links inside notices keep the notice's text
  colour, and links in data tables use the body text colour.
- **Sidebar:** "Research" is no longer a top-level entry, and the collapse button and status line
  stay pinned to the bottom while only the navigation scrolls.

## 3.0.0 — 2026-09-16

A full redesign of the interface, plus rebuilt layouts for the applications students open most.

### Added

- **Command palette** (`Ctrl + K`) that searches every UIS application discovered in your own menu,
  the UIS+ sections and the links on the current page.
- **Rebuilt timetable.** The native day-per-row table is parsed and re-rendered as a vertical week
  grid with day columns, the current day highlighted, colour-coded lectures and seminars, room and
  teacher lines, an upcoming-lessons list, per-course filters and a locally generated `.ics` export.
- **Two-column mailbox and document server**, with the folder tree, mailbox quota and legend beside
  a full-width listing.
- **Message view rail** showing the sender, message details and attachments.
- **Personal administration home** with a greeting header, notice cards grouped by severity, a
  responsive module grid and your next lessons in the side rail.
- **Sidebar collapse button**, alongside the existing `Ctrl + [` shortcut.
- Keyboard shortcuts for the palette: `↑` `↓` to move, `Enter` to open, `Esc` to close.

### Changed

- The sidebar is now built from the live UIS menu harvested on the personal administration page and
  cached locally, so no student-specific URL is hard-coded.
- Navigation links carry the language you are reading, so moving between applications no longer
  falls back to the server default.
- Sidebar entries never resolve to the same destination twice; when a section's first application
  already has its own entry, the label follows the application it actually opens.
- The breadcrumb bar now carries the server date and an inline language switcher.
- Each page gains a header block with an icon, the title and the description STU publishes for that
  application.
- The panel language defaults to **Auto** and follows the language of the page.
- Stylesheets were split into `styles.css` (tokens and shell), `components.css` (native UIS
  components) and `pages.css` (per-application layouts); page logic moved into `pages.js`.
- The extension popup was restyled to match the in-page design system.

### Fixed

- Headings no longer inherit the native bullet image, grey bar and 25px indent from STU.
- Data tables are detected by the rows they own rather than at any depth, so the outer layout table
  of an application is no longer restyled as a grid — this had broken the mailbox layout.
- Native alternating row colours, link colours and heading backgrounds no longer leak into the dark
  theme; the STU glyph sprite is re-toned so its near-black outline stays visible.
- Icons without an explicit size rule no longer stretch to the width of their container.
- Notice text on the personal administration page is no longer hidden along with its list marker.
- The module grid on the personal administration page is flattened out of its draggable, absolutely
  positioned container into a responsive card grid.
- Icon grids on the student portal are no longer collapsed into a single column by the narrow
  layout table around them.
- Long folder names in the document server wrap instead of being clipped.

### Upgrading from 2.x

- Extract the archive over the existing extension folder, press **Reload** on the extension card in
  `chrome://extensions` or `edge://extensions`, then refresh `is.stuba.sk`.
- Your theme, language, density, sidebar state and Boss Fight data are preserved — the storage keys
  are unchanged.
- Open **Rozvrh hodín** once so the personal administration page can list your next lessons; the
  timetable is cached locally in the browser.

## 2.3.0 — 2026-09-04

### Changed

- Renamed the extension from **AIS+** to **UIS+** after STU adopted the name
  **Univerzitný informačný systém (UIS)**.
- Updated the extension manifest, popup, sidebar, notification drawer and optional Boss Fight UI
  to use the UIS+ brand.
- Updated English, Slovak and Czech system labels from “Academic Information System” to
  “University Information System”.
- Renamed release archives and packaged directories from `AIS-plus` to `UIS-plus`.

### Documentation and discoverability

- Rebuilt the README around the current **STU UIS** name while preserving explicit references to
  **STU AIS**, **Akademický informačný systém**, **AIS+** and **AIS Plus** for existing users and
  search compatibility.
- Added a migration section explaining that UIS+ is the direct continuation of AIS+ and keeps the
  existing browser settings.
- Updated installation, privacy, security, contribution and Boss Fight documentation.
- Corrected all repository, issue, badge, release and clone URLs to `antehor/UIS-Plus`.
- Updated GitHub Actions validation and release packaging for UIS+ 2.3.0.

### Compatibility

- Kept the existing storage keys and `is.stuba.sk` host permission, so an in-place update from
  AIS+ preserves interface preferences and local Boss Fight data.

## 2.2.0 — Experimental, local only

- Moved selected bosses and their live progress directly into the AIS+ sidebar.
- Added one-click subject addition and removal from the sidebar campaign.
- Added automatic SÚČET updates on page load, tab focus and after adding a boss.
- Kept the small sidebar refresh control as an optional fallback instead of the primary workflow.
- Restyled the Boss Fight details window with the same surfaces, controls, spacing and light/dark themes as AIS+.
- Preserved the last valid score if STU AIS is temporarily unavailable during a background update.

## 2.1.0 — Experimental, local only

- Added an optional English-language **Boss Fight** fun mode.
- Added a sidebar switch and a separate responsive arena.
- Added subject selection across cached STU AIS semesters.
- Connected battle damage to the `SÚČET` value on continuous-assessment pages.
- Added the A–FX rank system with a 56-point victory threshold.
- Added automatic ECTS lookup and official subject information links through the STU course catalogue.
- Kept all Boss Fight preferences, cached subjects and scores in local browser storage.

## 2.0.1 — 2026-08-27

- Added the English, Slovak and Czech panel-language selector to the extension popup.
- Improved public-facing popup copy for Chrome and Edge users.

## 2.0.0 — 2026-08-27

- Renamed the project to AIS+.
- Restored strong sidebar contrast in the light theme.
- Added a persistent English, Slovak and Czech language selector.
- Added a polished collapsible sidebar and responsive mobile navigation.
- Added working multi-step navigation for student tools.
- Removed hard-coded student identifiers; personal destinations are resolved from signed-in STU pages.
- Added light, dark, system and compact display modes.
- Added public documentation, privacy information, contribution guidance and MIT licensing.
