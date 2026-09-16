(function () {
  "use strict";
  const defaults = { enabled: true, theme: "system", compact: false, uiLanguage: "auto", bossFightEnabled: false };
  const enabled = document.querySelector("#enabled");
  const compact = document.querySelector("#compact");
  const bossFightEnabled = document.querySelector("#bossFightEnabled");
  const themes = [...document.querySelectorAll('input[name="theme"]')];
  const languages = [...document.querySelectorAll('input[name="language"]')];

  chrome.storage.local.get(defaults, (settings) => {
    enabled.checked = Boolean(settings.enabled);
    compact.checked = Boolean(settings.compact);
    bossFightEnabled.checked = Boolean(settings.bossFightEnabled);
    (themes.find((input) => input.value === settings.theme) || themes[0]).checked = true;
    (languages.find((input) => input.value === settings.uiLanguage) || languages[0]).checked = true;
  });

  enabled.addEventListener("change", () => chrome.storage.local.set({ enabled: enabled.checked }));
  compact.addEventListener("change", () => chrome.storage.local.set({ compact: compact.checked }));
  bossFightEnabled.addEventListener("change", () => chrome.storage.local.set({ bossFightEnabled: bossFightEnabled.checked }));
  themes.forEach((input) => input.addEventListener("change", () => {
    if (input.checked) chrome.storage.local.set({ theme: input.value });
  }));
  languages.forEach((input) => input.addEventListener("change", () => {
    if (input.checked) chrome.storage.local.set({ uiLanguage: input.value });
  }));
})();
