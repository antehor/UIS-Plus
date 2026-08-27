# Contributing to AIS+

Thank you for improving AIS+. Bug fixes, accessibility improvements, translations and support for
additional STU AIS pages are welcome.

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

By contributing, you agree that your contribution is licensed under the MIT License.
