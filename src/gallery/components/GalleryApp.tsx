import { createPortal } from 'preact/compat';
import { lazy, LocationProvider, Route, Router } from 'preact-iso';

import { restoreScroll } from '@/gallery/lib/scroll';

import { type Locale, LOCALES, localizePath } from '@/i18n/locales';
import { type Catalog } from '@/i18n/t';

import AccountNav from './AccountNav';
import Browse from './Browse';
import NotFoundPage from './NotFoundPage';

const SitePage = lazy(() => import('./SitePage'));
const StylePage = lazy(() => import('./StylePage'));
const MinePage = lazy(() => import('./MinePage'));
const AuthorPage = lazy(() => import('./AuthorPage'));
const SitesPage = lazy(() => import('./SitesPage'));

type Props = { locale: Locale; strings: Catalog };

/**
 * Links the app handles itself: its own locale's pages. Another locale's are
 * full loads, since each locale is its own built page.
 */
function localeScope(locale: Locale) {
  const others = LOCALES.filter((l) => l.code !== locale).map((l) => l.code);

  return new RegExp(`^/(?!(${others.join('|')})(/|$))`);
}

/**
 * Every gallery page, switched between in place as links are followed.
 */
export default function GalleryApp({ locale, strings }: Props) {
  const base = localizePath(locale, '/');
  const props = { locale, strings };
  const nav = document.getElementById('account-nav');

  return (
    <LocationProvider scope={localeScope(locale)}>
      {nav &&
        createPortal(<AccountNav locale={locale} strings={strings} />, nav)}

      <Router onRouteChange={restoreScroll}>
        <Route path={base} component={Browse} {...props} />

        <Route path={`${base}sites`} component={SitesPage} {...props} />

        <Route path={`${base}s/:group`} component={SitePage} {...props} />

        <Route
          path={`${base}s/:group/:slug`}
          component={StylePage}
          {...props}
        />

        <Route path={`${base}mine`} component={MinePage} {...props} />

        <Route path={`${base}u/:username`} component={AuthorPage} {...props} />

        <Route default component={NotFoundPage} {...props} />
      </Router>
    </LocationProvider>
  );
}
