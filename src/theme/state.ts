import { STORAGE_KEY, type ThemeKey, THEMES } from './themes';

/**
 * The theme currently applied to <html>, set before first paint by the
 * inline script in the base layout.
 */
export function currentTheme(): ThemeKey {
  const key = document.documentElement.dataset.theme;

  return key && key in THEMES ? (key as ThemeKey) : 'light';
}

/**
 * Applies a theme to <html>, saves it for later visits and announces it with
 * a `themechange` event for the islands that follow the theme.
 */
export function applyTheme(key: ThemeKey) {
  document.documentElement.dataset.theme = key;

  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // Storage can be unavailable (private mode); the theme still applies.
  }

  window.dispatchEvent(new CustomEvent('themechange', { detail: key }));
}
