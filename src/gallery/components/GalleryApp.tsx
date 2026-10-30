import { createPortal } from 'preact/compat';
import { lazy, LocationProvider, Route, Router } from 'preact-iso';

import { useRemoveStaticContent } from '@/gallery/hooks/useRemoveStaticContent';
import { restoreScroll } from '@/gallery/lib/scroll';

import {
  DEFAULT_LOCALE,
  type Locale,
  LOCALES,
  localizePath,
} from '@/i18n/locales';
import { type Catalog } from '@/i18n/t';

import AccountNav from './AccountNav';
import Browse from './Browse';
import NotFoundPage from './NotFoundPage';

const SitePage = lazy(() => import('./SitePage'));
const StylePage = lazy(() => import('./StylePage'));
const MinePage = lazy(() => import('./MinePage'));
const AuthorPage = lazy(() => import('./AuthorPage'));
const SitesPage = lazy(() => import('./SitesPage'));
const PublishPage = lazy(() => import('./PublishPage'));
const EditPage = lazy(() => import('./EditPage'));

type Props = { locale: Locale; strings: Catalog };

/**
 * Links the app handles itself: its own locale's pages. Another locale's are
 * full loads, since each locale is its own built page. English pages have no
 * prefix, so they're the paths without another locale's.
 */
function localeScope(locale: Locale) {
  if (locale !== DEFAULT_LOCALE) {
    return new RegExp(`^/${locale}(/|$)`);
  }

  const others = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map(
    (l) => l.code,
  );

  return new RegExp(`^/(?!(${others.join('|')})(/|$))`);
}

/**
 * Every gallery page, switched between in place as links are followed.
 */
export default function GalleryApp({ locale, strings }: Props) {
  const base = localizePath(locale, '/');
  const props = { locale, strings };
  const nav = document.getElementById('account-nav');

  useRemoveStaticContent();

  return (
    <LocationProvider scope={localeScope(locale)}>
      {nav &&
        createPortal(<AccountNav locale={locale} strings={strings} />, nav)}

      <Router onRouteChange={restoreScroll}>
        <Route path={base} component={Browse} {...props} />

        <Route path={`${base}sites`} component={SitesPage} {...props} />

        <Route path={`${base}site/:site`} component={SitePage} {...props} />

        <Route
          path={`${base}style/:id/:slug?`}
          component={StylePage}
          {...props}
        />

        <Route path={`${base}mine`} component={MinePage} {...props} />

        <Route path={`${base}publish`} component={PublishPage} {...props} />

        <Route path={`${base}edit/:id`} component={EditPage} {...props} />

        <Route
          path={`${base}author/:username`}
          component={AuthorPage}
          {...props}
        />

        <Route default component={NotFoundPage} {...props} />
      </Router>
    </LocationProvider>
  );
}
