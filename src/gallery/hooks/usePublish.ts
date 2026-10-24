import { useState } from 'preact/hooks';

import {
  ApiError,
  createStyle,
  createVersion,
  type OwnStyle,
  type PublishedStyle,
  type StyleForm,
  updateStyle,
} from '@/gallery/lib/api';
import { onAuthError } from '@/gallery/lib/auth';
import { type PublishDraft, reportPublished } from '@/gallery/lib/bridge';

export type PublishDetails = Pick<StyleForm, 'name' | 'description' | 'notes'>;

// Whether Stylebot has linked its profile to the published style.
export type LinkState = 'linking' | 'linked' | 'unlinked';

// A string screenshot is the data: URL of the one Stylebot took.
async function screenshotBlob(screenshot?: Blob | string) {
  if (typeof screenshot === 'string') {
    return (await fetch(screenshot)).blob();
  }

  return screenshot;
}

/**
 * Publishes a draft as a new style, or as a new version of `existing`, then
 * tells Stylebot. When the version's CSS is unchanged, `unchanged` is set and
 * `saveDetails` saves the name, description and any new screenshot only.
 */
export function usePublish(
  session: string,
  nonce: string,
  draft: PublishDraft,
  existing: OwnStyle | null,
) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const [published, setPublished] = useState<PublishedStyle>();
  const [link, setLink] = useState<LinkState>('linking');
  const [detailsOnly, setDetailsOnly] = useState(false);

  const sendLink = async (style: PublishedStyle) => {
    setLink('linking');

    const ok = await reportPublished(nonce, {
      styleId: style.id,
      version: style.version,
      slug: style.slug,
    });

    if (ok) {
      setLink('linked');
    } else {
      setLink('unlinked');
    }
  };

  const run = async (send: () => Promise<PublishedStyle>) => {
    setBusy(true);
    setError(undefined);

    try {
      const style = await send().catch(onAuthError);

      setPublished(style);
      sendLink(style);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };

  const publish = (details: PublishDetails, screenshot?: Blob | string) =>
    run(async () => {
      const form: StyleForm = {
        ...details,
        css: draft.css,
        screenshot: await screenshotBlob(screenshot),
      };

      if (!existing) {
        return createStyle(session, draft.site, form);
      }

      return createVersion(session, existing.id, form);
    });

  const saveDetails = async (
    details: PublishDetails,
    screenshot?: Blob | string,
  ) => {
    if (!existing) {
      return;
    }

    setDetailsOnly(true);
    await run(async () =>
      updateStyle(session, existing.id, {
        name: details.name,
        description: details.description,
        screenshot: await screenshotBlob(screenshot),
      }),
    );
  };

  const unchanged = error instanceof ApiError && error.code === 'css_unchanged';

  return {
    publish,
    saveDetails,
    busy,
    error,
    unchanged,
    published,
    detailsOnly,
    link,
    retryLink: () => published && sendLink(published),
  };
}
