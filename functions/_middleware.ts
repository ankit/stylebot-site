import { type Env } from './_lib/api';

/**
 * Gives the pages the functions serve the headers the build's _headers gives
 * the static files: no framing and no sniffing.
 */
export const onRequest: PagesFunction<Env> = async ({ next }) => {
  const original = await next();
  const response = new Response(original.body, original);

  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
};
