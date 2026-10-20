import { useEffect } from 'preact/hooks';
import { useLocation, useRoute } from 'preact-iso';

import { useAuthor } from '@/gallery/hooks/useAuthor';
import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSession } from '@/gallery/hooks/useSession';
import { useSort } from '@/gallery/hooks/useSort';
import { useStyles } from '@/gallery/hooks/useStyles';
import { compactNumber, fullNumber } from '@/gallery/lib/format';
import { authorHref } from '@/gallery/lib/paths';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import BackLink from './BackLink';
import LoadError from './LoadError';
import NotFound from './NotFound';
import SortTabs from './SortTabs';
import StyleGrid from './StyleGrid';

import './AuthorPage.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * An author's styles, most installed or most recently updated first. An old
 * username moves to their current one.
 */
export default function AuthorPage({ locale, strings }: Props) {
  const t = translator(strings);
  const { username } = useRoute().params;
  const { route } = useLocation();
  const { author, missing, failed, reload } = useAuthor(username);
  const session = useSession();
  const own = author && session?.account.username === author.username;
  const [sort, setSort] = useSort();
  const feed = useStyles({ search: '', sort, author: username });
  let title = username;

  if (missing) {
    // i18n: The title of the page for an author who doesn't exist or has no published styles.
    title = t('Author not found');
  }

  usePageMeta(t('{title} | Stylebot', { title }));

  useEffect(() => {
    if (author && author.username !== username) {
      route(authorHref(locale, author.username) + location.search, true);
    }
  }, [author, username, locale, route]);

  if (missing) {
    return <NotFound title={title} locale={locale} t={t} />;
  }

  if (failed) {
    return (
      <LoadError
        message={t('Couldn’t load this author.')}
        onRetry={reload}
        t={t}
      />
    );
  }

  return (
    <div class="author-page">
      <BackLink href={localizePath(locale, '/')}>{t('All styles')}</BackLink>

      <div class="author-page-head">
        <h1 class="g-title">{username}</h1>

        {author && (
          <p class="author-page-stats">
            {t('Styles: {count}', { count: fullNumber(locale, author.styles) })}
            <span aria-hidden="true">·</span>
            {t('Installs: {count}', {
              count: compactNumber(locale, author.installs),
            })}

            {own && <span aria-hidden="true">·</span>}

            {own && (
              <a
                class="author-page-manage"
                href={localizePath(locale, '/mine')}
              >
                {t('Manage your styles')}
              </a>
            )}
          </p>
        )}
      </div>

      <SortTabs sort={sort} onChange={setSort} t={t} />

      <StyleGrid feed={feed} locale={locale} t={t} />
    </div>
  );
}
