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
 * switch between the cover and the others, and a prompt to blur.
 */
export default function ScreenshotPicker({ choices, alt, t }: Props) {
  const { cover, listed, shown } = choices;
  const [zoomed, setZoomed] = useState(false);
  // i18n: The label above the images published with a style.
  const label = t('Screenshots');
  const isCover = shown.id === cover.id;
  let number = listed.indexOf(shown) + 1;
  let emptyLabel = t('Upload an image');

  if (number === 0) {
    number = listed.length + 1;
  }

  if (!isCover) {
    // i18n: Adds another screenshot beside the cover.
    emptyLabel = t('Add image');
  }

  return (
    <div class="screenshot-picker" role="group" aria-label={label}>
      <div class="screenshot-picker-head">
        <span aria-hidden="true">{label}</span>

        {shown.preview && (
          <ScreenshotSlotMenu
            choice={shown}
            number={number}
            onBlur={() => setZoomed(true)}
            t={t}
          >
            {!isCover && (
              <>
                <button
                  type="button"
                  role="menuitem"
                  class="menu-item"
                  onClick={() => choices.makeCover(shown.id)}
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
                  onClick={shown.remove}
                >
                  {
                    // i18n: Removes a screenshot other than the cover from the style.
                    t('Remove')
                  }
                </button>
              </>
            )}
          </ScreenshotSlotMenu>
        )}
      </div>

      <ScreenshotSlot
        key={shown.id}
        choice={shown}
        alt={alt}
        emptyLabel={emptyLabel}
        zoomed={zoomed}
        onZoomChange={setZoomed}
        t={t}
      />

      {cover.preview && <ScreenshotThumbnails choices={choices} t={t} />}

      {shown.canBlur && shown.original && (
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
