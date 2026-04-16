export const COLOR_THEMES = [
  { bg: "#28272c", fg: "#cfcfcf" },
  { bg: "#0f0f23", fg: "#00ff41" },
  { bg: "#1a1a2e", fg: "#eab308" },
  { bg: "#d9d3c3", fg: "#268bd2" },
  { bg: "#2d2a32", fg: "#ff6b6b" },
  { bg: "#0d1117", fg: "#58a6ff" },
  { bg: "#282a36", fg: "#ff79c6" },
  { bg: "#1e1e2e", fg: "#cba6f7" },
  { bg: "#faf4ed", fg: "#d7827e" },
  { bg: "#161616", fg: "#ff7eb6" },
  { bg: "#2b2d42", fg: "#8d99ae" },
  { bg: "#0a0a0a", fg: "#ffffff" },
  { bg: "#1b1b1e", fg: "#f9a825" },
  { bg: "#0c0c0c", fg: "#39ff14" },
  { bg: "#1a1b26", fg: "#7aa2f7" },
];

export function getCurrentThemeIndex() {
  if (typeof document === "undefined") return 0;
  const raw = document.documentElement.dataset.themeIndex;
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function applyThemeIndex(index: number) {
  if (typeof document === "undefined") return;
  const normalized = ((index % COLOR_THEMES.length) + COLOR_THEMES.length) % COLOR_THEMES.length;
  const theme = COLOR_THEMES[normalized];
  if (!theme) return;
  document.documentElement.style.setProperty("--bg", theme.bg);
  document.documentElement.style.setProperty("--fg", theme.fg);
  document.documentElement.dataset.themeIndex = String(normalized);
}

export function cycleTheme() {
  const next = (getCurrentThemeIndex() + 1) % COLOR_THEMES.length;
  applyThemeIndex(next);
  return next;
}
