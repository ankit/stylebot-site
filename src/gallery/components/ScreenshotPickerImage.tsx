import { useRegionDraw } from '@/gallery/hooks/useRegionDraw';
import { type useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';

import ZoomableImage from '@/components/ZoomableImage';

import { type Translate } from '@/i18n/t';

import ScreenshotBlur from './ScreenshotBlur';

type Props = {
  choice: ReturnType<typeof useScreenshotChoice>;
  src: string;
  alt: string;
  t: Translate;
};

/**
 * The screenshot in the picker, which opens full size, where the author can
 * mark parts of it to blur unless it's the style's current one.
 */
export default function ScreenshotPickerImage({ choice, src, alt, t }: Props) {
  const draw = useRegionDraw(choice.regions, choice.setRegions);

  if (!choice.canBlur || !choice.original) {
    return (
      <ZoomableImage
        class="screenshot-picker-image"
        src={src}
        full={choice.full}
        alt={alt}
        t={t}
      />
    );
  }

  const shown = choice.blurred ?? choice.original;

  return (
    <ZoomableImage
      class="screenshot-picker-image"
      src={src}
      alt={alt}
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
