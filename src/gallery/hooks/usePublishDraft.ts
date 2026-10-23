import { useEffect, useState } from 'preact/hooks';

import {
  getPublishDraft,
  hasStylebot,
  type PublishDraft,
} from '@/gallery/lib/bridge';

/**
 * The draft Stylebot opened the publish page with, by the id in its address.
 * Undefined while Stylebot is asked, and null when there's none to publish.
 */
export function usePublishDraft(nonce: string) {
  const [draft, setDraft] = useState<PublishDraft | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!nonce || !hasStylebot()) {
      setDraft(null);

      return;
    }

    let current = true;

    setDraft(undefined);
    getPublishDraft(nonce).then((found) => {
      if (current) {
        setDraft(found);
      }
    });

    return () => {
      current = false;
    };
  }, [nonce]);

  return draft;
}
