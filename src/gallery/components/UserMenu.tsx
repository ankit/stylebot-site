import { useEffect, useState } from 'preact/hooks';

import { useSession } from '@/gallery/hooks/useSession';
import { signOut } from '@/gallery/lib/auth';

import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

import { type Catalog, translator } from '@/i18n/t';

import SignInButton from './SignInButton';

import './UserMenu.css';

/**
 * Sign in with Google, or the signed-in name, opening a menu to sign out.
 */
export default function UserMenu({ strings }: { strings: Catalog }) {
  const t = translator(strings);
  const session = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return <SignInButton t={t} />;
  }

  // i18n: The account menu's label when the account has no display name.
  const name = session.account.name ?? t('Your account');

  return (
    <div class="user-menu">
      <button
        class="user-menu-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span class="user-menu-name">{name}</span>

        <ChevronDownIcon />
      </button>

      {open && (
        <>
          <div class="user-menu-scrim" onClick={() => setOpen(false)} />

          <div class="user-menu-list" role="menu">
            <button
              role="menuitem"
              class="user-menu-item"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              {t('Sign out')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
