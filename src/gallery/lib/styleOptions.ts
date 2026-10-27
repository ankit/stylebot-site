const BLOCK = /\/\*[\s*]*==Stylebot==([\s\S]*?)==\/Stylebot==[\s*]*\*\//;
const SCHEME_LINE = /^@option\s+scheme\s+select\s+\[([^\]]*)\]\s+(\S+)$/;
const MODES_LINE = /^@modes\s+(.+)$/;
const SCHEME_VALUES = ['system', 'light', 'dark'];

// How a style covers light and dark: with Stylebot's own switch, or by
// following the site's theme.
export type LightDark = 'switch' | 'site';

const list = (values: string) =>
  values
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

/**
 * Whether the line declares the light/dark switch as the extension reads it
 * (src/core/css/style-options.ts there), so only one it would show counts.
 */
function isScheme(line: string) {
  const match = line.match(SCHEME_LINE);

  if (!match) {
    return false;
  }

  const values = list(match[1]);

  return (
    values.length === SCHEME_VALUES.length &&
    SCHEME_VALUES.every((value) => values.includes(value)) &&
    values.includes(match[2])
  );
}

function isLightAndDark(line: string) {
  const values = list(line.match(MODES_LINE)?.[1] ?? '');

  return values.includes('light') && values.includes('dark');
}

/**
 * How the CSS's `==Stylebot==` block says it covers light and dark: an
 * `@option scheme` switch, or `@modes light, dark` for a style that follows
 * the site's own setting. Null when it says neither.
 */
export function lightDark(css: string): LightDark | null {
  const block = css.includes('==Stylebot==') ? css.match(BLOCK) : null;

  if (!block) {
    return null;
  }

  const lines = block[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*?\s*/, '').trim());
  const scheme = lines.find((line) => /^@option\s+scheme\b/.test(line));

  if (scheme && isScheme(scheme)) {
    return 'switch';
  }

  if (lines.some(isLightAndDark)) {
    return 'site';
  }

  return null;
}
