// Set PUBLIC_STYLES_API to use another server, such as a local one at
// http://localhost:8787.
export const API_ORIGIN: string =
  import.meta.env.PUBLIC_STYLES_API ??
  'https://stylebot-styles.ahuja-ankit.workers.dev';

export type Style = {
  id: string;
  site: string;
  // The site group the style's hostname belongs to, such as wikipedia.
  group: string;
  // The style's name in its URL, unique within its group.
  slug: string;
  name: string;
  description: string | null;
  author: { id: string; name: string | null };
  version: number;
  installs: number;
  createdAt: number;
  updatedAt: number;
  screenshot: string;
};

export type StyleWithCss = Style & { css: string };

// Hostnames that are the same site, such as en. and es.wikipedia.org. `site`
// is the most-installed one, shown for the group.
export type Site = {
  group: string;
  site: string;
  styles: number;
  installs: number;
  hosts: Array<{ site: string; styles: number }>;
};

export type StyleVersion = {
  version: number;
  createdAt: number;
  notes: string | null;
  screenshot: string;
};

export type Account = { id: string; name: string | null };

export type Session = { session: string; expiresAt: number; account: Account };

export type Sort = 'popular' | 'new';

export type StyleQuery = {
  site?: string;
  group?: string;
  q?: string;
  sort?: Sort;
  limit?: number;
  offset?: number;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
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

  if (rest.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (session) {
    headers.Authorization = `Bearer ${session}`;
  }

  const response = await fetch(`${API_ORIGIN}/api/v1${path}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new ApiError(response.status, body?.error ?? response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const screenshotUrl = (style: { screenshot: string }) =>
  API_ORIGIN + style.screenshot;

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

export const listSites = () => request<{ sites: Array<Site> }>('/sites');

export const getStyle = (group: string, slug: string) =>
  request<StyleWithCss>(
    `/sites/${encodeURIComponent(group)}/styles/${encodeURIComponent(slug)}`,
  );

export const listVersions = (id: string) =>
  request<{ versions: Array<StyleVersion> }>(
    `/styles/${encodeURIComponent(id)}/versions`,
  );

export const getVersion = (id: string, version: number) =>
  request<StyleVersion & { css: string }>(
    `/styles/${encodeURIComponent(id)}/versions/${version}`,
  );

export const createSession = (googleToken: string) =>
  request<Session>('/session', {
    method: 'POST',
    body: JSON.stringify({ googleToken }),
  });
