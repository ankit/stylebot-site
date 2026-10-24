import { type ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import Modal from '@/components/Modal';

import { type Catalog, type Translate, translator } from '@/i18n/t';

import './ZoomableImage.css';

type Props = {
  src: string;
  alt: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
  class?: string;
  // The original file to show zoomed, when `src` is a smaller copy.
  full?: string;
  // The original's width in pixels, so a retina screen never stretches it.
  fullWidth?: number;
  // What to show zoomed in place of the image, given a way to close it.
  renderZoomed?: (close: () => void) => ComponentChildren;
  // Islands pass `strings`; a Preact parent that already has `t` passes that.
  strings?: Catalog;
  t?: Translate;
};

function zoomedWidth(fullWidth?: number) {
  if (!fullWidth) {
    return undefined;
  }

  return `min(1400px, 100%, ${fullWidth / devicePixelRatio}px)`;
}

/**
 * A screenshot that opens full size when it's clicked, or Enter or Space is
 * pressed on it, until Escape or a click closes it.
 */
export default function ZoomableImage({
  src,
  alt,
  srcset,
  sizes,
  width,
  height,
  class: className = '',
  full,
  fullWidth,
  renderZoomed,
  strings,
  t = translator(strings),
}: Props) {
  const [zoomed, setZoomed] = useState(false);
  const close = () => setZoomed(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setZoomed(true);
    }
  };

  return (
    <>
      <img
        class={`zoomable-image ${className}`}
        src={src}
        srcset={srcset}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        tabIndex={0}
        role="button"
        onClick={() => setZoomed(true)}
        onKeyDown={onKeyDown}
      />

      <Modal
        open={zoomed}
        onClose={close}
        label={t('Enlarged screenshot')}
        closeLabel={t('Close')}
        class="zoomable-image-modal"
      >
        {zoomed && renderZoomed?.(close)}

        {zoomed && !renderZoomed && (
          <img
            class="zoomable-image-full"
            src={full ?? src}
            alt={alt}
            style={{ maxWidth: zoomedWidth(fullWidth) }}
            onClick={close}
          />
        )}
      </Modal>
    </>
  );
}
