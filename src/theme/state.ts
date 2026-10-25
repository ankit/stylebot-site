import {
  COOKIE_DOMAIN,
  COOKIE_MAX_AGE,
  STORAGE_KEY,
  type ThemeKey,
  THEMES,
} from './themes';

/**
 * The theme currently applied to <html>, set before first paint by the
 * inline script in the base layout.
 */
export function currentTheme(): ThemeKey {
  const key = document.documentElement.dataset.theme;

  return key && key in THEMES ? (key as ThemeKey) : 'light';
}

/** Saves a theme in a cookie on stylebot.dev, so the gallery shares it. */
function saveTheme(key: ThemeKey) {
  const { hostname } = location;
  let cookie = `${STORAGE_KEY}=${key}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;

  if (hostname === COOKIE_DOMAIN || hostname.endsWith(`.${COOKIE_DOMAIN}`)) {
    cookie += `; domain=${COOKIE_DOMAIN}`;
  }

  document.cookie = cookie;
}

/**
 * Applies a theme to <html>, saves it for later visits and announces it with
 * a `themechange` event for the islands that follow the theme.
 */
export function applyTheme(key: ThemeKey) {
  document.documentElement.dataset.theme = key;
  saveTheme(key);

  window.dispatchEvent(new CustomEvent('themechange', { detail: key }));
}
