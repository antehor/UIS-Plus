(function () {
  "use strict";
  const defaults = { enabled: true, theme: "system", compact: false };
  const enabled = document.querySelector("#enabled");
  const compact = document.querySelector("#compact");
  const themes = [...document.querySelectorAll('input[name="theme"]')];

  chrome.storage.local.get(defaults, (settings) => {
    enabled.checked = Boolean(settings.enabled);
    compact.checked = Boolean(settings.compact);
    (themes.find((input) => input.value === settings.theme) || themes[0]).checked = true;
  });

  enabled.addEventListener("change", () => chrome.storage.local.set({ enabled: enabled.checked }));
  compact.addEventListener("change", () => chrome.storage.local.set({ compact: compact.checked }));
  themes.forEach((input) => input.addEventListener("change", () => {
    if (input.checked) chrome.storage.local.set({ theme: input.value });
  }));
})();
