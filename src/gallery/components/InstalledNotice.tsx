import CheckIcon from '@/components/icons/CheckIcon';

import { type Translate } from '@/i18n/t';

import './InstalledNotice.css';

type Props = { profile: string; t: Translate };

/**
 * Says a style was installed, and the profile Stylebot saved it as.
 */
export default function InstalledNotice({ profile, t }: Props) {
  return (
    <div class="installed-notice" role="status">
      <CheckIcon size={16} />

      <div>
        <strong>{t('Installed')}</strong>
        <span>{t('Saved in Stylebot as “{name}”.', { name: profile })}</span>
      </div>
    </div>
  );
}
