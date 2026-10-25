import { useEffect, useRef, useState } from 'preact/hooks';

import {
  getStyleStatus,
  hasStylebot,
  type PublishedStatus,
} from '@/gallery/lib/bridge';

/**
 * The published status of each of these styles that Stylebot has a profile
 * published as, by style id. Asks only about ids it hasn't asked about yet.
 */
export function usePublishedStyles(styleIds: Array<number>) {
  const [published, setPublished] = useState<Record<string, PublishedStatus>>(
    {},
  );
  const asked = useRef(new Set<number>());
  const key = styleIds.join(',');

  useEffect(() => {
    const ids = styleIds.filter((id) => !asked.current.has(id));

    if (!ids.length || !hasStylebot()) {
      return;
    }

    ids.forEach((id) => asked.current.add(id));
    getStyleStatus(ids).then((found) =>
      setPublished((prev) => ({ ...prev, ...found.published })),
    );
    // The ids' contents say when the list changed, not the array itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return published;
}
