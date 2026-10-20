import { type StyleVersion } from '@/gallery/lib/api';
import { timeAgo } from '@/gallery/lib/format';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './VersionItem.css';

type Props = {
  version: StyleVersion;
  current: boolean;
  locale: Locale;
  t: Translate;
};

/**
 * One version of a style: its number, age and notes.
 */
export default function VersionItem({ version, current, locale, t }: Props) {
  return (
    <li class="version-item">
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
