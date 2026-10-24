import { type useRegionDraw } from '@/gallery/hooks/useRegionDraw';
import { type Region } from '@/gallery/lib/blur';

import { type Translate } from '@/i18n/t';

import './ScreenshotBlur.css';

type Props = {
  src: string;
  alt: string;
  draw: ReturnType<typeof useRegionDraw>;
  busy: boolean;
  onApply: () => void;
  t: Translate;
};

const percent = (fraction: number) => `${fraction * 100}%`;

function regionStyle(region: Region) {
  return {
    left: percent(region.x),
    top: percent(region.y),
    width: percent(region.width),
    height: percent(region.height),
  };
}

/**
 * The screenshot full size, with the areas dragged out over it marked to blur
 * until `onApply`.
 */
export default function ScreenshotBlur({
  src,
  alt,
  draw,
  busy,
  onApply,
  t,
}: Props) {
  const empty = draw.regions.length === 0;

  return (
    <div class="screenshot-blur">
      <div class="screenshot-blur-canvas" {...draw.handlers}>
        <img src={src} alt={alt} draggable={false} />

        {draw.regions.map((region, i) => (
          <span
            key={i}
            class="screenshot-blur-region"
            style={regionStyle(region)}
          />
        ))}

        {draw.drawing && (
          <span
            class="screenshot-blur-region"
            style={regionStyle(draw.drawing)}
          />
        )}
      </div>

      <div class="screenshot-blur-bar">
        <span>{t('Drag over anything private to blur it.')}</span>

        <button type="button" disabled={empty || busy} onClick={draw.undo}>
          {t('Undo')}
        </button>

        <button
          type="button"
          class="screenshot-blur-apply"
          disabled={empty || busy}
          onClick={onApply}
        >
          {t('Blur marked areas')}
        </button>
      </div>
    </div>
  );
}
