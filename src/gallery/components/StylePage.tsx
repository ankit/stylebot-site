import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useStyle } from '@/gallery/hooks/useStyle';
import { screenshotUrl } from '@/gallery/lib/api';
import { fullNumber, timeAgo } from '@/gallery/lib/format';

import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import Favicon from './Favicon';
import LoadError from './LoadError';
import NotFound from './NotFound';
import StylePageSkeleton from './StylePageSkeleton';

import './StylePage.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * The style this page's address names: its screenshot, name, site,
 * description and facts.
 */
export default function StylePage({ locale, strings }: Props) {
  const t = translator(strings);
  const { style, missing, failed, reload } = useStyle();
  let title = style?.name;

  if (missing) {
    title = t('Style not found');
  }

  usePageMeta(title && t('{title} | Stylebot', { title }));

  if (missing) {
    return (
      <NotFound
        title={t('Style not found')}
        message={t('It may have been unpublished, or the link is wrong.')}
        locale={locale}
        t={t}
      />
    );
  }

  if (failed) {
    return (
      <LoadError
        message={t('Couldn’t load this style.')}
        onRetry={reload}
        t={t}
      />
    );
  }

  if (!style) {
    return <StylePageSkeleton />;
  }

  return (
    <div class="style-page">
      <a class="style-page-back" href={localizePath(locale, '/')}>
        <ChevronLeftIcon />
        {t('All styles')}
      </a>

      <div class="style-page-top">
        <img
          class="style-page-shot"
          src={screenshotUrl(style)}
          alt={t('Screenshot of {name} on {site}', {
            name: style.name,
            site: style.site,
          })}
        />

        <div class="style-page-side">
          <h1>{style.name}</h1>

          <span class="style-page-site">
            <Favicon site={style.site} />
            {style.site}
          </span>

          {style.description && <p>{style.description}</p>}

          <dl class="style-page-facts">
            <dt>{t('Author')}</dt>
            <dd>
              {style.author.name ??
                // i18n: Shown for a style's author who hasn't set a name.
                t('Anonymous')}
            </dd>
            <dt>{t('Installs')}</dt>
            <dd>{fullNumber(locale, style.installs)}</dd>
            <dt>{t('Updated')}</dt>
            <dd>{timeAgo(locale, style.updatedAt)}</dd>
            <dt>{t('Version')}</dt>
            <dd>{style.version}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
