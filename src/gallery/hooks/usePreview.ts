import { useEffect, useState } from 'preact/hooks';

import {
  getInstalledStyles,
  hasStylebot,
  listenForInstall,
  previewInStylebot,
} from '@/gallery/lib/bridge';

type PreviewState =
  | { status: 'checking' }
  | { status: 'idle' }
  | { status: 'opening' }
  | { status: 'opened' }
  | { status: 'failed' }
  | { status: 'installed'; profile: string };

/**
 * Opens a style's preview in Stylebot, and knows when the style is installed,
 * whether before this page opened or from the preview.
 */
export function usePreview(styleId: number) {
  const [state, setState] = useState<PreviewState>({ status: 'checking' });

  useEffect(() => {
    if (!hasStylebot()) {
      return;
    }

    getInstalledStyles([styleId]).then((installed) => {
      const profile = installed[styleId];

      if (profile) {
        setState({ status: 'installed', profile });
      } else {
        setState({ status: 'idle' });
      }
    });
  }, [styleId]);

  useEffect(
    () =>
      listenForInstall(styleId, (profile) =>
        setState({ status: 'installed', profile }),
      ),
    [styleId],
  );

  const preview = async () => {
    setState({ status: 'opening' });

    if (await previewInStylebot(styleId)) {
      setState({ status: 'opened' });
    } else {
      setState({ status: 'failed' });
    }
  };

  return { state, preview };
}
