import { type OwnStyle } from '@/gallery/lib/api';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import MyStyleInstalls from './MyStyleInstalls';
import MyStyleStatusLine from './MyStyleStatusLine';
import PublishUpdateLink from './PublishUpdateLink';

import './MyStyleStatus.css';

type Props = {
  style: OwnStyle;
  // Whether the profile it was published from has changed in Stylebot since
  // its current version.
  changed: boolean;
  locale: Locale;
  t: Translate;
};

/**
 * Where one of the account's styles stands in the Gallery, and below it its
 * installs, or Publish update when it has unpublished changes.
 */
export default function MyStyleStatus({ style, changed, locale, t }: Props) {
  return (
    <div class="my-style-status">
      <MyStyleStatusLine style={style} changed={changed} t={t} />

      {changed && <PublishUpdateLink styleId={style.id} t={t} />}

      {!changed && (
        <MyStyleInstalls installs={style.installs} locale={locale} t={t} />
      )}
    </div>
  );
}
