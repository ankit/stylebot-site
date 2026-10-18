export type CssKind = 'comment' | 'selector' | 'property' | 'value' | 'brace';

export type CssRun = { text: string; kind: CssKind };

// A comment, a quoted string or a url(…) is read whole, so the braces and
// semicolons in it, as in url(data:image/png;base64,…), aren't taken for CSS.
const PIECE =
  /\/\*[\s\S]*?(?:\*\/|$)|"(?:\\[\s\S]|[^"\\])*"?|'(?:\\[\s\S]|[^'\\])*'?|url\((?:\\[\s\S]|[^)\\])*\)?|[{};]|(?:(?!url\()[^{};/"'])+|[\s\S]/gi;

/**
 * Splits CSS into colored runs: comments, selectors, properties, values and
 * braces. A rough pass for reading, not a parser.
 */
function tokenize(css: string) {
  const runs: Array<CssRun> = [];
  let pending = '';

  const flush = (end?: string) => {
    const text = pending;
    const colon = text.indexOf(':');

    pending = '';

    if (!text) {
      return;
    }

    if (end === '{' || text.trimStart().startsWith('@')) {
      runs.push({ text, kind: 'selector' });

      return;
    }

    if (colon < 0) {
      runs.push({ text, kind: 'property' });

      return;
    }

    runs.push(
      { text: text.slice(0, colon), kind: 'property' },
      { text: ':', kind: 'brace' },
      { text: text.slice(colon + 1), kind: 'value' },
    );
  };

  for (const piece of css.match(PIECE) ?? []) {
    if (piece.startsWith('/*') && !pending.trim()) {
      flush();
      runs.push({ text: piece, kind: 'comment' });
    } else if (piece === '{' || piece === '}' || piece === ';') {
      flush(piece);
      runs.push({ text: piece, kind: 'brace' });
    } else {
      pending += piece;
    }
  }

  flush();

  return runs;
}

/**
 * The CSS's runs split into lines, so each line can carry its number.
 */
export function cssLines(css: string) {
  const lines: Array<Array<CssRun>> = [[]];

  for (const run of tokenize(css)) {
    run.text.split('\n').forEach((text, i) => {
      if (i > 0) {
        lines.push([]);
      }

      if (text) {
        lines[lines.length - 1].push({ text, kind: run.kind });
      }
    });
  }

  return lines;
}
