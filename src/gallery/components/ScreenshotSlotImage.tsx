import { useRegionDraw } from '@/gallery/hooks/useRegionDraw';
import { type ScreenshotChoice } from '@/gallery/hooks/useScreenshotChoices';

import ZoomableImage from '@/components/ZoomableImage';

import { type Translate } from '@/i18n/t';

import ScreenshotBlur from './ScreenshotBlur';

type Props = {
  choice: ScreenshotChoice;
  src: string;
  alt: string;
  zoomed: boolean;
  onZoomChange: (zoomed: boolean) => void;
  t: Translate;
};

/**
 * A screenshot in the picker, which opens full size, where the author can
 * mark parts of it to blur unless it's the style's current one.
 */
export default function ScreenshotSlotImage({
  choice,
  src,
  alt,
  zoomed,
  onZoomChange,
  t,
}: Props) {
  const draw = useRegionDraw(choice.regions, choice.setRegions);

  if (!choice.canBlur || !choice.original) {
    return (
      <ZoomableImage
        class="screenshot-slot-image"
        src={src}
        full={choice.full}
        alt={alt}
        zoomed={zoomed}
        onZoomChange={onZoomChange}
        t={t}
      />
    );
  }

  const shown = choice.blurred ?? choice.original;

  return (
    <ZoomableImage
      class="screenshot-slot-image"
      src={src}
      alt={alt}
      zoomed={zoomed}
      onZoomChange={onZoomChange}
      t={t}
      renderZoomed={(close) => (
        <ScreenshotBlur
          src={shown}
          alt={alt}
          draw={draw}
          blurred={choice.blurredRegions}
          onDone={close}
          t={t}
        />
      )}
    />
  );
}
