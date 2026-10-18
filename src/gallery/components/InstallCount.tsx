import { compactNumber, fullNumber } from '@/gallery/lib/format';

import DownloadIcon from '@/components/icons/DownloadIcon';
import Tooltip from '@/components/Tooltip';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './InstallCount.css';

type Props = { installs: number; locale: Locale; t: Translate };

/**
 * How many times a style was installed, short (1.2K), with the whole number
 * in a tooltip. Nothing for a style no one has installed yet.
 */
export default function InstallCount({ installs, locale, t }: Props) {
  if (!installs) {
    return null;
  }

  const label = t('Installs: {count}', {
    count: fullNumber(locale, installs),
  });

  return (
    <span class="install-count" role="img" aria-label={label}>
      <DownloadIcon size={11} />
      {compactNumber(locale, installs)}
      <Tooltip>{label}</Tooltip>
    </span>
  );
}
