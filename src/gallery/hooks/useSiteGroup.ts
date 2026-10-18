import { useEffect, useState } from 'preact/hooks';

import { galleryRoute } from '@/gallery/lib/paths';

/**
 * The site group in this page's address, /s/<group>. It's null until the
 * island runs, since one built page serves every site.
 */
export function useSiteGroup() {
  const [group, setGroup] = useState<string | null>(null);

  useEffect(() => setGroup(galleryRoute().group), []);

  return group;
}
