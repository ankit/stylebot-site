import { useState } from 'preact/hooks';

import { publishFromStylebot } from '@/gallery/lib/bridge';

/**
 * Asks Stylebot to publish its changes to a style. Stays busy once it has,
 * as Stylebot is taking the tab to /publish.
 */
export function usePublishFromStylebot(styleId: number) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const publish = async () => {
    setBusy(true);
    setFailed(false);

    if (!(await publishFromStylebot(styleId))) {
      setBusy(false);
      setFailed(true);
    }
  };

  return { publish, busy, failed };
}
