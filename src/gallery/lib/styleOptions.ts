// Reads a style's options as the extension does (src/core/css/style-options.ts
// there), so the gallery only lists ones its popup would show.
const BLOCKS =
  /\/\*[\s*]*==(Stylebot|UserStyle)==([\s\S]*?)==\/\1==[\s*]*\*\//g;
const OPTION_LINE = /^@option\s+(\S+)\s+(\S+)\s+(.*)$/;
const VAR_LINE = /^@var\s+(\S+)\s+(\S+)\s+("[^"]*"|'[^']*'|\S+)\s+([\s\S]+)$/;
const MODES_LINE = /^@modes\s+(.+)$/;
const SCHEME_ARGS = /^\[([^\]]*)\]\s+(\S+)$/;
const NAME = /^[\w-]+$/;
const SCHEME_VALUES = ['system', 'light', 'dark'];

export type StyleOptionChoice = { value: string; label: string; css: string };

export type StyleOption = {
  name: string;
  type: 'select' | 'checkbox';
  label: string;
  choices: Array<StyleOptionChoice>;
  default: string;
};

// How a style covers light and dark: with Stylebot's own switch, or by
// following the site's theme.
export type LightDark = 'switch' | 'site';

const list = (values: string) =>
  values
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

function scheme(values: Array<string>, fallback: string) {
  const isScheme =
    values.length === SCHEME_VALUES.length &&
    SCHEME_VALUES.every((value) => values.includes(value)) &&
    values.includes(fallback);

  if (!isScheme) {
    return undefined;
  }

  const option: StyleOption = {
    name: 'scheme',
    type: 'select',
    label: '',
    choices: values.map((value) => ({ value, label: value, css: value })),
    default: fallback,
  };

  return option;
}

function parseOptionLine(line: string) {
  const match = line.match(OPTION_LINE);

  if (!match || match[1] !== 'scheme' || match[2] !== 'select') {
    return undefined;
  }

  const args = match[3].trim().match(SCHEME_ARGS);

  if (!args) {
    return undefined;
  }

  return scheme(list(args[1]), args[2]);
}

function unquote(label: string) {
  if (/^(["']).*\1$/.test(label)) {
    return label.slice(1, -1);
  }

  return label;
}

/**
 * Splits a select entry, `value:Label*`, into its value, its label (the
 * value when it has none) and whether the `*` marks it the default.
 */
function parseEntry(entry: string) {
  const starred = entry.endsWith('*');
  let text = entry;

  if (starred) {
    text = entry.slice(0, -1);
  }

  const colon = text.indexOf(':');

  if (colon === -1) {
    return { value: text, label: text, starred };
  }

  return {
    value: text.slice(0, colon),
    label: text.slice(colon + 1),
    starred,
  };
}

/**
 * Reads a `@var select` default, an array of `"value:Label"` entries or an
 * object of `"value:Label": "css"` pairs, or undefined when it's neither.
 */
function parseSelectArgs(args: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(args);
  } catch {
    return undefined;
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return undefined;
  }

  let pairs: Array<[unknown, unknown]> = Object.entries(parsed);

  if (Array.isArray(parsed)) {
    pairs = parsed.map((entry) => [entry, undefined]);
  }

  const choices: Array<StyleOptionChoice> = [];
  let fallback: string | undefined;

  for (const [key, css] of pairs) {
    if (
      typeof key !== 'string' ||
      !['undefined', 'string'].includes(typeof css)
    ) {
      return undefined;
    }

    const { value, label, starred } = parseEntry(key);

    if (!value || choices.some((choice) => choice.value === value)) {
      return undefined;
    }

    choices.push({ value, label, css: (css as string | undefined) ?? value });

    if (starred && fallback === undefined) {
      fallback = value;
    }
  }

  if (choices.length === 0) {
    return undefined;
  }

  return { choices, default: fallback ?? choices[0].value };
}

function parseVarLine(line: string) {
  const match = line.match(VAR_LINE);

  if (!match) {
    return undefined;
  }

  const [, type, name, rawLabel, rawArgs] = match;
  const label = unquote(rawLabel);
  const args = rawArgs.trim();

  if (!NAME.test(name)) {
    return undefined;
  }

  if (type === 'checkbox' && name !== 'scheme') {
    if (args !== '0' && args !== '1') {
      return undefined;
    }

    const option: StyleOption = {
      name,
      type,
      label,
      choices: [],
      default: args,
    };

    return option;
  }

  if (type !== 'select') {
    return undefined;
  }

  const parsed = parseSelectArgs(args);

  if (!parsed) {
    return undefined;
  }

  if (name === 'scheme') {
    return scheme(
      parsed.choices.map((choice) => choice.value),
      parsed.default,
    );
  }

  const option: StyleOption = { name, type, label, ...parsed };

  return option;
}

/**
 * How many brackets a line leaves open, outside quoted strings, so a `@var`
 * whose values span several lines can be read as one.
 */
function openBrackets(text: string) {
  let depth = 0;
  let quote: string | null = null;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (quote) {
      if (char === '\\') {
        i++;
      } else if (char === quote) {
        quote = null;
      }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[' || char === '{') {
      depth++;
    } else if (char === ']' || char === '}') {
      depth--;
    }
  }

  return depth;
}

/**
 * The lines of every `==Stylebot==` and `==UserStyle==` block, without
 * comment decoration, with a `@var` that spans several lines joined into one.
 */
function metadataLines(css: string) {
  if (!css.includes('==Stylebot==') && !css.includes('==UserStyle==')) {
    return [];
  }

  const lines = [...css.matchAll(BLOCKS)].flatMap((block) =>
    block[2]
      .split('\n')
      .map((line) => line.replace(/^\s*\*?\s*/, '').trim())
      .filter(Boolean),
  );
  const joined: Array<string> = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith('@var')) {
      while (openBrackets(line) > 0 && i + 1 < lines.length) {
        line += ` ${lines[++i]}`;
      }
    }

    joined.push(line);
  }

  return joined;
}

function parseLine(line: string) {
  if (line.startsWith('@var')) {
    return parseVarLine(line);
  }

  if (line.startsWith('@option')) {
    return parseOptionLine(line);
  }

  return undefined;
}

/**
 * The options a style's CSS declares, in order, including the light/dark
 * `scheme`. Lines the extension would skip are left out, as is a repeated
 * name.
 */
export function styleOptions(css: string) {
  const options: Array<StyleOption> = [];

  for (const line of metadataLines(css)) {
    const option = parseLine(line);

    if (option && !options.some(({ name }) => name === option.name)) {
      options.push(option);
    }
  }

  return options;
}

function isLightAndDark(line: string) {
  const values = list(line.match(MODES_LINE)?.[1] ?? '');

  return values.includes('light') && values.includes('dark');
}

/**
 * How the CSS says it covers light and dark: a `scheme` switch, or
 * `@modes light, dark` for a style that follows the site's own setting. Null
 * when it says neither.
 */
export function lightDark(css: string): LightDark | null {
  if (styleOptions(css).some(({ name }) => name === 'scheme')) {
    return 'switch';
  }

  if (metadataLines(css).some(isLightAndDark)) {
    return 'site';
  }

  return null;
}
