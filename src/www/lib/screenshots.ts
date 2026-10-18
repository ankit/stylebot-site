import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/**
 * Image props that keep UI text crisp: PNGs stay lossless and other formats
 * are re-encoded at full quality.
 */
export function crisp(src: ImageMetadata) {
  return {
    format: src.format === 'png' ? 'png' : 'webp',
    quality: 100,
  } as const;
}

/**
 * A ZoomableImage's props for a screenshot shown `width` pixels wide, at 1x
 * and 2x, that zooms to the original file.
 */
export async function screenshot(src: ImageMetadata, width: number) {
  const image = await getImage({
    src,
    width,
    densities: [1, 2],
    ...crisp(src),
  });

  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
    full: src.src,
    fullWidth: src.width,
  };
}
