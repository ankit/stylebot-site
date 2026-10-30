export type ThemeKey = 'light' | 'newsprint' | 'dark' | 'late-edition';

type Theme = Record<string, string>;

const geist = "'Geist',system-ui,sans-serif";
const geistMono = "'Geist Mono',ui-monospace,monospace";

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
    'bg-badge': '#e3e6eb',
    border: '#e6e8ec',
    'border-strong': '#d3d6dd',
    fg: '#191b1f',
    'fg-secondary': '#3f4550',
    'fg-muted': '#5f6672',
    'fg-subtle': '#8b919c',
    accent: '#3660ba',
    'accent-bg': '#f2f6fe',
    'accent-border': '#dfe8fc',
    success: '#1f7a45',
    'success-bg': '#e3f4ea',
    danger: '#b42335',
    'danger-bg': '#fbe9eb',
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
    'bg-badge': '#d9d4c4',
    border: '#dcd7c8',
    'border-strong': '#c7c0ac',
    fg: '#161512',
    'fg-secondary': '#33312b',
    'fg-muted': '#5d5a50',
    'fg-subtle': '#8d897c',
    accent: '#0f7391',
    'accent-bg': '#e3f0f3',
    'accent-border': '#bfdde5',
    success: '#2d6a3e',
    'success-bg': '#dfeedd',
    danger: '#9b2c2c',
    'danger-bg': '#f6e2dc',
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
    'bg-badge': '#2a2d33',
    border: '#2c2f35',
    'border-strong': '#3a3f47',
    fg: '#e8eaee',
    'fg-secondary': '#c9ced6',
    'fg-muted': '#a3aab6',
    'fg-subtle': '#7d8593',
    accent: '#8fa8e6',
    'accent-bg': '#1f2330',
    'accent-border': '#2b3140',
    success: '#5fcf8a',
    'success-bg': '#1b2e24',
    danger: '#f07a86',
    'danger-bg': '#3a1d22',
    'code-selector': '#f4a3bf',
    'code-brace': '#8b919c',
    'code-property': '#93d3e6',
    'code-value': '#f0d38a',
    'code-number': '#f0d38a',
    'code-comment': '#7d8593',
  },
  'late-edition': {
    'font-ui': geist,
    'font-display': "'Literata',Georgia,serif",
    'font-mono': geistMono,
    link: '#7db6c4',
    'bg-surface': '#17181b',
    'bg-page': '#0f1012',
    'bg-muted': '#1b1c20',
    'bg-hover': '#212226',
    'bg-track': '#27282d',
    'bg-badge': '#27282d',
    border: '#25262b',
    'border-strong': '#34363c',
    fg: '#d3d7de',
    'fg-secondary': '#c0c5ce',
    'fg-muted': '#9da1a8',
    'fg-subtle': '#787c84',
    accent: '#7db6c4',
    'accent-bg': '#172427',
    'accent-border': '#2a3e42',
    success: '#8ccb99',
    'success-bg': '#1a251e',
    danger: '#ec9a92',
    'danger-bg': '#32201f',
    'code-selector': '#e0a3b5',
    'code-brace': '#787c84',
    'code-property': '#8fc0cb',
    'code-value': '#d9c18c',
    'code-number': '#d9c18c',
    'code-comment': '#787c84',
  },
};

export const THEME_KEYS = Object.keys(THEMES) as Array<ThemeKey>;

export const DARK_THEMES: Array<ThemeKey> = ['dark', 'late-edition'];

export const STORAGE_KEY = 'stylebot-site-theme';

/** The domain whose subdomains share the saved theme cookie. */
export const COOKIE_DOMAIN = 'stylebot.dev';

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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
