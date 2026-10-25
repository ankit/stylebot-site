// Talks to Stylebot's site bridge, a content script that marks the page's
// <html> with data-stylebot-bridge as it loads, previews the styles a page
// asks it to, and says which are installed or published from a profile.

// Stylebot fetches the style before it opens the preview's tab.
const PREVIEW_TIMEOUT_MS = 8000;
// Stylebot answers from what it has stored, so a slow answer isn't coming.
const STATUS_TIMEOUT_MS = 2000;

/**
 * Whether Stylebot's bridge is on this page. It marks <html> before any of
 * the page's scripts run, so there's nothing to wait for.
 */
export const hasStylebot = () =>
  document.documentElement.dataset.stylebotBridge !== undefined;

/**
 * Posts a `stylebot:<verb>` request to the bridge, and resolves with its
 * `stylebot:<verb>:result` with the same id, or null when none comes within
 * `timeoutMs`.
 */
function sendBridgeRequest<T>(
  type: string,
  id: string | number,
  timeoutMs: number,
  payload: Record<string, unknown> = {},
) {
  return new Promise<T | null>((resolve) => {
    const done = (data: T | null) => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);
      resolve(data);
    };

    const onMessage = (e: MessageEvent) => {
      if (
        e.source === window &&
        e.data?.type === `${type}:result` &&
        e.data.id === id
      ) {
        done(e.data);
      }
    };

    const timer = setTimeout(() => done(null), timeoutMs);

    window.addEventListener('message', onMessage);
    window.postMessage({ ...payload, type, id }, location.origin);
  });
}

/**
 * The version of a style a Stylebot profile was last published as, and
 * whether the profile has changed since.
 */
export type PublishedStatus = { version: number; changed: boolean };

/**
 * The profile each of these styles is installed as, and the published status
 * of each published from Stylebot, by style id.
 */
export async function getStyleStatus(styleIds: Array<number>) {
  const answer = await sendBridgeRequest<{
    installed?: Record<string, string>;
    published?: Record<string, PublishedStatus>;
  }>('stylebot:status', crypto.randomUUID(), STATUS_TIMEOUT_MS, { styleIds });

  return {
    installed: answer?.installed ?? {},
    published: answer?.published ?? {},
  };
}

/**
 * The profile each of these styles is installed as in Stylebot, by style id.
 * Styles that aren't installed are left out.
 */
export async function getInstalledStyles(styleIds: Array<number>) {
  return (await getStyleStatus(styleIds)).installed;
}

/**
 * Asks Stylebot to open the style's site in a new tab with the style on, to
 * try before installing. Resolves whether it did. Stylebot only does so right
 * after a click.
 */
export async function previewInStylebot(styleId: number) {
  const answer = await sendBridgeRequest<{ ok: boolean }>(
    'stylebot:preview',
    styleId,
    PREVIEW_TIMEOUT_MS,
  );

  return answer?.ok === true;
}

/**
 * Asks Stylebot to open the style's unpublished changes in /publish. Resolves
 * whether it did. Only works right after a click.
 */
export async function publishFromStylebot(styleId: number) {
  const answer = await sendBridgeRequest<{ ok: boolean }>(
    'stylebot:publish',
    styleId,
    PREVIEW_TIMEOUT_MS,
  );

  return answer?.ok === true;
}

/**
 * Calls `onInstalled` with the profile name when the style is installed from
 * its preview. Returns a function that stops listening.
 */
export function listenForInstall(
  styleId: number,
  onInstalled: (profile: string) => void,
) {
  const onMessage = (e: MessageEvent) => {
    if (
      e.source === window &&
      e.data?.type === 'stylebot:event:installed' &&
      e.data.id === styleId &&
      e.data.profileName
    ) {
      onInstalled(e.data.profileName);
    }
  };

  window.addEventListener('message', onMessage);

  return () => window.removeEventListener('message', onMessage);
}

/**
 * A style Stylebot handed over to publish: its CSS, the site and page it's
 * for, the profile's name and the screenshot taken in Stylebot. `styleId` is
 * set to publish it as a new version of that style.
 */
export type PublishDraft = {
  site: string;
  url: string;
  css: string;
  name: string;
  screenshot: string | null;
  styleId: number | null;
};

/**
 * The draft Stylebot opened this page with, or null when it has none by that
 * id, such as once it's expired or been published.
 */
export async function getPublishDraft(nonce: string) {
  const answer = await sendBridgeRequest<{ draft: PublishDraft | null }>(
    'stylebot:draft',
    nonce,
    STATUS_TIMEOUT_MS,
  );

  return answer?.draft ?? null;
}

/**
 * Tells Stylebot the draft is published, so it links the profile to the
 * style. Resolves whether it did.
 */
export async function reportPublished(
  nonce: string,
  published: { styleId: number; version: number; slug: string },
) {
  const answer = await sendBridgeRequest<{ ok: boolean }>(
    'stylebot:published',
    nonce,
    STATUS_TIMEOUT_MS,
    published,
  );

  return answer?.ok === true;
}

/**
 * Tells Stylebot the style is deleted, so profiles published or installed
 * from it stop linking to it. Resolves whether it did.
 */
export async function reportDeleted(styleId: number) {
  if (!hasStylebot()) {
    return false;
  }

  const answer = await sendBridgeRequest<{ ok: boolean }>(
    'stylebot:deleted',
    styleId,
    STATUS_TIMEOUT_MS,
  );

  return answer?.ok === true;
}
