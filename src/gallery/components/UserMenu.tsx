import { useEffect, useState } from 'preact/hooks';

import { type Account } from '@/gallery/lib/api';
import { signOut } from '@/gallery/lib/auth';

import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './UserMenu.css';

type Props = { account: Account; locale: Locale; t: Translate };

/**
 * The signed-in account's name, opening a menu with its styles, for screens
 * too narrow for the header's links, and Sign out.
 */
export default function UserMenu({ account, locale, t }: Props) {
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

  // i18n: The account menu's label when the account has no display name.
  const name = account.name ?? t('Your account');

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
