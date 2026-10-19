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

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return (
      <div class="g-empty">
        <p>{t('Sign in to see and manage the styles you’ve published.')}</p>

        <SignInButton t={t} />
      </div>
    );
  }

  return (
    <p class="mine-account">
      {t('Signed in as {name}', {
        name: session.account.name ?? t('Your account'),
      })}
      {' · '}
      <button class="mine-sign-out" onClick={signOut}>
        {t('Sign out')}
      </button>
    </p>
  );
}
