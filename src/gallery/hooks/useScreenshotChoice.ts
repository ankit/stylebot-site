import { useEffect, useState } from 'preact/hooks';

import { type OwnStyle, resizedScreenshotUrl } from '@/gallery/lib/api';

// The API takes screenshots up to 1 MB.
const MAX_BYTES = 1024 * 1024;

export const SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export type ScreenshotError = 'tooLarge' | 'wrongType';

// `tab` is the screenshot Stylebot took of the person's tab, `current` keeps
// the style's own, and `none` is a new style still without one.
export type ScreenshotSource = 'tab' | 'current' | 'upload' | 'none';

// An update keeps the style's screenshot unless the author picks another.
function initialSource(tabShot: string | null, existing: OwnStyle | null) {
  if (existing) {
    return 'current';
  }

  if (tabShot) {
    return 'tab';
  }

  return 'none';
}

/**
 * Which screenshot to publish: `tabShot`, the one Stylebot took of the
 * person's tab, the style's current one, or an image they pick, which stays
 * in the browser until they publish. `screenshot` is what to send, if anything.
 */
export function useScreenshotChoice(
  tabShot: string | null,
  existing: OwnStyle | null,
) {
  const [source, setSource] = useState<ScreenshotSource>(() =>
    initialSource(tabShot, existing),
  );
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [error, setError] = useState<ScreenshotError>();

  useEffect(() => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    setFileUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

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
    setFile(picked);
    setSource('upload');
  };

  const choose = (next: 'tab' | 'current') => {
    setError(undefined);
    setSource(next);
  };

  let preview: string | undefined;
  let screenshot: Blob | string | undefined;

  if (source === 'tab' && tabShot) {
    preview = tabShot;
    screenshot = tabShot;
  } else if (source === 'upload') {
    preview = fileUrl;
    screenshot = file;
  } else if (source === 'current' && existing) {
    preview = resizedScreenshotUrl(existing, 960);
  }

  return {
    source,
    preview,
    screenshot,
    error,
    canUseTab: tabShot !== null,
    canKeepCurrent: existing !== null,
    upload,
    choose,
  };
}
