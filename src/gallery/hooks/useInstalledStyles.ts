import { useEffect, useRef, useState } from 'preact/hooks';

import { getInstalledStyles, hasStylebot } from '@/gallery/lib/bridge';

/**
 * The profile each of these styles is installed as in Stylebot, by style id.
 * Asks only about ids it hasn't asked about yet, so a growing list costs one
 * request per page of it.
 */
export function useInstalledStyles(styleIds: Array<number>) {
  const [installed, setInstalled] = useState<Record<string, string>>({});
  const asked = useRef(new Set<number>());
  const key = styleIds.join(',');

  useEffect(() => {
    const ids = styleIds.filter((id) => !asked.current.has(id));

    if (!ids.length || !hasStylebot()) {
      return;
    }

    ids.forEach((id) => asked.current.add(id));
    getInstalledStyles(ids).then((found) =>
      setInstalled((prev) => ({ ...prev, ...found })),
    );
    // The ids' contents say when the list changed, not the array itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return installed;
}
