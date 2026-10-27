import { type useScreenshotChoices } from '@/gallery/hooks/useScreenshotChoices';

import { type Translate } from '@/i18n/t';

import ScreenshotAddTile from './ScreenshotAddTile';

import './ScreenshotThumbnails.css';

type Props = {
  choices: ReturnType<typeof useScreenshotChoices>;
  t: Translate;
};

/**
 * Small copies of the screenshots under the large one, to pick which it
 * shows, the first marked Cover, with a tile to add a second while there's
 * none.
 */
export default function ScreenshotThumbnails({ choices, t }: Props) {
  const previews = [choices.cover.preview, choices.second.preview];

  return (
    <div class="screenshot-thumbnails">
      {previews.map(
        (preview, i) =>
          preview && (
            <div key={i} class="screenshot-thumbnails-item">
              <button
                type="button"
                class="screenshot-thumbnails-thumb"
                aria-pressed={choices.shown === i}
                aria-label={t('Show screenshot {number}', { number: i + 1 })}
                onClick={() => choices.show(i as 0 | 1)}
              >
                <img src={preview} alt="" />
              </button>

              {i === 0 && (
                <span class="screenshot-thumbnails-label">
                  {
                    // i18n: Under the thumbnail of the screenshot shown on
                    // the style's card.
                    t('Cover')
                  }
                </span>
              )}
            </div>
          ),
      )}

      {!choices.second.preview && (
        <ScreenshotAddTile onAdd={choices.add} t={t} />
      )}
    </div>
  );
}
