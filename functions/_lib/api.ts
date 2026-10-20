export type Env = {
  ASSETS: Fetcher;
  // Another styles API, such as a local one at http://localhost:8787.
  STYLES_API?: string;
  // 'true' once the gallery launches; until then search engines are told to
  // skip it.
  GALLERY_PUBLIC?: string;
};

export type Style = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  author: { username: string };
  updatedAt: number;
  screenshot: string;
};

export type Counts = { styles: number; installs: number };

export type Author = Counts & { username: string };

export type Site = Counts & { site: string };

export const apiOrigin = (env: Env) =>
  env.STYLES_API ?? 'https://stylebot-styles.ahuja-ankit.workers.dev';

/**
 * A GET from the styles API, or null when it's not found or invalid. Throws
 * when the API fails or takes longer than `timeout` ms.
 */
export async function api<T>(
  env: Env,
  path: string,
  timeout = 1500,
): Promise<T | null> {
  const response = await fetch(`${apiOrigin(env)}/api/v1${path}`, {
    signal: AbortSignal.timeout(timeout),
    cf: { cacheTtl: 60 },
  });

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${path}: ${response.status}`);
  }

  return response.json();
}

export type StylesPage = { styles: Array<Style>; nextOffset: number | null };

export function listStyles(
  env: Env,
  query: Record<string, string | number>,
  timeout?: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    params.set(key, String(value));
  }

  return api<StylesPage>(env, `/styles?${params}`, timeout);
}
