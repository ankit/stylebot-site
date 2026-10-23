import { type useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';

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
 * in its place and, where there's one, the tab's or the style's current one
 * to go back to.
 */
export default function ScreenshotPicker({ choice, alt, t }: Props) {
  const { source, preview } = choice;
  const captions = {
    tab: t('Captured from your tab. Check it shows nothing private.'),
    current: t('The style’s current screenshot.'),
    upload: t('Your image. It’s uploaded when you publish.'),
    none: t('Upload a screenshot of the site with the style on.'),
  };
  let tabLabel = t('Use the screenshot of your tab');
  let uploadLabel = t('Replace image');
  let uploadClass = 'screenshot-picker-replace';

  if (choice.canKeepCurrent) {
    tabLabel = t('Use a new screenshot of your tab');
  }

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

      <div class="screenshot-picker-frame">
        {preview && <img src={preview} alt={alt} />}

        <label class={uploadClass}>
          {uploadLabel}
          <input
            type="file"
            class="sr-only"
            accept="image/png,image/jpeg,image/webp"
            onChange={onChange}
          />
        </label>
      </div>

      <figcaption>{captions[source]}</figcaption>

      {choice.tooLarge && (
        <p class="screenshot-picker-error" role="alert">
          {t('Choose an image under 1 MB.')}
        </p>
      )}

      {choice.canUseTab && source !== 'tab' && (
        <button
          type="button"
          class="screenshot-picker-switch"
          onClick={() => choice.choose('tab')}
        >
          {tabLabel}
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
