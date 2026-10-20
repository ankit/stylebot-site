import {
  resizedScreenshotUrl,
  screenshotSrcset,
  type Style,
} from '@/gallery/lib/api';
import { authorHref, styleHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';
import InstallCount from './InstallCount';
import InstalledBadge from './InstalledBadge';

import './StyleCard.css';

// Cards in StyleGrid: three columns of up to 361px, then two, then one.
const GRID_SIZES =
  '(min-width: 906px) 361px, (min-width: 612px) calc(50vw - 36px), calc(100vw - 32px)';

type Props = {
  style: Style;
  installed?: boolean;
  // Off where the site is already named, as on its own page.
  showSite?: boolean;
  // The screenshot's width in the layout, as an img `sizes`.
  sizes?: string;
  locale: Locale;
  t: Translate;
};

/**
 * A style in a grid: its screenshot in a small browser frame, with its name,
 * author, installs, and whether it's installed.
 */
export default function StyleCard({
  style,
  installed,
  showSite = true,
  sizes = GRID_SIZES,
  locale,
  t,
}: Props) {
  const href = styleHref(locale, style);

  return (
    <div class="style-card">
      <a class="style-card-frame" href={href} tabIndex={-1} aria-hidden="true">
        {showSite && (
          <span class="style-card-bar">
            <Favicon site={style.site} />
            <span>{style.site}</span>
          </span>
        )}
        <img
          class="style-card-shot"
          src={resizedScreenshotUrl(style, 960)}
          srcSet={screenshotSrcset(style)}
          sizes={sizes}
          alt=""
          loading="lazy"
        />
      </a>
      <div class="style-card-title">
        <a class="style-card-name" href={href}>
          {style.name}
        </a>

        {installed && <InstalledBadge t={t} />}
      </div>

      <div class="style-card-meta">
        <a
          class="style-card-author"
          href={authorHref(locale, style.author.username)}
        >
          {style.author.username}
        </a>

        <InstallCount installs={style.installs} locale={locale} t={t} />
      </div>
    </div>
  );
}
