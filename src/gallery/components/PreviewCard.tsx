import { usePreview } from '@/gallery/hooks/usePreview';
import { useStylebotAvailability } from '@/gallery/hooks/useStylebotAvailability';
import { type StyleWithCss } from '@/gallery/lib/api';

import Button from '@/components/Button';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import GetStylebotCard from './GetStylebotCard';
import InstalledNotice from './InstalledNotice';

import './PreviewCard.css';

type Props = { style: StyleWithCss; locale: Locale; t: Translate };

/**
 * Previews the style on its site in Stylebot, which offers to install it
 * there, or offers Stylebot to someone who doesn't have it.
 */
export default function PreviewCard({ style, locale, t }: Props) {
  const availability = useStylebotAvailability();
  const { state, preview } = usePreview(style.id);

  if (availability === 'unavailable') {
    return <GetStylebotCard locale={locale} t={t} />;
  }

  if (availability === 'checking' || state.status === 'checking') {
    return <div class="preview-card-placeholder" aria-hidden="true" />;
  }

  if (state.status === 'installed') {
    return <InstalledNotice profile={state.profile} t={t} />;
  }

  const opening = state.status === 'opening';

  return (
    <div class="preview-card">
      <Button disabled={opening} onClick={preview}>
        {t('Preview on {site}', { site: style.site })}
      </Button>

      {state.status === 'opened' && (
        <p role="status">
          {t('Opened in a new tab. If you like it, install it from there.')}
        </p>
      )}

      {state.status === 'failed' && (
        <p role="alert">{t('Couldn’t open the preview. Try again.')}</p>
      )}
    </div>
  );
}
