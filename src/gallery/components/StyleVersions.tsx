import { useVersions } from '@/gallery/hooks/useVersions';

import { type Locale } from '@/i18n/locales';
import { type Catalog, type Translate } from '@/i18n/t';

import VersionItem from './VersionItem';

import './StyleVersions.css';

type Props = {
  styleId: string;
  locale: Locale;
  strings: Catalog;
  t: Translate;
};

/**
 * A style's versions, newest first. Nothing while it has only one.
 */
export default function StyleVersions({ styleId, locale, strings, t }: Props) {
  const { data: versions } = useVersions(styleId);

  if (!versions || versions.length < 2) {
    return null;
  }

  return (
    <section class="style-versions">
      <h2>{t('Versions')}</h2>

      <ol>
        {versions.map((version, i) => (
          <VersionItem
            key={version.version}
            version={version}
            current={i === 0}
            locale={locale}
            strings={strings}
            t={t}
          />
        ))}
      </ol>
    </section>
  );
}
