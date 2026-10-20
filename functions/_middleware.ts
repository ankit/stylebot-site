import { type Env } from './_lib/api';

/**
 * Tells search engines to skip the pages the functions serve until the
 * gallery launches, as the build's _headers does for the static files.
 */
export const onRequest: PagesFunction<Env> = async ({ env, next }) => {
  const response = await next();

  if (env.GALLERY_PUBLIC === 'true') {
    return response;
  }

  const hidden = new Response(response.body, response);

  hidden.headers.set('X-Robots-Tag', 'noindex');

  return hidden;
};
