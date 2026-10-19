import { useSession } from '@/gallery/hooks/useSession';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import SignInButton from './SignInButton';
import UserMenu from './UserMenu';

import './AccountNav.css';

export type GallerySection = 'browse' | 'mine';

type Props = {
  current?: GallerySection;
  locale: Locale;
  strings: Catalog;
};

/**
 * Sign in, or the links between browsing and the account's own styles, and
 * the account's menu.
 */
export default function AccountNav({ current, locale, strings }: Props) {
  const t = translator(strings);
  const session = useSession();

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return <SignInButton t={t} />;
  }

  const links = [
    // i18n: A header link to the gallery's list of styles.
    { section: 'browse', href: localizePath(locale, '/'), label: t('Browse') },
    {
      section: 'mine',
      href: localizePath(locale, '/mine'),
      label: t('Your styles'),
    },
  ];

  return (
    <>
      <nav class="account-nav">
        {links.map((link) => (
          <a
            key={link.section}
            class="account-nav-link"
            href={link.href}
            aria-current={link.section === current}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <UserMenu account={session.account} locale={locale} t={t} />
    </>
  );
}
