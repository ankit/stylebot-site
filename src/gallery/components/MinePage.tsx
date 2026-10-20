import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSession } from '@/gallery/hooks/useSession';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import MyStyleList from './MyStyleList';
import SignInButton from './SignInButton';

import './MinePage.css';

/**
 * The signed-in account's published styles, or a prompt to sign in.
 */
type Props = { locale: Locale; strings: Catalog };

export default function MinePage({ locale, strings }: Props) {
  const t = translator(strings);
  const session = useSession();
  const title = t('Your styles');

  usePageMeta(t('{title} | Stylebot', { title }), { noindex: true });

  return (
    <div class="mine-page">
      <h1 class="g-title mine-title">{title}</h1>

      {session === null && (
        <div class="g-empty">
          <p>{t('Sign in to see and manage the styles you’ve published.')}</p>

          <SignInButton t={t} />
        </div>
      )}

      {session && (
        <MyStyleList
          session={session.session}
          username={session.account.username}
          locale={locale}
          t={t}
        />
      )}
    </div>
  );
}
