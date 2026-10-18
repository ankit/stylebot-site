import { useEffect, useState } from 'preact/hooks';

import { hasStylebot } from '@/gallery/lib/bridge';

export type StylebotAvailability = 'checking' | 'available' | 'unavailable';

/**
 * Whether Stylebot is installed in this browser. It's checking only until the
 * island runs, since the built page can't know.
 */
export function useStylebotAvailability() {
  const [availability, setAvailability] =
    useState<StylebotAvailability>('checking');

  useEffect(() => {
    if (hasStylebot()) {
      setAvailability('available');
    } else {
      setAvailability('unavailable');
    }
  }, []);

  return availability;
}
