import { useLocation } from 'preact-iso';

import { useSession } from '@/gallery/hooks/useSession';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import AccountNavLinks from './AccountNavLinks';
import SignInButton from './SignInButton';
import UserMenu from './UserMenu';

type Props = { locale: Locale; strings: Catalog };

/**
 * How to publish a style, with sign in, or the links between browsing and the
 * account's own styles and the account's menu.
 */
export default function AccountNav({ locale, strings }: Props) {
  const t = translator(strings);
  const session = useSession();
  const { path } = useLocation();

  if (session === undefined) {
    return null;
  }

  const publish = {
    href: localizePath(locale, '/publish'),
    // i18n: A header link to how to publish a style to the gallery.
    label: t('Publish a style'),
  };

  if (!session) {
    return (
      <>
        <AccountNavLinks links={[publish]} current={path} />

        <SignInButton t={t} />
      </>
    );
  }

  const links = [
    // i18n: A header link to the gallery's list of styles.
    { href: localizePath(locale, '/'), label: t('Browse') },
    { href: localizePath(locale, '/mine'), label: t('Your styles') },
    publish,
  ];
  const current = links.find((link) => link.href === path) ?? links[0];

  return (
    <>
      <AccountNavLinks links={links} current={current.href} />

      <UserMenu session={session} locale={locale} t={t} />
    </>
  );
}
