import { htmlLang, type Locale } from '@/i18n/locales';

const DAY = 86400000;

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * DAY],
  ['month', 30 * DAY],
  ['week', 7 * DAY],
  ['day', DAY],
  ['hour', 3600000],
  ['minute', 60000],
];

export const fullNumber = (locale: Locale, n: number) =>
  new Intl.NumberFormat(htmlLang(locale)).format(n);

// Short, as in 1.2K.
export const compactNumber = (locale: Locale, n: number) =>
  new Intl.NumberFormat(htmlLang(locale), { notation: 'compact' }).format(n);

/**
 * How long ago a time was, such as "3 days ago" or "yesterday".
 */
export function timeAgo(locale: Locale, ms: number) {
  const rtf = new Intl.RelativeTimeFormat(htmlLang(locale), {
    numeric: 'auto',
  });
  const elapsed = Date.now() - ms;
  const unit = UNITS.find(([, size]) => elapsed >= size);

  if (!unit) {
    return rtf.format(0, 'minute');
  }

  return rtf.format(-Math.floor(elapsed / unit[1]), unit[0]);
}
