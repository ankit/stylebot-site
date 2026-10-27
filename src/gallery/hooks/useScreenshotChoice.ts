import { useEffect, useState } from 'preact/hooks';

import { resizedScreenshotUrl, screenshotUrl } from '@/gallery/lib/api';
import { blurRegions, type Region } from '@/gallery/lib/blur';

// The API takes screenshots up to 1 MB.
const MAX_BYTES = 1024 * 1024;

export const SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export type ScreenshotError = 'tooLarge' | 'wrongType';

// `tab` is the screenshot Stylebot took of the person's tab, `current` keeps
// the style's own, and `none` leaves the slot empty.
export type ScreenshotSource = 'tab' | 'current' | 'upload' | 'none';

// `original` blurred over `regions`, which it was made for.
type Blurred = {
  original: string;
  regions: Array<Region>;
  file: File;
  url: string;
};

// An update keeps the style's screenshot unless the author picks another.
function initialSource(tabShot: string | null, current: string | undefined) {
  if (current) {
    return 'current';
  }

  if (tabShot) {
    return 'tab';
  }

  return 'none';
}

/**
 * One slot's screenshot: the tab's, the style's `current` one, a picked image
 * or none. `screenshot` is a new image to send, unset while it's `pending`
 * blurring, and `kept` the current one's path.
 */
export function useScreenshotChoice(
  tabShot: string | null,
  current: string | undefined,
) {
  const [source, setSource] = useState<ScreenshotSource>(() =>
    initialSource(tabShot, current),
  );
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [error, setError] = useState<ScreenshotError>();
  const [regions, setRegions] = useState<Array<Region>>([]);
  const [blurred, setBlurred] = useState<Blurred>();
  let original: string | undefined;

  if (source === 'tab' && tabShot) {
    original = tabShot;
  } else if (source === 'upload') {
    original = fileUrl;
  }

  useEffect(() => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    setFileUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!original || regions.length === 0) {
      setBlurred(undefined);

      return;
    }

    let live = true;

    blurRegions(original, regions).then((file) => {
      if (live) {
        setBlurred({ original, regions, file, url: URL.createObjectURL(file) });
      }
    });

    return () => {
      live = false;
    };
  }, [original, regions]);

  // Each copy stays shown until the next is ready, so it's revoked only then.
  useEffect(() => {
    const url = blurred?.url;

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [blurred]);

  const upload = (picked: File) => {
    if (!SCREENSHOT_TYPES.includes(picked.type)) {
      setError('wrongType');

      return;
    }

    if (picked.size > MAX_BYTES) {
      setError('tooLarge');

      return;
    }

    setError(undefined);
    setRegions([]);
    setFile(picked);
    setSource('upload');
  };

  const choose = (next: 'tab' | 'current') => {
    setError(undefined);
    setRegions([]);
    setSource(next);
  };

  const remove = () => {
    setError(undefined);
    setRegions([]);
    setFile(undefined);
    setSource('none');
  };

  let latest: Blurred | undefined;

  if (blurred?.original === original) {
    latest = blurred;
  }

  const ready = latest?.regions === regions;
  const pending = regions.length > 0 && !ready;

  let preview: string | undefined;
  let full: string | undefined;
  let screenshot: Blob | string | undefined;
  let kept: string | undefined;

  if (latest && ready) {
    preview = latest.url;
    screenshot = latest.file;
  } else if (source === 'tab' && tabShot) {
    preview = tabShot;
    screenshot = tabShot;
  } else if (source === 'upload') {
    preview = fileUrl;
    screenshot = file;
  } else if (source === 'current' && current) {
    preview = resizedScreenshotUrl(current, 960);
    full = screenshotUrl(current);
    kept = current;
  }

  if (pending) {
    screenshot = undefined;
  }

  return {
    source,
    preview,
    full,
    screenshot,
    kept,
    original,
    blurred: latest?.url,
    blurredRegions: latest?.regions ?? [],
    regions,
    setRegions,
    pending,
    error,
    // The style's current screenshot is on the API, which a canvas can't read.
    canBlur: source === 'tab' || source === 'upload',
    canUseTab: tabShot !== null,
    canKeepCurrent: current !== undefined,
    upload,
    choose,
    remove,
  };
}
