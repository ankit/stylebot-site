import { useEffect, useState } from 'preact/hooks';

import ContrastIcon from '@/components/icons/ContrastIcon';
import { fmt } from '@/i18n/format';
import { track } from '@/lib/analytics';
import { currentTheme } from '@/lib/theme-state';
import { STORAGE_KEY, THEME_KEYS, type ThemeKey, THEMES } from '@/lib/themes';

type Labels = { title: string; names: Record<ThemeKey, string> };

export default function ThemeMenu({ labels }: { labels: Labels }) {
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
    document.documentElement.dataset.theme = key;

    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies.
    }

    window.dispatchEvent(new CustomEvent('themechange', { detail: key }));
    track('Site theme', { theme: key });
    setTheme(key);
    setOpen(false);
  };

  const title = fmt(labels.title, { theme: labels.names[theme] });

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
        <span class="tip">{title}</span>
      </button>
      {open && (
        <>
          <div class="theme-menu-scrim" onClick={() => setOpen(false)} />
          <div class="theme-menu-list" role="menu">
            {THEME_KEYS.map((key) => {
              const t = THEMES[key];
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
                      background: `linear-gradient(135deg,${t.surface} 0 50%,${t.acc} 50% 100%)`,
                      boxShadow: `inset 0 0 0 1px ${t.strong}`,
                    }}
                  />
                  <span class="theme-name" style={{ fontFamily: t.ui }}>
                    {labels.names[key]}
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
