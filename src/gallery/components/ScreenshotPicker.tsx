import { useState } from 'preact/hooks';

import { type useScreenshotChoices } from '@/gallery/hooks/useScreenshotChoices';

import { type Translate } from '@/i18n/t';

import ScreenshotSlot from './ScreenshotSlot';
import ScreenshotSlotMenu from './ScreenshotSlotMenu';
import ScreenshotThumbnails from './ScreenshotThumbnails';

import './ScreenshotPicker.css';

type Props = {
  choices: ReturnType<typeof useScreenshotChoices>;
  alt: string;
  t: Translate;
};

/**
 * The screenshots to publish: one shown large with an Edit menu, thumbnails to
 * switch between the cover and an optional second, and a prompt to blur.
 */
export default function ScreenshotPicker({ choices, alt, t }: Props) {
  const { cover, second, shown } = choices;
  const [zoomed, setZoomed] = useState(false);
  // i18n: The label above the images published with a style.
  const label = t('Screenshots');
  let choice = cover;
  let number: 1 | 2 = 1;
  let emptyLabel = t('Upload an image');

  if (shown === 1) {
    choice = second;
    number = 2;
    // i18n: Adds a second screenshot beside the cover.
    emptyLabel = t('Add image');
  }

  return (
    <div class="screenshot-picker" role="group" aria-label={label}>
      <div class="screenshot-picker-head">
        <span aria-hidden="true">{label}</span>

        {choice.preview && (
          <ScreenshotSlotMenu
            choice={choice}
            number={number}
            onBlur={() => setZoomed(true)}
            t={t}
          >
            {shown === 1 && (
              <>
                <button
                  type="button"
                  role="menuitem"
                  class="menu-item"
                  onClick={choices.swap}
                >
                  {
                    // i18n: Makes this screenshot the style's first, the one
                    // shown on its card.
                    t('Make cover')
                  }
                </button>

                <button
                  type="button"
                  role="menuitem"
                  class="menu-item"
                  onClick={second.remove}
                >
                  {
                    // i18n: Removes the second screenshot from the style.
                    t('Remove')
                  }
                </button>
              </>
            )}
          </ScreenshotSlotMenu>
        )}
      </div>

      <ScreenshotSlot
        key={shown}
        choice={choice}
        alt={alt}
        emptyLabel={emptyLabel}
        zoomed={zoomed}
        onZoomChange={setZoomed}
        t={t}
      />

      {cover.preview && <ScreenshotThumbnails choices={choices} t={t} />}

      {choice.canBlur && choice.original && (
        <button
          type="button"
          class="screenshot-picker-blur"
          onClick={() => setZoomed(true)}
        >
          {
            // i18n: Under the screenshots, opens the shown one full size to
            // mark parts to blur, such as chat titles or email addresses.
            t('Blur anything private')
          }
        </button>
      )}
    </div>
  );
}
