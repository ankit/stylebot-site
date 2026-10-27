import { type Browser } from '@/lib/links';

// Set PUBLIC_STYLES_API to use another server, such as a local one at
// http://localhost:8787.
export const API_ORIGIN: string =
  import.meta.env.PUBLIC_STYLES_API ?? 'https://api.stylebot.dev';

export type Style = {
  // Styles are numbered in the order they were published.
  id: number;
  site: string;
  // The Stylebot URL pattern it installs under, when it's more than the site.
  urlPattern: string | null;
  // The style's name in its URL, after its id.
  slug: string;
  name: string;
  description: string | null;
  author: { id: string; username: string };
  version: number;
  installs: number;
  createdAt: number;
  updatedAt: number;
  screenshot: string;
};

export type StyleWithCss = Style & { css: string };

// One of the signed-in account's styles. `hidden` ones were hidden after
// reports, and aren't listed or served.
export type OwnStyle = Style & { status: 'live' | 'hidden' };

// A style just published, with what the API took out of its CSS: rules that
// load from other sites, and large `data:` URIs.
export type PublishedStyle = OwnStyle & { removed: Array<string> };

// What publishing a style or a new version of it sends. A new style needs a
// screenshot; a new version without one keeps the style's.
export type StyleForm = {
  name: string;
  description: string;
  css: string;
  notes?: string;
  screenshot?: Blob;
};

// A hostname with live styles.
export type Site = { site: string; styles: number; installs: number };

export type StyleVersion = {
  version: number;
  createdAt: number;
  notes: string | null;
};

// `usernameConfirmed` is false until the person confirms or changes the
// username made up for them at sign-in.
export type Account = {
  id: string;
  username: string;
  usernameConfirmed: boolean;
};

export type UsernameCheck = {
  available: boolean;
  reason?: 'invalid' | 'reserved' | 'taken';
  suggestion?: string;
};

export type Session = { session: string; expiresAt: number; account: Account };

export const UNINSTALL_REASONS = [
  'not-needed',
  'hard-to-use',
  'broke-a-site',
  'missing-feature',
  'too-slow',
  'other',
] as const;

export type UninstallReason = (typeof UNINSTALL_REASONS)[number];

// The goodbye page's survey. It's anonymous: `site` and `feature` are only
// what the person typed.
export type UninstallFeedback = {
  reasons: Array<UninstallReason>;
  site?: string;
  feature?: string;
  note?: string;
  browser?: Browser;
  version?: string;
  locale?: string;
};

export type Sort = 'popular' | 'new';

export type StyleQuery = {
  site?: string;
  // An author's username, for their styles only.
  author?: string;
  q?: string;
  sort?: Sort;
  limit?: number;
  offset?: number;
};

// `code` tells apart errors that share a status, such as `css_unchanged`.
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { session?: string } = {},
): Promise<T> {
  const { session, ...rest } = init;
  const headers: Record<string, string> = {};

  if (typeof rest.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  if (session) {
    headers.Authorization = `Bearer ${session}`;
  }

  const response = await fetch(`${API_ORIGIN}/v1${path}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(
      response.status,
      body?.error ?? response.statusText,
      body?.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const screenshotUrl = (style: { screenshot: string }) =>
  API_ORIGIN + style.screenshot;

// The API resizes screenshots to these widths only; any other returns 400.
export type ScreenshotWidth = 480 | 960;

export const resizedScreenshotUrl = (
  style: { screenshot: string },
  width: ScreenshotWidth,
) => `${screenshotUrl(style)}?w=${width}`;

export const screenshotSrcset = (style: { screenshot: string }) =>
  `${resizedScreenshotUrl(style, 480)} 480w, ${resizedScreenshotUrl(style, 960)} 960w`;

export function listStyles(query: StyleQuery) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  return request<{ styles: Array<Style>; nextOffset: number | null }>(
    `/styles?${params}`,
  );
}

// An author with live styles. `username` is their current one, which differs
// from the one asked for when that's an old username.
export type Author = { username: string; styles: number; installs: number };

export const getAuthor = (username: string) =>
  request<Author>(`/authors/${encodeURIComponent(username)}`);

export const listSites = () => request<{ sites: Array<Site> }>('/sites');

export const getStyle = (id: string) =>
  request<StyleWithCss>(`/styles/${encodeURIComponent(id)}`);

export const listVersions = (id: number) =>
  request<{ versions: Array<StyleVersion> }>(
    `/styles/${encodeURIComponent(id)}/versions`,
  );

export const getVersion = (id: number, version: number) =>
  request<StyleVersion & { css: string }>(
    `/styles/${encodeURIComponent(id)}/versions/${version}`,
  );

export const createSession = (googleToken: string) =>
  request<Session>('/session', {
    method: 'POST',
    body: JSON.stringify({ googleToken }),
  });

// Changes the account's username, or confirms the current one.
export const setUsername = (session: string, username: string) =>
  request<Account>('/me', {
    method: 'PATCH',
    session,
    body: JSON.stringify({ username }),
  });

export const checkUsername = (session: string, username: string) =>
  request<UsernameCheck>(`/usernames/${encodeURIComponent(username)}`, {
    session,
  });

export const listMyStyles = (session: string) =>
  request<{ styles: Array<OwnStyle> }>('/me/styles', { session });

const styleAction = (id: number, action = '') =>
  `/styles/${encodeURIComponent(id)}${action}`;

// Deletes a style for good.
export const deleteStyle = (session: string, id: number) =>
  request<void>(styleAction(id), { method: 'DELETE', session });

// Changes a style's name, description and screenshot without publishing a
// new version. A new screenshot is checked like a published one's, so a live
// style can come back hidden.
export const updateStyle = (
  session: string,
  id: number,
  details: { name: string; description: string; screenshot?: Blob },
) => {
  const { screenshot, ...fields } = details;
  let body: string | FormData = JSON.stringify(fields);

  if (screenshot) {
    body = new FormData();
    body.append('name', fields.name);
    body.append('description', fields.description);
    body.append('screenshot', screenshot, 'screenshot');
  }

  return request<PublishedStyle>(styleAction(id), {
    method: 'PATCH',
    session,
    body,
  });
};

// Reports a live style as the signed-in account; each account counts once.
export const reportStyle = (session: string, id: number, reason: string) =>
  request<void>(styleAction(id, '/reports'), {
    method: 'POST',
    session,
    body: JSON.stringify({ reason }),
  });

// Fails with 429 after 5 a minute from one address.
export const sendUninstallFeedback = (feedback: UninstallFeedback) =>
  request<void>('/feedback', {
    method: 'POST',
    body: JSON.stringify({ kind: 'uninstall', ...feedback }),
  });

function toFormData(
  form: StyleForm,
  site?: string,
  urlPattern?: string | null,
) {
  const data = new FormData();

  if (site !== undefined) {
    data.append('site', site);
  }

  if (urlPattern) {
    data.append('urlPattern', urlPattern);
  }

  data.append('name', form.name);

  if (form.description) {
    data.append('description', form.description);
  }

  if (form.notes) {
    data.append('notes', form.notes);
  }

  data.append('css', form.css);

  // The API reads the type from the file itself, so the name is only a label.
  if (form.screenshot) {
    data.append('screenshot', form.screenshot, 'screenshot');
  }

  return data;
}

// `urlPattern` is the Stylebot URL pattern it's for, when it's more than `site`.
export const createStyle = (
  session: string,
  site: string,
  urlPattern: string | null,
  form: StyleForm,
) =>
  request<PublishedStyle>('/styles', {
    method: 'POST',
    session,
    body: toFormData(form, site, urlPattern),
  });

// Publishes a new version of one of the account's styles, replacing its name
// and description too. One with unchanged CSS fails with `css_unchanged`.
export const createVersion = (session: string, id: number, form: StyleForm) =>
  request<PublishedStyle>(styleAction(id, '/versions'), {
    method: 'POST',
    session,
    body: toFormData(form),
  });
