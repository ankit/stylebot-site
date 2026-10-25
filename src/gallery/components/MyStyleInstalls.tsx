import { compactNumber } from '@/gallery/lib/format';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './MyStyleInstalls.css';

type Props = { installs: number; locale: Locale; t: Translate };

/**
 * How many times one of the account's styles has been installed.
 */
export default function MyStyleInstalls({ installs, locale, t }: Props) {
  let label = t('{count} installs', { count: compactNumber(locale, installs) });

  if (installs === 0) {
    // i18n: Under a style's status on Your styles, when nobody has installed it.
    label = t('No installs yet');
  } else if (installs === 1) {
    label = t('1 install');
  }

  return <span class="my-style-installs">{label}</span>;
}
