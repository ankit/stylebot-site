import { type UsernameCheck } from '@/gallery/lib/api';

import CheckIcon from '@/components/icons/CheckIcon';

import { type Translate } from '@/i18n/t';

import './UsernameStatus.css';

type Props = {
  check: UsernameCheck | undefined;
  onUse: (username: string) => void;
  t: Translate;
};

/**
 * Whether a username can be taken, with a free one to use instead when it's
 * taken.
 */
export default function UsernameStatus({ check, onUse, t }: Props) {
  if (!check) {
    return <p class="username-status" />;
  }

  if (check.available) {
    return (
      <p class="username-status is-available">
        <CheckIcon size={12} />
        {t('Available')}
      </p>
    );
  }

  if (check.reason === 'invalid') {
    return (
      <p class="username-status">
        {t(
          'Use 3 to 30 lowercase letters and numbers, with single hyphens between them.',
        )}
      </p>
    );
  }

  if (check.reason === 'reserved') {
    return <p class="username-status">{t('That username is reserved.')}</p>;
  }

  return (
    <p class="username-status">
      {t('That username is taken.')}

      {check.suggestion && (
        <button type="button" onClick={() => onUse(check.suggestion!)}>
          {t('Use {username}', { username: check.suggestion })}
        </button>
      )}
    </p>
  );
}
