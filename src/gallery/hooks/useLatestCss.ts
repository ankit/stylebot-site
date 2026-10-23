import { getVersion, type OwnStyle } from '@/gallery/lib/api';

import { useRequest } from './useRequest';

/**
 * The CSS of the style's latest version, to compare an update with. Undefined
 * while it loads, and null for a new style or when it couldn't be loaded.
 */
export function useLatestCss(style: OwnStyle | null) {
  const request = useRequest(async () => {
    if (!style) {
      return null;
    }

    return getVersion(style.id, style.version)
      .then((version) => version.css)
      .catch(() => null);
  }, [style?.id, style?.version]);

  return request.data;
}
