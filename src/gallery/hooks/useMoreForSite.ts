import { listStyles, type Style } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

const COUNT = 4;

/**
 * Up to four other styles for a style's site group, most installed first.
 */
export function useMoreForSite(style: Style) {
  return useRequest(
    () =>
      listStyles({ group: style.group, limit: COUNT + 1 }).then((page) =>
        page.styles.filter((other) => other.id !== style.id).slice(0, COUNT),
      ),
    [style.id],
  );
}
