import { useEffect, useState } from 'preact/hooks';

import { type OwnStyle, resizedScreenshotUrl } from '@/gallery/lib/api';

// The API takes screenshots up to 1 MB.
const MAX_BYTES = 1024 * 1024;

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
  const [tooLarge, setTooLarge] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    setFileUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upload = (picked: File) => {
    if (picked.size > MAX_BYTES) {
      setTooLarge(true);

      return;
    }

    setTooLarge(false);
    setFile(picked);
    setSource('upload');
  };

  const choose = (next: 'tab' | 'current') => {
    setTooLarge(false);
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
    tooLarge,
    canUseTab: tabShot !== null,
    canKeepCurrent: existing !== null,
    upload,
    choose,
  };
}
