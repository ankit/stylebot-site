import { useEffect, useState } from 'preact/hooks';

import { useWelcomeSeen } from '@/gallery/hooks/useWelcomeSeen';
import { type Session } from '@/gallery/lib/api';
import { signOut } from '@/gallery/lib/auth';

import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import ChangeUsernameDialog from './ChangeUsernameDialog';
import WelcomeDialog from './WelcomeDialog';

import './UserMenu.css';

// `welcome` is false where the page asks about the username itself.
type Props = {
  session: Session;
  welcome: boolean;
  locale: Locale;
  t: Translate;
};

/**
 * The account's username, opening its menu. Welcomes a new account once.
 */
export default function UserMenu({ session, welcome, locale, t }: Props) {
  const { account } = session;
  const [open, setOpen] = useState(false);
  const [changingName, setChangingName] = useState(false);
  const [welcomeSeen, markWelcomeSeen] = useWelcomeSeen(account.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div class="user-menu">
      <button
        class="user-menu-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span class="user-menu-name">{account.username}</span>

        <ChevronDownIcon />
      </button>

      {open && (
        <>
          <div class="user-menu-scrim" onClick={() => setOpen(false)} />

          <div class="user-menu-list" role="menu">
            <a
              role="menuitem"
              class="user-menu-item user-menu-mine"
              href={localizePath(locale, '/mine')}
            >
              {t('Your styles')}
            </a>

            <button
              role="menuitem"
              class="user-menu-item"
              onClick={() => {
                setOpen(false);
                setChangingName(true);
              }}
            >
              {t('Change username')}
            </button>

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

      {welcome &&
        !account.usernameConfirmed &&
        !welcomeSeen &&
        !changingName && (
          <WelcomeDialog
            account={account}
            session={session.session}
            onChange={() => {
              markWelcomeSeen();
              setChangingName(true);
            }}
            onClose={() => markWelcomeSeen()}
            t={t}
          />
        )}

      {changingName && (
        <ChangeUsernameDialog
          account={account}
          session={session.session}
          onClose={() => setChangingName(false)}
          t={t}
        />
      )}
    </div>
  );
}
