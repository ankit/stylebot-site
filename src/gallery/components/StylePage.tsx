import { useGroupRedirect } from '@/gallery/hooks/useGroupRedirect';
import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useStyle } from '@/gallery/hooks/useStyle';
import { screenshotUrl } from '@/gallery/lib/api';
import { fullNumber, timeAgo } from '@/gallery/lib/format';
import { siteHref } from '@/gallery/lib/paths';

import ZoomableImage from '@/components/ZoomableImage';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import BackLink from './BackLink';
import Favicon from './Favicon';
import LoadError from './LoadError';
import NotFound from './NotFound';
import PreviewCard from './PreviewCard';
import StyleCss from './StyleCss';
import StylePageSkeleton from './StylePageSkeleton';
import StyleVersions from './StyleVersions';

import './StylePage.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * The style this page's address names: its screenshot, name, site,
 * description and facts.
 */
export default function StylePage({ locale, strings }: Props) {
  const t = translator(strings);
  const { style, missing, failed, reload } = useStyle();
  const redirecting = useGroupRedirect(missing);
  let title = style?.name;

  if (missing) {
    title = t('Style not found');
  }

  usePageMeta(title && t('{title} | Stylebot', { title }));

  if (missing && redirecting) {
    return null;
  }

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
      <BackLink href={localizePath(locale, '/')}>{t('All styles')}</BackLink>

      <div class="style-page-top">
        <ZoomableImage
          class="style-page-shot"
          src={screenshotUrl(style)}
          alt={t('Screenshot of {name} on {site}', {
            name: style.name,
            site: style.site,
          })}
          strings={strings}
        />

        <div class="style-page-side">
          <h1>{style.name}</h1>

          <a class="style-page-site" href={siteHref(locale, style.group)}>
            <Favicon site={style.site} />
            {style.site}
          </a>

          {style.description && <p>{style.description}</p>}

          <PreviewCard style={style} locale={locale} t={t} />

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

      <StyleCss css={style.css} t={t} />

      <StyleVersions
        styleId={style.id}
        locale={locale}
        strings={strings}
        t={t}
      />
    </div>
  );
}
