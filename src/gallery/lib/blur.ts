/**
 * A rectangle on an image, as fractions of its width and height.
 */
export type Region = { x: number; y: number; width: number; height: number };

const QUALITY = 0.85;
const MIN_BLOCK = 16;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

// Each block becomes its average color. Blocks are taller than a line of
// text, so unlike a Gaussian blur nothing under them can be recovered.
function pixelate(
  context: CanvasRenderingContext2D,
  left: number,
  top: number,
  width: number,
  height: number,
  block: number,
) {
  const { data } = context.getImageData(left, top, width, height);

  for (let y = 0; y < height; y += block) {
    for (let x = 0; x < width; x += block) {
      const right = Math.min(x + block, width);
      const bottom = Math.min(y + block, height);
      const sum = [0, 0, 0, 0];

      for (let row = y; row < bottom; row++) {
        for (let column = x; column < right; column++) {
          const i = (row * width + column) * 4;

          sum[0] += data[i];
          sum[1] += data[i + 1];
          sum[2] += data[i + 2];
          sum[3] += data[i + 3];
        }
      }

      const count = (right - x) * (bottom - y);
      const [r, g, b, a] = sum.map((total) => Math.round(total / count));

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      context.fillRect(left + x, top + y, right - x, bottom - y);
    }
  }
}

function toBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('The canvas gave no image'));
        }
      },
      'image/webp',
      QUALITY,
    );
  });
}

/**
 * A copy of the image at `src` with each of `regions` pixelated past reading,
 * as WebP, or PNG where the browser can't encode WebP.
 */
export async function blurRegions(src: string, regions: Array<Region>) {
  const image = await loadImage(src);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('No canvas to blur on');
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.drawImage(image, 0, 0);

  const block = Math.max(MIN_BLOCK, Math.round(canvas.width / 64));

  for (const region of regions) {
    const left = Math.round(region.x * canvas.width);
    const top = Math.round(region.y * canvas.height);
    const width = Math.round(region.width * canvas.width);
    const height = Math.round(region.height * canvas.height);

    if (width > 0 && height > 0) {
      pixelate(context, left, top, width, height, block);
    }
  }

  const blob = await toBlob(canvas);

  return new File([blob], 'screenshot', { type: blob.type });
}
