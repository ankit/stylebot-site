import { useState } from 'preact/hooks';

import { useArrowKeys } from '@/gallery/hooks/useArrowKeys';
import {
  resizedScreenshotUrl,
  screenshotSrcset,
  screenshotUrl,
} from '@/gallery/lib/api';

import ZoomableImage from '@/components/ZoomableImage';

import { type Catalog, type Translate } from '@/i18n/t';

import './StyleScreenshots.css';

// Beside the details it grows to about 707px; below 900px it takes the width.
const SHOT_SIZES = '(min-width: 900px) 707px, calc(100vw - 32px)';

// The API doesn't give the original's width, but screenshots are usually about
// 2600px wide, so a Retina screen takes the original once 960 would blur.
const ORIGINAL_WIDTH = 2560;

type Props = {
  screenshots: Array<string>;
  alt: string;
  strings: Catalog;
  t: Translate;
};

/**
 * A style's screenshot large, which zooms, with small ones under it to switch
 * between when it has two, as the arrow keys do while it's zoomed.
 */
export default function StyleScreenshots({
  screenshots,
  alt,
  strings,
  t,
}: Props) {
  const [shown, setShown] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const path = screenshots[shown] ?? screenshots[0];

  useArrowKeys(zoomed, shown, screenshots.length, setShown);

  return (
    <div class="style-screenshots">
      <ZoomableImage
        class="style-page-shot"
        src={resizedScreenshotUrl(path, 960)}
        srcset={`${screenshotSrcset(path)}, ${screenshotUrl(path)} ${ORIGINAL_WIDTH}w`}
        sizes={SHOT_SIZES}
        full={screenshotUrl(path)}
        alt={alt}
        zoomed={zoomed}
        onZoomChange={setZoomed}
        strings={strings}
      />

      {screenshots.length > 1 && (
        <div class="style-screenshots-thumbs">
          {screenshots.map((thumb, i) => (
            <button
              key={thumb}
              type="button"
              class="style-screenshots-thumb"
              aria-pressed={i === shown}
              // i18n: A small screenshot under the large one; {number} is 1 or 2.
              aria-label={t('Show screenshot {number}', { number: i + 1 })}
              onClick={() => setShown(i)}
            >
              <img src={resizedScreenshotUrl(thumb, 480)} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
