import { useRoute } from 'preact-iso';

import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSlugRedirect } from '@/gallery/hooks/useSlugRedirect';
import { useStyle } from '@/gallery/hooks/useStyle';
import {
  resizedScreenshotUrl,
  screenshotSrcset,
  screenshotUrl,
} from '@/gallery/lib/api';
import { fullNumber, timeAgo } from '@/gallery/lib/format';
import { authorHref, siteHref } from '@/gallery/lib/paths';

import ZoomableImage from '@/components/ZoomableImage';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import BackLink from './BackLink';
import Favicon from './Favicon';
import LoadError from './LoadError';
import MoreForSite from './MoreForSite';
import NotFound from './NotFound';
import PreviewCard from './PreviewCard';
import ReportStyleButton from './ReportStyleButton';
import StyleCss from './StyleCss';
import StylePageSkeleton from './StylePageSkeleton';
import StyleVersions from './StyleVersions';

import './StylePage.css';

// Beside the details it grows to about 707px; below 900px it takes the width.
const SHOT_SIZES = '(min-width: 900px) 707px, calc(100vw - 32px)';

// The API doesn't give the original's width, but screenshots are usually about
// 2600px wide, so a Retina screen takes the original once 960 would blur.
const ORIGINAL_WIDTH = 2560;

type Props = { locale: Locale; strings: Catalog };

/**
 * The style this page's address names: its screenshot, name, site,
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

  return (
    <div class="style-page">
      <BackLink href={localizePath(locale, '/')}>{t('All styles')}</BackLink>

      <div class="style-page-top">
        <ZoomableImage
          class="style-page-shot"
          src={resizedScreenshotUrl(style, 960)}
          srcset={`${screenshotSrcset(style)}, ${screenshotUrl(style)} ${ORIGINAL_WIDTH}w`}
          sizes={SHOT_SIZES}
          full={screenshotUrl(style)}
          alt={t('Screenshot of {name} on {site}', {
            name: style.name,
            site: style.site,
          })}
          strings={strings}
        />

        <div class="style-page-side">
          <h1>{style.name}</h1>

          <a class="style-page-site" href={siteHref(locale, style.site)}>
            <Favicon site={style.site} />
            {style.site}
          </a>

          {style.description && <p>{style.description}</p>}

          <PreviewCard style={style} locale={locale} t={t} />

          <dl class="style-page-facts">
            <dt>{t('Author')}</dt>
            <dd>
              <a href={authorHref(locale, style.author.username)}>
                {style.author.username}
              </a>
            </dd>
            <dt>{t('Installs')}</dt>
            <dd>{fullNumber(locale, style.installs)}</dd>
            <dt>{t('Updated')}</dt>
            <dd>{timeAgo(locale, style.updatedAt)}</dd>
            <dt>{t('Version')}</dt>
            <dd>{style.version}</dd>
          </dl>

          <ReportStyleButton style={style} t={t} />
        </div>
      </div>

      <StyleCss css={style.css} t={t} />

      <StyleVersions styleId={style.id} locale={locale} t={t} />

      <MoreForSite style={style} locale={locale} t={t} />
    </div>
  );
}
