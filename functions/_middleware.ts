import { type Env } from './_lib/api';

/**
 * Gives the pages the functions serve the headers the build's _headers gives
 * the static files: no framing, no sniffing, and until the gallery launches,
 * a request that search engines skip them.
 */
export const onRequest: PagesFunction<Env> = async ({ env, next }) => {
  const original = await next();
  const response = new Response(original.body, original);

  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  response.headers.set('X-Content-Type-Options', 'nosniff');

  if (env.GALLERY_PUBLIC !== 'true') {
    response.headers.set('X-Robots-Tag', 'noindex');
  }

  return response;
};
