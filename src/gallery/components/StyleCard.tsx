import { screenshotUrl, type Style } from '@/gallery/lib/api';
import { styleHref } from '@/gallery/lib/paths';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import Favicon from './Favicon';
import InstalledBadge from './InstalledBadge';

import './StyleCard.css';

type Props = {
  style: Style;
  installed?: boolean;
  locale: Locale;
  t: Translate;
};

/**
 * A style in a grid: its screenshot in a small browser frame, with its name,
 * author, and whether it's installed.
 */
export default function StyleCard({ style, installed, locale, t }: Props) {
  const href = styleHref(locale, style);

  return (
    <div class="style-card">
      <a class="style-card-frame" href={href} tabIndex={-1} aria-hidden="true">
        <span class="style-card-bar">
          <Favicon site={style.site} />
          <span>{style.site}</span>
        </span>
        <img
          class="style-card-shot"
          src={screenshotUrl(style)}
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

      <span class="style-card-author">
        {style.author.name ??
          // i18n: Shown for a style's author who hasn't set a name.
          t('Anonymous')}
      </span>
    </div>
  );
}
