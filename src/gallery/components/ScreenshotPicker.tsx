import { type useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';

import Button, { buttonClass } from '@/components/Button';

import { type Translate } from '@/i18n/t';

import './ScreenshotPicker.css';

type Props = {
  choice: ReturnType<typeof useScreenshotChoice>;
  alt: string;
  t: Translate;
};

/**
 * The screenshot to publish, saying where it's from, with an image to upload
 * instead and, where there's one, the tab's or the style's current one to go
 * back to.
 */
export default function ScreenshotPicker({ choice, alt, t }: Props) {
  const { source, preview } = choice;
  const captions = {
    tab: t(
      'Screenshot of your tab. Check it shows nothing private before you publish.',
    ),
    current: t('The style’s current screenshot.'),
    upload: t('Your image. It’s uploaded when you publish.'),
    none: t('Upload a screenshot of the site with the style on.'),
  };

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
      {preview && (
        <img class="screenshot-picker-image" src={preview} alt={alt} />
      )}

      {!preview && <div class="screenshot-picker-image" />}

      <figcaption>{captions[source]}</figcaption>

      {choice.tooLarge && (
        <p class="screenshot-picker-error" role="alert">
          {t('Choose an image under 1 MB.')}
        </p>
      )}

      <div class="screenshot-picker-actions">
        <label class={buttonClass({ variant: 'outline', size: 'sm' })}>
          {t('Upload an image')}
          <input
            type="file"
            class="sr-only"
            accept="image/png,image/jpeg,image/webp"
            onChange={onChange}
          />
        </label>

        {choice.canUseTab && source !== 'tab' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => choice.choose('tab')}
          >
            {t('Use the screenshot of your tab')}
          </Button>
        )}

        {choice.canKeepCurrent && source !== 'current' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => choice.choose('current')}
          >
            {t('Keep the current screenshot')}
          </Button>
        )}
      </div>
    </figure>
  );
}
