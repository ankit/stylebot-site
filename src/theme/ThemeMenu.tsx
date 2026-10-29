import { useEffect, useState } from 'preact/hooks';

import ContrastIcon from '@/components/icons/ContrastIcon';
import Menu from '@/components/Menu';
import Tooltip from '@/components/Tooltip';

import { type Catalog, translator } from '@/i18n/t';

import { applyTheme, currentTheme } from './state';
import { THEME_KEYS, type ThemeKey, THEMES } from './themes';

import './ThemeMenu.css';

export default function ThemeMenu({ strings }: { strings: Catalog }) {
  const t = translator(strings);
  const names: Record<ThemeKey, string> = {
    light: t('Light'),
    newsprint: t('Newsprint'),
    dark: t('Dark'),
    'late-edition': t('Late Edition'),
  };
  const [theme, setTheme] = useState<ThemeKey>('light');

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const pick = (key: ThemeKey) => {
    applyTheme(key);
    setTheme(key);
  };

  const label = t('Theme: {theme}', { theme: names[theme] });

  return (
    <Menu
      buttonClass="icon-btn"
      label={label}
      listClass="theme-menu-list"
      button={
        <>
          <ContrastIcon />
          <Tooltip>{t('Theme')}</Tooltip>
        </>
      }
    >
      {THEME_KEYS.map((key) => {
        const colors = THEMES[key];
        const on = key === theme;

        return (
          <button
            key={key}
            role="menuitemradio"
            aria-checked={on}
            class={`menu-item theme-option${on ? ' is-on' : ''}`}
            onClick={() => pick(key)}
          >
            <span
              class="theme-dot"
              style={{
                background: `linear-gradient(135deg,${colors['bg-surface']} 0 50%,${colors.accent} 50% 100%)`,
                boxShadow: `inset 0 0 0 1px ${colors['border-strong']}`,
              }}
            />
            <span class="theme-name" style={{ fontFamily: colors['font-ui'] }}>
              {names[key]}
            </span>
            <span class="theme-check">✓</span>
          </button>
        );
      })}
    </Menu>
  );
}
