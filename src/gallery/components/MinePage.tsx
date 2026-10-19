import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSession } from '@/gallery/hooks/useSession';
import { signOut } from '@/gallery/lib/auth';

import { type Catalog, translator } from '@/i18n/t';

import SignInButton from './SignInButton';

import './MinePage.css';

/**
 * The signed-in account's published styles, or a prompt to sign in.
 */
export default function MinePage({ strings }: { strings: Catalog }) {
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
        <p class="mine-account">
          {t('Signed in as {name}', {
            name: session.account.name ?? t('Your account'),
          })}
          {' · '}
          <button class="mine-sign-out" onClick={signOut}>
            {t('Sign out')}
          </button>
        </p>
      )}
    </div>
  );
}
