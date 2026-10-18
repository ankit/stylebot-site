// Talks to Stylebot's site bridge, a content script that marks the page's
// <html> with data-stylebot-bridge as it loads, previews the styles a page
// asks it to, and says which are installed.

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
  id: string,
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
 * The profile each of these styles is installed as in Stylebot, by style id.
 * Styles that aren't installed are left out.
 */
export async function getInstalledStyles(styleIds: Array<string>) {
  const answer = await sendBridgeRequest<{
    installed: Record<string, string>;
  }>('stylebot:status', crypto.randomUUID(), STATUS_TIMEOUT_MS, { styleIds });

  return answer?.installed ?? {};
}

/**
 * Asks Stylebot to open the style's site in a new tab with the style on, to
 * try before installing. Resolves whether it did. Stylebot only does so right
 * after a click.
 */
export async function previewInStylebot(styleId: string) {
  const answer = await sendBridgeRequest<{ ok: boolean }>(
    'stylebot:preview',
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
  styleId: string,
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
