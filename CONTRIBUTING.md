# Contributing to UIS+

Thank you for improving UIS+ (formerly AIS+). Bug fixes, accessibility improvements, translations
and support for additional STU UIS pages are welcome.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Project layout

| File | Responsibility |
|---|---|
| `styles.css` | Design tokens, native chrome reset and the application shell |
| `components.css` | Restyles the STU markup: breadcrumbs, tabs, tables, folder trees, forms |
| `pages.css` | Layouts for individual applications, such as the timetable grid |
| `content.js` | Builds the topbar, sidebar, breadcrumb bar, command palette and drawer |
| `pages.js` | Parses and rebuilds individual applications from the served markup |
| `boss-fight.js` | The optional local game layer |

Anything added to `manifest.json` must also be added to `scripts/check.ps1`,
`scripts/package.ps1` and the release workflow, otherwise the published archive will be incomplete.

## Local workflow

1. Fork the repository and create a focused branch.
2. Clone your fork.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable developer mode and load the repository directory as an unpacked extension.
5. Change the source, press **Reload** on the extension card and refresh `is.stuba.sk`.
6. Run `powershell -ExecutionPolicy Bypass -File scripts/check.ps1` before committing.

There is no dependency installation or build step.

## Pull requests

- Keep changes focused and explain the user-facing result.
- Test both light and dark themes when changing styles.
- Test the expanded, collapsed and mobile sidebar when changing navigation.
- Do not commit credentials, session data, student identifiers or screenshots with personal data.
- Keep all existing STU forms and links functional.
- Render values from pages STU serves; never invent data. Reading an `is.stuba.sk` page in the
  background is fine when a feature needs it (assignments, Boss Fight), but never submit a form,
  change anything in UIS or contact another host.

By contributing, you agree that your contribution is licensed under the MIT License.
