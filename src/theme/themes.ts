export type ThemeKey = 'light' | 'newsprint' | 'dark' | 'monospace';

type Theme = Record<string, string>;

const geist = "'Geist',system-ui,sans-serif";
const geistMono = "'Geist Mono',ui-monospace,monospace";
const firaCode = "'Fira Code',ui-monospace,monospace";

const lightCode = {
  'code-selector': '#b8406c',
  'code-brace': '#8b919c',
  'code-property': '#2a7f99',
  'code-value': '#9a6a1f',
  'code-number': '#9a6a1f',
  'code-comment': '#8b919c',
};

export const THEMES: Record<ThemeKey, Theme> = {
  light: {
    'font-ui': geist,
    'font-display': geist,
    'font-mono': geistMono,
    'bg-surface': '#ffffff',
    'bg-page': '#f7f8fa',
    'bg-muted': '#f5f6f8',
    'bg-hover': '#f2f3f6',
    'bg-track': '#eceef2',
    border: '#e6e8ec',
    'border-strong': '#d3d6dd',
    fg: '#191b1f',
    'fg-secondary': '#3f4550',
    'fg-muted': '#5f6672',
    'fg-subtle': '#8b919c',
    accent: '#2563eb',
    'accent-bg': '#f2f6fe',
    'accent-border': '#dfe8fc',
    ...lightCode,
  },
  newsprint: {
    'font-ui': geist,
    'font-display': "'Newsreader',Georgia,serif",
    'font-mono': geistMono,
    'bg-surface': '#fbfaf6',
    'bg-page': '#f1efe8',
    'bg-muted': '#ebe8de',
    'bg-hover': '#e6e2d6',
    'bg-track': '#e1ddcf',
    border: '#dcd7c8',
    'border-strong': '#c7c0ac',
    fg: '#161512',
    'fg-secondary': '#33312b',
    'fg-muted': '#5d5a50',
    'fg-subtle': '#8d897c',
    accent: '#0f7391',
    'accent-bg': '#e3f0f3',
    'accent-border': '#bfdde5',
    ...lightCode,
  },
  dark: {
    'font-ui': geist,
    'font-display': geist,
    'font-mono': geistMono,
    'bg-surface': '#1c1e22',
    'bg-page': '#15171a',
    'bg-muted': '#212429',
    'bg-hover': '#26292e',
    'bg-track': '#2a2d33',
    border: '#2c2f35',
    'border-strong': '#3a3f47',
    fg: '#e8eaee',
    'fg-secondary': '#c9ced6',
    'fg-muted': '#a3aab6',
    'fg-subtle': '#7d8593',
    accent: '#5b8cf5',
    'accent-bg': '#1f2330',
    'accent-border': '#2b3140',
    'code-selector': '#f4a3bf',
    'code-brace': '#8b919c',
    'code-property': '#93d3e6',
    'code-value': '#f0d38a',
    'code-number': '#f0d38a',
    'code-comment': '#7d8593',
  },
  monospace: {
    'font-ui': firaCode,
    'font-display': firaCode,
    'font-mono': firaCode,
    'text-card-title': 'var(--text-sm)',
    'bg-surface': '#1e1e2e',
    'bg-page': '#181825',
    'bg-muted': '#232334',
    'bg-hover': '#2a2b3c',
    'bg-track': '#313244',
    border: '#313244',
    'border-strong': '#45475a',
    fg: '#cdd6f4',
    'fg-secondary': '#bac2de',
    'fg-muted': '#a6adc8',
    'fg-subtle': '#7f849c',
    accent: '#cba6f7',
    'accent-bg': '#2b2840',
    'accent-border': '#45395f',
    'code-selector': '#f38ba8',
    'code-brace': '#9399b2',
    'code-property': '#89b4fa',
    'code-value': '#a6e3a1',
    'code-number': '#fab387',
    'code-comment': '#7f849c',
  },
};

export const THEME_KEYS = Object.keys(THEMES) as Array<ThemeKey>;

export const DARK_THEMES: Array<ThemeKey> = ['dark', 'monospace'];

export const STORAGE_KEY = 'stylebot-site-theme';

/**
 * Whether a theme has a dark page, which also switches the product mocks
 * to the dark editor palette.
 */
export function isDarkTheme(key: string): boolean {
  return DARK_THEMES.includes(key as ThemeKey);
}

function vars(theme: Theme): string {
  return Object.entries(theme)
    .map(([name, value]) => `--${name}:${value}`)
    .join(';');
}

/**
 * Builds the stylesheet that maps each `data-theme` on <html> to its tokens.
 * Product mocks (`[data-ed]`) always use the light or dark editor palette.
 */
export function themeStylesheet(): string {
  const dark = (scope = '') =>
    DARK_THEMES.map((key) => `:root[data-theme="${key}"]${scope}`).join(',');
  const rules = [
    `:root{${vars(THEMES.light)}}`,
    ...THEME_KEYS.map(
      (key) => `:root[data-theme="${key}"]{${vars(THEMES[key])}}`,
    ),
    `${dark()}{color-scheme:dark}`,
    `[data-ed]{${vars(THEMES.light)}}`,
    `${dark(' [data-ed]')}{${vars(THEMES.dark)}}`,
  ];

  return rules.join('\n');
}
