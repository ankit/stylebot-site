import { screenshotUrl, type StyleVersion } from '@/gallery/lib/api';
import { timeAgo } from '@/gallery/lib/format';

import ZoomableImage from '@/components/ZoomableImage';

import { type Locale } from '@/i18n/locales';
import { type Catalog, type Translate } from '@/i18n/t';

import './VersionItem.css';

type Props = {
  version: StyleVersion;
  current: boolean;
  locale: Locale;
  strings: Catalog;
  t: Translate;
};

/**
 * One version of a style: its screenshot, number, age and notes.
 */
export default function VersionItem({
  version,
  current,
  locale,
  strings,
  t,
}: Props) {
  return (
    <li class="version-item">
      <ZoomableImage
        class="version-item-shot"
        src={screenshotUrl(version)}
        alt={t('Screenshot of version {version}', {
          version: version.version,
        })}
        strings={strings}
      />

      <div class="version-item-text">
        <div class="version-item-head">
          <strong>
            {t('Version {version}', { version: version.version })}
          </strong>

          {current && <span class="version-item-current">{t('Current')}</span>}

          <span class="version-item-date">
            {timeAgo(locale, version.createdAt)}
          </span>
        </div>

        {version.notes && <p>{version.notes}</p>}
      </div>
    </li>
  );
}
