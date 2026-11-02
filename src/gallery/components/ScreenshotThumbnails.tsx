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
 * shows, the first marked Cover, with a tile to add another while there's
 * room.
 */
export default function ScreenshotThumbnails({ choices, t }: Props) {
  return (
    <div class="screenshot-thumbnails">
      {choices.listed.map((choice, i) => (
        <div key={choice.id} class="screenshot-thumbnails-item">
          <button
            type="button"
            class="screenshot-thumbnails-thumb"
            aria-pressed={choices.shown.id === choice.id}
            aria-label={t('Show screenshot {number}', { number: i + 1 })}
            onClick={() => choices.show(choice.id)}
          >
            <img src={choice.preview} alt="" />
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
      ))}

      {choices.canAdd && <ScreenshotAddTile onAdd={choices.add} t={t} />}
    </div>
  );
}
