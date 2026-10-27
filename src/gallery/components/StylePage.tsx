import { useRoute } from 'preact-iso';

import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSlugRedirect } from '@/gallery/hooks/useSlugRedirect';
import { useStyle } from '@/gallery/hooks/useStyle';
import { fullNumber, timeAgo } from '@/gallery/lib/format';
import { authorHref, siteHref } from '@/gallery/lib/paths';
import { lightDark } from '@/gallery/lib/styleOptions';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import EditStyleButton from './EditStyleButton';
import Favicon from './Favicon';
import LightDarkBadge from './LightDarkBadge';
import LoadError from './LoadError';
import MoreForSite from './MoreForSite';
import NotFound from './NotFound';
import PreviewCard from './PreviewCard';
import ReportStyleButton from './ReportStyleButton';
import StyleCss from './StyleCss';
import StylePageSkeleton from './StylePageSkeleton';
import StyleScreenshots from './StyleScreenshots';
import StyleVersions from './StyleVersions';
import UrlPattern from './UrlPattern';

import './StylePage.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * The style this page's address names: its screenshots, name, site,
 * description and facts.
 */
export default function StylePage({ locale, strings }: Props) {
  const t = translator(strings);
  const { id, slug } = useRoute().params;
  const { style, missing, failed, reload } = useStyle(id);
  let title = style?.name;

  if (missing) {
    title = t('Style not found');
  }

  usePageMeta(title && t('{title} | Stylebot', { title }), {
    noindex: missing,
  });
  useSlugRedirect(style, { id, slug }, locale);

  if (missing) {
    return (
      <NotFound
        title={t('Style not found')}
        message={t('It may have been deleted, or the link is wrong.')}
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

  const modes = lightDark(style.css);

  return (
    <div class="style-page">
      <div class="style-page-top">
        <StyleScreenshots
          screenshots={style.screenshots}
          alt={t('Screenshot of {name} on {site}', {
            name: style.name,
            site: style.site,
          })}
          strings={strings}
          t={t}
        />

        <div class="style-page-side">
          <div class="style-page-title">
            <h1>{style.name}</h1>

            <EditStyleButton style={style} locale={locale} t={t} />
          </div>

          <div class="style-page-site-row">
            <a class="style-page-site" href={siteHref(locale, style.site)}>
              <Favicon site={style.site} size={16} />
              {style.site}
            </a>

            {modes && <LightDarkBadge kind={modes} site={style.site} t={t} />}
          </div>

          <PreviewCard style={style} locale={locale} t={t} />

          <dl class="style-page-facts">
            <dt>{t('Author')}</dt>
            <dd>
              <a href={authorHref(locale, style.author.username)}>
                {style.author.username}
              </a>
            </dd>

            {style.urlPattern && (
              <>
                <dt>
                  {
                    // i18n: Beside the URL pattern of the pages a style applies to.
                    t('Pages')
                  }
                </dt>
                <dd>
                  <UrlPattern pattern={style.urlPattern} />
                </dd>
              </>
            )}

            <dt>{t('Installs')}</dt>
            <dd>{fullNumber(locale, style.installs)}</dd>
            <dt>{t('Updated')}</dt>
            <dd>{timeAgo(locale, style.updatedAt)}</dd>
            <dt>{t('Version')}</dt>
            <dd>{style.version}</dd>
          </dl>

          <ReportStyleButton style={style} t={t} />
        </div>

        {style.description && (
          <p class="style-page-about">{style.description}</p>
        )}
      </div>

      <StyleCss css={style.css} t={t} />

      <StyleVersions styleId={style.id} locale={locale} t={t} />

      <MoreForSite style={style} locale={locale} t={t} />
    </div>
  );
}
