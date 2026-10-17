import { useEffect, useState } from 'preact/hooks';

import ContrastIcon from '@/components/icons/ContrastIcon';

import { track } from '@/lib/analytics';

import { type Catalog, translator } from '@/i18n/t';

import { applyTheme, currentTheme } from './state';
import { THEME_KEYS, type ThemeKey, THEMES } from './themes';

import './theme-menu.css';

export default function ThemeMenu({ strings }: { strings: Catalog }) {
  const t = translator(strings);
  const names: Record<ThemeKey, string> = {
    light: t('Light'),
    dark: t('Dark'),
    stylebot: t('Stylebot'),
    newsprint: t('Newsprint'),
  };
  const [theme, setTheme] = useState<ThemeKey>('light');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pick = (key: ThemeKey) => {
    applyTheme(key);
    track('Site theme', { theme: key });
    setTheme(key);
    setOpen(false);
  };

  const title = t('Theme: {theme}', { theme: names[theme] });

  return (
    <div class="theme-menu">
      <button
        class={`icon-btn${open ? ' is-open' : ''}`}
        aria-label={title}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ContrastIcon />
        <span class="tooltip">{title}</span>
      </button>
      {open && (
        <>
          <div class="theme-menu-scrim" onClick={() => setOpen(false)} />
          <div class="theme-menu-list" role="menu">
            {THEME_KEYS.map((key) => {
              const colors = THEMES[key];
              const on = key === theme;

              return (
                <button
                  key={key}
                  role="menuitemradio"
                  aria-checked={on}
                  class={`theme-option${on ? ' is-on' : ''}`}
                  onClick={() => pick(key)}
                >
                  <span
                    class="theme-dot"
                    style={{
                      background: `linear-gradient(135deg,${colors['bg-surface']} 0 50%,${colors.accent} 50% 100%)`,
                      boxShadow: `inset 0 0 0 1px ${colors['border-strong']}`,
                    }}
                  />
                  <span
                    class="theme-name"
                    style={{ fontFamily: colors['font-ui'] }}
                  >
                    {names[key]}
                  </span>
                  <span class="theme-check">✓</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
