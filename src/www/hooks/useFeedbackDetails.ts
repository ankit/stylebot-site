import { useEffect, useState } from 'preact/hooks';

import { extensionVersion } from '@/www/lib/feedback';

import { type Browser, currentBrowser } from '@/lib/links';

type Details = { browser?: Browser; version?: string };

/**
 * The browser and extension version sent with feedback, read once the page is
 * in the browser since neither exists when it's rendered.
 */
export function useFeedbackDetails() {
  const [details, setDetails] = useState<Details>({});

  useEffect(() => {
    setDetails({
      browser: currentBrowser() ?? undefined,
      version: extensionVersion(),
    });
  }, []);

  return details;
}
