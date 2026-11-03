import { getVersion } from '@/gallery/lib/api';
import { diffLines, toHunks } from '@/gallery/lib/diff';

import { useRequest } from './useRequest';

/**
 * What a version changed in a style's CSS since `previous`, as hunks. Null
 * when the two are too long to compare.
 */
export function useVersionDiff(
  styleId: number,
  version: number,
  previous: number,
) {
  return useRequest(
    async () => {
      const [before, after] = await Promise.all([
        getVersion(styleId, previous),
        getVersion(styleId, version),
      ]);
      const lines = diffLines(before.css, after.css);

      if (!lines) {
        return null;
      }

      return toHunks(lines);
    },
    [styleId, version, previous],
    `version-diff:${styleId}:${previous}:${version}`,
  );
}
