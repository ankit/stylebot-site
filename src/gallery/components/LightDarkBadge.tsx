import { type LightDark } from '@/gallery/lib/styleOptions';

import ContrastIcon from '@/components/icons/ContrastIcon';
import Tooltip from '@/components/Tooltip';

import { type Translate } from '@/i18n/t';

import './LightDarkBadge.css';

type Props = { kind: LightDark; site: string; t: Translate };

/**
 * Says a style has light and dark versions, with how to switch between them
 * in a tooltip.
 */
export default function LightDarkBadge({ kind, site, t }: Props) {
  // i18n: On a style that switches between light and dark in Stylebot's popup.
  let how = t('Switch between them in Stylebot’s popup.');

  if (kind === 'site') {
    // i18n: On a style that follows the site's own light/dark setting, such as claude.ai's.
    how = t('Follows {site}’s own light and dark setting.', { site });
  }

  // i18n: A badge on a style that has both a light and a dark version.
  const label = t('Light and dark');

  return (
    <span
      class="light-dark-badge"
      tabIndex={0}
      role="note"
      aria-label={`${label}. ${how}`}
    >
      <ContrastIcon size={11} />
      {label}
      <Tooltip>{how}</Tooltip>
    </span>
  );
}
