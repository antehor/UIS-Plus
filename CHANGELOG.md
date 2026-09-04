# Changelog

All notable changes to UIS+ (formerly AIS+) are documented here.

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
