import { useFileDrop } from '@/gallery/hooks/useFileDrop';
import {
  SCREENSHOT_TYPES,
  type useScreenshotChoice,
} from '@/gallery/hooks/useScreenshotChoice';

import { buttonClass } from '@/components/Button';

import { type Translate } from '@/i18n/t';

import './ScreenshotPicker.css';

type Props = {
  choice: ReturnType<typeof useScreenshotChoice>;
  alt: string;
  t: Translate;
};

/**
 * The screenshot to publish, saying where it's from, with an image to upload
 * or drop in its place and, where there's one, the tab's or the style's current one
 * to go back to.
 */
export default function ScreenshotPicker({ choice, alt, t }: Props) {
  const { source, preview } = choice;
  const drop = useFileDrop(choice.upload);
  let uploadLabel = t('Replace image');
  let uploadClass = 'screenshot-picker-replace';

  if (!preview) {
    uploadLabel = t('Upload an image');
    uploadClass = buttonClass({ variant: 'outline', size: 'sm' });
  }

  const onChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const picked = input.files?.[0];

    if (picked) {
      choice.upload(picked);
    }

    input.value = '';
  };

  return (
    <figure class="screenshot-picker">
      <span class="screenshot-picker-label">
        {
          // i18n: The label above the image published with a style.
          t('Screenshot')
        }
      </span>

      <div
        class="screenshot-picker-frame"
        data-over={drop.over || undefined}
        {...drop.handlers}
      >
        {preview && <img src={preview} alt={alt} />}

        <div class="screenshot-picker-upload">
          <label class={uploadClass}>
            {uploadLabel}
            <input
              type="file"
              class="sr-only"
              accept={SCREENSHOT_TYPES.join(',')}
              onChange={onChange}
            />
          </label>

          {!preview && (
            <span class="screenshot-picker-hint">
              {
                // i18n: Under the "Upload an image" button, in the empty
                // screenshot frame.
                t('or drop one here')
              }
            </span>
          )}
        </div>
      </div>

      {source === 'tab' && (
        <figcaption>
          {t('Captured from your tab. Check it shows nothing private.')}
        </figcaption>
      )}

      {choice.error === 'tooLarge' && (
        <p class="screenshot-picker-error" role="alert">
          {t('Choose an image under 1 MB.')}
        </p>
      )}

      {choice.error === 'wrongType' && (
        <p class="screenshot-picker-error" role="alert">
          {t('Choose a PNG, JPEG or WebP image.')}
        </p>
      )}

      {choice.canUseTab && source !== 'tab' && (
        <button
          type="button"
          class="screenshot-picker-switch"
          onClick={() => choice.choose('tab')}
        >
          {t('Use the screenshot of your tab')}
        </button>
      )}

      {choice.canKeepCurrent && source !== 'current' && (
        <button
          type="button"
          class="screenshot-picker-switch"
          onClick={() => choice.choose('current')}
        >
          {t('Keep the current screenshot')}
        </button>
      )}
    </figure>
  );
}
