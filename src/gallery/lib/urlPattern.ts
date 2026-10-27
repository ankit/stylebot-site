/**
 * A URL pattern split after each `/` between path segments, where a long
 * one can wrap: not inside `[…]`, after an escape, or between `//`.
 */
export function patternSegments(pattern: string) {
  const segments: Array<string> = [];
  let start = 0;
  let inClass = false;

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    if (char === '\\') {
      i++;
    } else if (char === '[') {
      inClass = true;
    } else if (char === ']') {
      inClass = false;
    } else if (char === '/' && !inClass && pattern[i + 1] !== '/') {
      segments.push(pattern.slice(start, i + 1));
      start = i + 1;
    }
  }

  segments.push(pattern.slice(start));

  return segments.filter(Boolean);
}
