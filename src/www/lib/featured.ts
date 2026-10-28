import { getStyle } from '@/gallery/lib/api';

// The gallery styles the landing page shows, in order, by id.
export const FEATURED: Array<number> = [1, 14, 5, 17, 7, 3];

/**
 * The featured styles, fetched from the gallery when the site is built, so a
 * deploy fails if one is gone rather than leaving a gap.
 */
export const featuredStyles = () =>
  Promise.all(FEATURED.map((id) => getStyle(String(id))));
