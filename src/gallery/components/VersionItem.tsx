import { useState } from 'preact/hooks';

import { type StyleVersion } from '@/gallery/lib/api';
import { timeAgo } from '@/gallery/lib/format';

import ChevronRightIcon from '@/components/icons/ChevronRightIcon';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import VersionDiff from './VersionDiff';

import './VersionItem.css';

// `previous` is the version before this one, if any, to show its changes
// against.
type Props = {
  styleId: number;
  version: StyleVersion;
  previous?: number;
  current: boolean;
  locale: Locale;
  t: Translate;
};

/**
 * One version of a style: its number, age and notes, and what it changed in
 * the CSS a click away.
 */
export default function VersionItem({
  styleId,
  version,
  previous,
  current,
  locale,
  t,
}: Props) {
  const [open, setOpen] = useState(false);
  const title = t('Version {version}', { version: version.version });

  return (
    <li class="version-item" aria-current={current || undefined}>
      <div class="version-item-head">
        {previous === undefined && <strong>{title}</strong>}

        {previous !== undefined && (
          <button
            type="button"
            class="version-item-toggle"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <strong>{title}</strong>

            <span class="sr-only">{t('Show changes')}</span>

            <ChevronRightIcon size={12} />
          </button>
        )}

        <span class="version-item-date">
          {timeAgo(locale, version.createdAt)}
        </span>
      </div>

      {version.notes && <p class="version-item-notes">{version.notes}</p>}

      {open && previous !== undefined && (
        <VersionDiff
          styleId={styleId}
          version={version.version}
          previous={previous}
          t={t}
        />
      )}
    </li>
  );
}
