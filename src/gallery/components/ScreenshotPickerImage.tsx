import { useState } from 'preact/hooks';

import { useRegionDraw } from '@/gallery/hooks/useRegionDraw';
import { type useScreenshotChoice } from '@/gallery/hooks/useScreenshotChoice';
import { blurRegions } from '@/gallery/lib/blur';

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
 * blur parts of it unless it's the style's current one.
 */
export default function ScreenshotPickerImage({ choice, src, alt, t }: Props) {
  const draw = useRegionDraw();
  const [busy, setBusy] = useState(false);

  if (!choice.canBlur) {
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

  const apply = async (close: () => void) => {
    setBusy(true);

    try {
      choice.upload(await blurRegions(src, draw.regions));
      close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ZoomableImage
      class="screenshot-picker-image"
      src={src}
      alt={alt}
      t={t}
      renderZoomed={(close) => (
        <ScreenshotBlur
          src={src}
          alt={alt}
          draw={draw}
          busy={busy}
          onApply={() => apply(close)}
          t={t}
        />
      )}
    />
  );
}
