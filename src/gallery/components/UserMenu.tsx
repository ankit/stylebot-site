import { useState } from 'preact/hooks';

import { useWelcomeSeen } from '@/gallery/hooks/useWelcomeSeen';
import { type Session } from '@/gallery/lib/api';
import { signOut } from '@/gallery/lib/auth';

import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import Menu from '@/components/Menu';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import ChangeUsernameDialog from './ChangeUsernameDialog';
import WelcomeDialog from './WelcomeDialog';

import './UserMenu.css';

type Props = { session: Session; locale: Locale; t: Translate };

/**
 * The account's username, opening its menu. Welcomes a new account once.
 */
export default function UserMenu({ session, locale, t }: Props) {
  const { account } = session;
  const [changingName, setChangingName] = useState(false);
  const [welcomeSeen, markWelcomeSeen] = useWelcomeSeen(account.id);

  return (
    <div class="user-menu">
      <Menu
        buttonClass="user-menu-button"
        button={
          <>
            <span class="user-menu-name">{account.username}</span>

            <ChevronDownIcon />
          </>
        }
      >
        <a
          role="menuitem"
          class="menu-item user-menu-mine"
          href={localizePath(locale, '/mine')}
        >
          {t('Your styles')}
        </a>

        <button
          role="menuitem"
          class="menu-item"
          onClick={() => setChangingName(true)}
        >
          {t('Change username')}
        </button>

        <button role="menuitem" class="menu-item" onClick={() => signOut()}>
          {t('Sign out')}
        </button>
      </Menu>

      {!account.usernameConfirmed && !welcomeSeen && !changingName && (
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
