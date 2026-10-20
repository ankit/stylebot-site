import { compactNumber, fullNumber } from '@/gallery/lib/format';
import { authorHref, siteHref, styleHref } from '@/gallery/lib/paths';

import {
  catalog,
  type Locale,
  localeOf,
  localizePath,
  type Translate,
  translator,
  unlocalizedPath,
} from '@/i18n';

import {
  api,
  apiOrigin,
  type Author,
  type Counts,
  type Env,
  listStyles,
  type Site,
  type Style,
} from './api';

type Meta = {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  notFound?: boolean;
};

type Page = Meta | { redirect: string };

type Lookup = (
  env: Env,
  page: { locale: Locale; t: Translate; params: Array<string> },
) => Promise<Page>;

const CACHE_CONTROL = 'public, max-age=300';

const fullTitle = (t: Translate, title: string) =>
  t('{title} | Stylebot', { title });

// Matches the counts on the author page.
const withCounts = (
  locale: Locale,
  t: Translate,
  lead: string,
  { styles, installs }: Counts,
) =>
  [
    lead,
    t('Styles: {count}', { count: fullNumber(locale, styles) }),
    '·',
    t('Installs: {count}', { count: compactNumber(locale, installs) }),
  ].join(' ');

const screenshot = (env: Env, style: Style) =>
  apiOrigin(env) + style.screenshot;

/**
 * The group a hostname belongs to, such as github for github.com, when it
 * isn't one itself, as the app moves there too.
 */
async function movedGroup(env: Env, group: string) {
  if (!group.includes('.')) {
    return null;
  }

  const page = await listStyles(env, { site: group, limit: 1 });
  const actual = page?.styles[0]?.group;

  if (!actual || actual === group) {
    return null;
  }

  return actual;
}

const stylePage: Lookup = async (env, { locale, t, params: [group, slug] }) => {
  const style = await api<Style>(
    env,
    `/sites/${encodeURIComponent(group)}/styles/${encodeURIComponent(slug)}`,
  );

  if (style) {
    return {
      title: fullTitle(t, style.name),
      description: style.description || undefined,
      image: screenshot(env, style),
      imageAlt: style.name,
    };
  }

  const actual = await movedGroup(env, group);

  if (actual) {
    return { redirect: styleHref(locale, { group: actual, slug }) };
  }

  return { title: fullTitle(t, t('Style not found')), notFound: true };
};

const sitePage: Lookup = async (env, { locale, t, params: [group] }) => {
  const [page, sites] = await Promise.all([
    listStyles(env, { group, limit: 1 }),
    api<{ sites: Array<Site> }>(env, '/sites'),
  ]);
  const first = page?.styles[0];
  const site = sites?.sites.find((s) => s.group === group);

  if (first) {
    // i18n: The start of a site's description in link previews, followed by its style and install counts.
    const lead = t('Styles people made with Stylebot for {site}.', {
      site: group,
    });

    return {
      title: fullTitle(t, t('Styles for {site}', { site: group })),
      description: site && withCounts(locale, t, lead, site),
      image: screenshot(env, first),
      imageAlt: first.name,
    };
  }

  const actual = await movedGroup(env, group);

  if (actual) {
    return { redirect: siteHref(locale, actual) };
  }

  return {
    title: fullTitle(t, t('No styles for {site} yet', { site: group })),
    notFound: true,
  };
};

const authorPage: Lookup = async (env, { locale, t, params: [username] }) => {
  const [author, page] = await Promise.all([
    api<Author>(env, `/authors/${encodeURIComponent(username)}`),
    listStyles(env, { author: username, limit: 1 }),
  ]);

  if (!author) {
    return { title: fullTitle(t, t('Author not found')), notFound: true };
  }

  if (author.username !== username) {
    return { redirect: authorHref(locale, author.username) };
  }

  const first = page?.styles[0];
  // i18n: The start of an author's description in link previews, followed by their style and install counts.
  const lead = t('Styles {username} made with Stylebot.', {
    username: author.username,
  });

  return {
    title: fullTitle(t, author.username),
    description: withCounts(locale, t, lead, author),
    image: first && screenshot(env, first),
    imageAlt: first?.name,
  };
};

const sitesPage: Lookup = async (_env, { t }) => ({
  title: fullTitle(t, t('All sites')),
});

const ROUTES: Array<[RegExp, Lookup]> = [
  [/^\/sites$/, sitesPage],
  [/^\/s\/([^/]+)\/([^/]+)$/, stylePage],
  [/^\/s\/([^/]+)$/, sitePage],
  [/^\/u\/([^/]+)$/, authorPage],
];

function decode(segments: Array<string>) {
  try {
    return segments.map(decodeURIComponent);
  } catch {
    return null;
  }
}

const setContent = (content: string) => ({
  element(element: Element) {
    element.setAttribute('content', content);
  },
});

const remove = {
  element(element: Element) {
    element.remove();
  },
};

/**
 * The shell with a head that describes this page, for link previews and
 * crawlers, which don't run the app.
 */
function rewrite(shell: Response, meta: Meta, locale: Locale, path: string) {
  const movePath = (attribute: string) => ({
    element(element: Element) {
      const url = new URL(
        localizePath(locale, path),
        element.getAttribute(attribute) ?? undefined,
      );

      element.setAttribute(attribute, url.href);
    },
  });

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(meta.title);
      },
    })
    .on('meta[property="og:title"]', setContent(meta.title))
    .on('meta[name="twitter:title"]', setContent(meta.title))
    .on('meta[name="twitter:card"]', setContent('summary_large_image'))
    .on('link[rel="canonical"]', movePath('href'))
    .on('meta[property="og:url"]', movePath('content'))
    .on('link[rel="alternate"][hreflang]', {
      element(element) {
        const href = new URL(element.getAttribute('href') ?? '');
        const alternate = localizePath(localeOf(href.pathname), path);

        element.setAttribute('href', new URL(alternate, href).href);
      },
    });

  if (meta.description) {
    rewriter
      .on('meta[name="description"]', setContent(meta.description))
      .on('meta[property="og:description"]', setContent(meta.description))
      .on('meta[name="twitter:description"]', setContent(meta.description));
  }

  if (meta.image) {
    rewriter
      .on('meta[property="og:image"]', setContent(meta.image))
      .on('meta[property="og:image:width"]', remove)
      .on('meta[property="og:image:height"]', remove)
      .on('meta[property="og:image:alt"]', setContent(meta.imageAlt ?? ''));
  }

  if (meta.notFound) {
    rewriter.on('head', {
      element(element) {
        element.append('<meta name="robots" content="noindex" />', {
          html: true,
        });
      },
    });
  }

  const response = new Response(shell.body, {
    status: meta.notFound ? 404 : 200,
    headers: shell.headers,
  });

  response.headers.set('Cache-Control', CACHE_CONTROL);
  response.headers.delete('ETag');

  return rewriter.transform(response);
}

/**
 * A sites, site, style or author page: the locale's app shell, with the title,
 * description, image and links of what it shows. Null for other paths.
 */
export async function preview(request: Request, env: Env) {
  const url = new URL(request.url);
  const locale = localeOf(url.pathname);
  const path = unlocalizedPath(url.pathname).replace(/(.)\/$/, '$1');
  let lookup: Lookup | undefined;
  let params: Array<string> | null = null;

  for (const [pattern, handler] of ROUTES) {
    const match = pattern.exec(path);

    if (match) {
      lookup = handler;
      params = decode(match.slice(1));
      break;
    }
  }

  if (!lookup || !params) {
    return null;
  }

  const shell = await env.ASSETS.fetch(new URL(localizePath(locale, '/'), url));
  let page: Page;

  try {
    page = await lookup(env, {
      locale,
      t: translator(catalog(locale)),
      params,
    });
  } catch {
    const response = new Response(shell.body, shell);

    response.headers.set('Cache-Control', 'public, max-age=60');

    return response;
  }

  if ('redirect' in page) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: page.redirect + url.search,
        'Cache-Control': CACHE_CONTROL,
      },
    });
  }

  return rewrite(shell, page, locale, path);
}
