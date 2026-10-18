import { useState } from 'preact/hooks';

import Modal from '@/components/Modal';

import { type Catalog, translator } from '@/i18n/t';

import './ZoomableImage.css';

type Props = {
  src: string;
  alt: string;
  srcset?: string;
  width?: number;
  height?: number;
  class?: string;
  // The original file to show zoomed, when `src` is a smaller copy.
  full?: string;
  // The original's width in pixels, so a retina screen never stretches it.
  fullWidth?: number;
  strings: Catalog;
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
  width,
  height,
  class: className = '',
  full,
  fullWidth,
  strings,
}: Props) {
  const t = translator(strings);
  const [zoomed, setZoomed] = useState(false);

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
        onClose={() => setZoomed(false)}
        label={t('Enlarged screenshot')}
        closeLabel={t('Close')}
        class="zoomable-image-modal"
      >
        {zoomed && (
          <img
            class="zoomable-image-full"
            src={full ?? src}
            alt={alt}
            style={{ maxWidth: zoomedWidth(fullWidth) }}
            onClick={() => setZoomed(false)}
          />
        )}
      </Modal>
    </>
  );
}
