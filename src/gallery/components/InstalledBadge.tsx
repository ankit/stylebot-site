import CheckIcon from '@/components/icons/CheckIcon';

import { type Translate } from '@/i18n/t';

import './InstalledBadge.css';

export default function InstalledBadge({ t }: { t: Translate }) {
  return (
    <span class="installed-badge">
      <CheckIcon size={11} />
      {t('Installed')}
    </span>
  );
}
