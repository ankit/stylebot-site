import { useBlurKeys } from '@/gallery/hooks/useBlurKeys';
import { type useRegionDraw } from '@/gallery/hooks/useRegionDraw';
import { type Region } from '@/gallery/lib/blur';

import CloseIcon from '@/components/icons/CloseIcon';

import { type Translate } from '@/i18n/t';

import './ScreenshotBlur.css';

type Props = {
  src: string;
  alt: string;
  draw: ReturnType<typeof useRegionDraw>;
  // The regions `src` is already blurred over.
  blurred: Array<Region>;
  onDone: () => void;
  t: Translate;
};

const percent = (fraction: number) => `${fraction * 100}%`;

function regionClass(pending: boolean) {
  if (pending) {
    return 'screenshot-blur-region is-pending';
  }

  return 'screenshot-blur-region';
}

function regionStyle(region: Region) {
  return {
    left: percent(region.x),
    top: percent(region.y),
    width: percent(region.width),
    height: percent(region.height),
  };
}

/**
 * The screenshot full size, as it'll be published, with the areas dragged
 * out over it outlined, each with a button to remove it. Areas it isn't
 * blurred over yet are blurred in the page until it is.
 */
export default function ScreenshotBlur({
  src,
  alt,
  draw,
  blurred,
  onDone,
  t,
}: Props) {
  useBlurKeys(draw, onDone);

  return (
    <div class="screenshot-blur">
      <div class="screenshot-blur-canvas" {...draw.handlers}>
        <img src={src} alt={alt} draggable={false} />

        {draw.regions.map((region, i) => (
          <span
            key={i}
            class={regionClass(!blurred.includes(region))}
            style={regionStyle(region)}
          >
            <button
              type="button"
              class="screenshot-blur-remove"
              aria-label={t('Remove this area')}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => draw.remove(i)}
            >
              <CloseIcon size={10} strokeWidth={1.8} />
            </button>
          </span>
        ))}

        {draw.drawing && (
          <span class={regionClass(true)} style={regionStyle(draw.drawing)} />
        )}
      </div>

      <div class="screenshot-blur-bar">
        <span>{t('Drag over anything private to blur it.')}</span>

        <button type="button" class="screenshot-blur-apply" onClick={onDone}>
          {
            // i18n: Closes the full-size screenshot, keeping the areas marked to blur.
            t('Done')
          }
        </button>
      </div>
    </div>
  );
}
