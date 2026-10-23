import { useLocation } from 'preact-iso';

import { useSession } from '@/gallery/hooks/useSession';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import SignInButton from './SignInButton';
import UserMenu from './UserMenu';

import './AccountNav.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * Sign in, or the links between browsing and the account's own styles, and
 * the account's menu.
 */
export default function AccountNav({ locale, strings }: Props) {
  const t = translator(strings);
  const session = useSession();
  const { path } = useLocation();

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return <SignInButton t={t} />;
  }

  const links = [
    // i18n: A header link to the gallery's list of styles.
    { href: localizePath(locale, '/'), label: t('Browse') },
    { href: localizePath(locale, '/mine'), label: t('Your styles') },
  ];
  let current = links[0].href;

  if (path === links[1].href) {
    current = links[1].href;
  }

  return (
    <>
      <nav class="account-nav">
        {links.map((link) => (
          <a
            key={link.href}
            class="account-nav-link"
            href={link.href}
            aria-current={link.href === current}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <UserMenu
        session={session}
        welcome={path !== localizePath(locale, '/publish')}
        locale={locale}
        t={t}
      />
    </>
  );
}
