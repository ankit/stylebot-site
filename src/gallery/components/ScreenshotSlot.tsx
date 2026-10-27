import { useFileDrop } from '@/gallery/hooks/useFileDrop';
import { type ScreenshotChoice } from '@/gallery/hooks/useScreenshotChoices';

import { buttonClass } from '@/components/Button';

import { type Translate } from '@/i18n/t';

import ScreenshotSlotImage from './ScreenshotSlotImage';
import ScreenshotUploadButton from './ScreenshotUploadButton';

import './ScreenshotSlot.css';

type Props = {
  choice: ScreenshotChoice;
  alt: string;
  // The upload button's label while the slot is empty.
  emptyLabel: string;
  zoomed: boolean;
  onZoomChange: (zoomed: boolean) => void;
  t: Translate;
};

/**
 * One screenshot to publish, with an image to upload or drop in its place
 * and, where there's one, the tab's or the style's current one to go back to.
 */
export default function ScreenshotSlot({
  choice,
  alt,
  emptyLabel,
  zoomed,
  onZoomChange,
  t,
}: Props) {
  const { source, preview } = choice;
  const drop = useFileDrop(choice.upload);

  return (
    <figure class="screenshot-slot">
      <div
        class="screenshot-slot-frame"
        data-over={drop.over || undefined}
        {...drop.handlers}
      >
        {preview && (
          <ScreenshotSlotImage
            key={choice.original ?? preview}
            choice={choice}
            src={preview}
            alt={alt}
            zoomed={zoomed}
            onZoomChange={onZoomChange}
            t={t}
          />
        )}

        {!preview && (
          <div class="screenshot-slot-upload">
            <ScreenshotUploadButton
              label={emptyLabel}
              class={buttonClass({ variant: 'outline', size: 'sm' })}
              onUpload={choice.upload}
            />
          </div>
        )}
      </div>

      {choice.error === 'tooLarge' && (
        <p class="screenshot-slot-error" role="alert">
          {t('Choose an image under 1 MB.')}
        </p>
      )}

      {choice.error === 'wrongType' && (
        <p class="screenshot-slot-error" role="alert">
          {t('Choose a PNG, JPEG or WebP image.')}
        </p>
      )}

      {choice.canUseTab && source !== 'tab' && (
        <button
          type="button"
          class="screenshot-slot-action"
          onClick={() => choice.choose('tab')}
        >
          {t('Use the screenshot of your tab')}
        </button>
      )}

      {choice.canKeepCurrent && source !== 'current' && (
        <button
          type="button"
          class="screenshot-slot-action"
          onClick={() => choice.choose('current')}
        >
          {t('Keep the current screenshot')}
        </button>
      )}
    </figure>
  );
}
