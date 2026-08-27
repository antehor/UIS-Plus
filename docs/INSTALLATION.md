# Installing AIS+

AIS+ is a Manifest V3 browser extension. It does not need Node.js, a package manager or a build command.

## Chrome

1. Open the [latest AIS+ release](https://github.com/antehor/AIS-Plus/releases/latest).
2. Download the ZIP asset and extract it to a permanent directory.
3. Open `chrome://extensions` in the address bar.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the extracted directory containing `manifest.json`.
7. Open or reload `https://is.stuba.sk/`.

## Edge

1. Download and extract the latest release.
2. Open `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the directory containing `manifest.json`.
5. Open or reload `https://is.stuba.sk/`.

## Aktualizácia / Updating

Replace the extension files with the newer release, press **Reload** on the AIS+ extension card and
refresh the STU AIS tab.

Novšiu verziu rozbaľte do rovnakého priečinka, na stránke rozšírení kliknite pri AIS+ na **Obnoviť**
a potom obnovte kartu STU AIS.

## Common checks

- If the redesign is not visible, confirm that AIS+ is enabled in its popup and refresh the page.
- If the browser says that `manifest.json` is missing, select the inner directory that directly contains it.
- Keep the extracted directory in place; moving or deleting it disables an unpacked extension.
