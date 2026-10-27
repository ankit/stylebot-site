import { type OwnStyle, resizedScreenshotUrl } from '@/gallery/lib/api';
import { type PublishedStatus } from '@/gallery/lib/bridge';
import { timeAgo } from '@/gallery/lib/format';
import { styleHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';
import MyStyleMenu from './MyStyleMenu';
import MyStyleStatus from './MyStyleStatus';

import './MyStyleRow.css';

type Props = {
  style: OwnStyle;
  published?: PublishedStatus;
  session: string;
  onDeleted: () => void;
  locale: Locale;
  t: Translate;
};

/**
 * One of the account's styles: its screenshot and name, linking to its page
 * while it's live, its site, when it was updated, where it stands in the
 * Gallery, and a menu with Edit and Delete.
 */
export default function MyStyleRow({
  style,
  published,
  session,
  onDeleted,
  locale,
  t,
}: Props) {
  const live = style.status === 'live';
  const changed =
    published?.changed === true && published.version === style.version;

  return (
    <li class="my-style-row">
      {live && (
        <a class="my-style-shot" href={styleHref(locale, style)} tabIndex={-1}>
          <img
            src={resizedScreenshotUrl(style.screenshots[0], 480)}
            alt=""
            loading="lazy"
          />
        </a>
      )}

      {!live && <span class="my-style-shot" />}

      <div class="my-style-main">
        <div class="my-style-name">
          {live && <a href={styleHref(locale, style)}>{style.name}</a>}

          {!live && <span>{style.name}</span>}
        </div>

        <div class="my-style-meta">
          <span class="my-style-site">
            <Favicon site={style.site} />
            {style.site}
          </span>

          <span aria-hidden="true">·</span>

          <span>
            {t('Updated {time}', { time: timeAgo(locale, style.updatedAt) })}
          </span>
        </div>
      </div>

      <MyStyleStatus style={style} changed={changed} locale={locale} t={t} />

      <MyStyleMenu
        style={style}
        session={session}
        onDeleted={onDeleted}
        locale={locale}
        t={t}
      />
    </li>
  );
}
