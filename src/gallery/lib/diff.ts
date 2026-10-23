export type DiffLine = {
  kind: 'same' | 'added' | 'removed';
  text: string;
  // The line's number in the new CSS, or in the old one for a removed line.
  number: number;
};

// Past this many line pairs the table takes too long to build; the page shows
// the whole CSS instead.
const MAX_CELLS = 4_000_000;

const toLines = (css: string) =>
  css
    .replace(/\r\n/g, '\n')
    .trimEnd()
    .split('\n')
    .map((line) => line.trimEnd());

/**
 * Whether two stylesheets are the same, ignoring line endings and trailing
 * spaces.
 */
export const sameCss = (a: string, b: string) =>
  toLines(a).join('\n') === toLines(b).join('\n');

/**
 * The lines of `after` and those removed from `before`, in order, by their
 * longest common subsequence. Null when the two are too long to compare.
 */
export function diffLines(before: string, after: string) {
  const a = toLines(before);
  const b = toLines(after);

  if (a.length * b.length > MAX_CELLS) {
    return null;
  }

  // common[i][j] is the length of the longest common run of a[i..] and b[j..].
  const common = Array.from(
    { length: a.length + 1 },
    () => new Uint32Array(b.length + 1),
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        common[i][j] = common[i + 1][j + 1] + 1;
      } else {
        common[i][j] = Math.max(common[i + 1][j], common[i][j + 1]);
      }
    }
  }

  const lines: Array<DiffLine> = [];
  let i = 0;
  let j = 0;

  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      lines.push({ kind: 'same', text: b[j], number: j + 1 });
      i++;
      j++;
    } else if (
      i < a.length &&
      (j >= b.length || common[i + 1][j] >= common[i][j + 1])
    ) {
      lines.push({ kind: 'removed', text: a[i], number: i + 1 });
      i++;
    } else {
      lines.push({ kind: 'added', text: b[j], number: j + 1 });
      j++;
    }
  }

  return lines;
}

/**
 * The changed lines with `context` unchanged ones around them, split into
 * runs wherever unchanged lines are left out.
 */
export function toHunks(lines: Array<DiffLine>, context = 2) {
  const keep = lines.map(() => false);

  lines.forEach((line, n) => {
    if (line.kind !== 'same') {
      for (let k = n - context; k <= n + context; k++) {
        if (k >= 0 && k < lines.length) {
          keep[k] = true;
        }
      }
    }
  });

  const hunks: Array<Array<DiffLine>> = [];
  let current: Array<DiffLine> = [];

  lines.forEach((line, n) => {
    if (keep[n]) {
      current.push(line);
    } else if (current.length > 0) {
      hunks.push(current);
      current = [];
    }
  });

  if (current.length > 0) {
    hunks.push(current);
  }

  return hunks;
}
