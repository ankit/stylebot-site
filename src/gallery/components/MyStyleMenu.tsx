import { useState } from 'preact/hooks';

import { type OwnStyle } from '@/gallery/lib/api';
import { editHref } from '@/gallery/lib/paths';

import MoreIcon from '@/components/icons/MoreIcon';
import Menu from '@/components/Menu';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import DeleteStyleDialog from './DeleteStyleDialog';

import './MyStyleMenu.css';

type Props = {
  style: OwnStyle;
  session: string;
  onDeleted: () => void;
  locale: Locale;
  t: Translate;
};

/**
 * The ⋯ button on one of the account's styles, opening Edit and Delete.
 */
export default function MyStyleMenu({
  style,
  session,
  onDeleted,
  locale,
  t,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div class="my-style-menu">
      <Menu
        buttonClass="my-style-menu-button"
        label={
          // i18n: The ⋯ button on one of your styles, opening Edit and Delete.
          t('More for {name}', { name: style.name })
        }
        button={<MoreIcon />}
      >
        <a role="menuitem" class="menu-item" href={editHref(locale, style)}>
          {t('Edit')}
        </a>

        <button
          role="menuitem"
          class="menu-item"
          onClick={() => setDeleting(true)}
        >
          {t('Delete')}
        </button>
      </Menu>

      {deleting && (
        <DeleteStyleDialog
          style={style}
          session={session}
          onDeleted={onDeleted}
          onClose={() => setDeleting(false)}
          t={t}
        />
      )}
    </div>
  );
}
