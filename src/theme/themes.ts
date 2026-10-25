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
    border: '#e6e8ec',
    'border-strong': '#d3d6dd',
    fg: '#191b1f',
    'fg-secondary': '#3f4550',
    'fg-muted': '#5f6672',
    'fg-subtle': '#8b919c',
    accent: '#2563eb',
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
    border: '#2c2f35',
    'border-strong': '#3a3f47',
    fg: '#e8eaee',
    'fg-secondary': '#c9ced6',
    'fg-muted': '#a3aab6',
    'fg-subtle': '#7d8593',
    accent: '#5b8cf5',
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
    'font-display': "'Newsreader',Georgia,serif",
    'font-mono': geistMono,
    link: '#8e9cc4',
    'bg-surface': '#1f2027',
    'bg-page': '#17181c',
    'bg-muted': '#23242b',
    'bg-hover': '#292a31',
    'bg-track': '#2e3037',
    border: '#2c2d33',
    'border-strong': '#3a3c43',
    fg: '#d5d7d6',
    'fg-secondary': '#c8cac9',
    'fg-muted': '#babcbc',
    'fg-subtle': '#8a8d92',
    accent: '#8e9cc4',
    'accent-bg': '#22263a',
    'accent-border': '#343b55',
    success: '#7fd49c',
    'success-bg': '#1e2c26',
    danger: '#f39aa3',
    'danger-bg': '#3a2025',
    'code-selector': '#e0a0b4',
    'code-brace': '#8a8d92',
    'code-property': '#9db4e0',
    'code-value': '#d8c48e',
    'code-number': '#d8c48e',
    'code-comment': '#8a8d92',
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
