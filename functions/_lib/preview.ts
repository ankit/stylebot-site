import { compactNumber, fullNumber } from '@/gallery/lib/format';
import { authorHref, styleHref } from '@/gallery/lib/paths';
import { byPopularity, siteName } from '@/gallery/lib/siteNames';
import {
  authorTitle,
  homeTitle,
  pageTitle,
  sitesTitle,
  siteTitle,
  styleTitle,
} from '@/gallery/lib/titles';

import {
  catalog,
  htmlLang,
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
import {
  authorContent,
  type Content,
  homeContent,
  siteContent,
  sitesContent,
  styleContent,
} from './content';
import { jsonLd } from './html';

type Meta = {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  notFound?: boolean;
  // What the page shows, for crawlers that don't run the app.
  body?: string;
  data?: Array<object>;
};

type Page = Meta | { redirect: string };

type Lookup = (
  env: Env,
  page: Content & { params: Array<string> },
) => Promise<Page>;

const LIST_SIZE = 50;

// Like the static files: a page cached across a deploy would load scripts
// the deploy removed.
const PAGE_CACHE = 'public, max-age=0, must-revalidate';

const REDIRECT_CACHE = 'public, max-age=300';

const SUMMARY_LENGTH = 155;

/**
 * A description's first paragraph, cut at a word to fit a search result.
 */
function summary(text: string) {
  const first = text
    .trim()
    .split(/\n\s*\n/)[0]!
    .replace(/\s+/g, ' ');

  if (first.length <= SUMMARY_LENGTH) {
    return first;
  }

  const cut = first.slice(0, SUMMARY_LENGTH).replace(/\s+\S*$/, '');

  return `${cut.replace(/[\s,;:.]+$/, '')}…`;
}

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

const list = (locale: Locale, items: Array<string>) =>
  new Intl.ListFormat(htmlLang(locale)).format(items);

const topSites = (locale: Locale, sites: Array<Site>) =>
  list(
    locale,
    byPopularity(sites, (s) => s.site)
      .slice(0, 3)
      .map((s) => siteName(s.site)),
  );

const screenshot = (env: Env, style: Style) =>
  apiOrigin(env) + style.screenshots[0];

const stylePage: Lookup = async (env, { params: [id, slug], ...content }) => {
  const { locale, t } = content;
  const style = await api<Style>(env, `/styles/${encodeURIComponent(id)}`);

  if (!style) {
    return { title: pageTitle(t, t('Style not found')), notFound: true };
  }

  if (style.slug !== slug) {
    return { redirect: styleHref(locale, style) };
  }

  return {
    title: pageTitle(t, styleTitle(t, style)),
    description: (style.description && summary(style.description)) || undefined,
    image: screenshot(env, style),
    imageAlt: style.name,
    ...styleContent(content, style, screenshot(env, style)),
  };
};

const sitePage: Lookup = async (env, { params: [hostname], ...content }) => {
  const { locale, t } = content;
  const page = await listStyles(env, {
    site: hostname,
    sort: 'popular',
    limit: LIST_SIZE,
  });
  const first = page?.styles[0];

  if (!first) {
    return {
      title: pageTitle(t, t('No styles for {site} yet', { site: hostname })),
      notFound: true,
    };
  }

  const names = list(
    locale,
    page.styles.slice(0, 3).map((s) => s.name),
  );

  return {
    title: pageTitle(t, siteTitle(t, hostname)),
    description: summary(
      // i18n: A site's description in search results and link previews. {styles} lists up to three style names, such as “Quiet Reel, Dark Tube and Focus”.
      t('Themes and styles for {site}, made with Stylebot: {styles}.', {
        site: hostname,
        styles: names,
      }),
    ),
    image: screenshot(env, first),
    imageAlt: first.name,
    ...siteContent(content, hostname, page.styles),
  };
};

const authorPage: Lookup = async (env, { params: [username], ...content }) => {
  const { locale, t } = content;
  const [author, page] = await Promise.all([
    api<Author>(env, `/authors/${encodeURIComponent(username)}`),
    listStyles(env, { author: username, sort: 'popular', limit: LIST_SIZE }),
  ]);

  if (!author) {
    return { title: pageTitle(t, t('Author not found')), notFound: true };
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
    title: pageTitle(t, authorTitle(t, author.username)),
    description: withCounts(locale, t, lead, author),
    image: first && screenshot(env, first),
    imageAlt: first?.name,
    ...authorContent(content, author, page?.styles ?? []),
  };
};

const sitesPage: Lookup = async (env, content) => {
  const { locale, t } = content;
  const sites = (await api<{ sites: Array<Site> }>(env, '/sites'))?.sites ?? [];
  let description: string | undefined;

  if (sites.length) {
    // i18n: The description of the page listing every site, in search results. {sites} lists up to three, such as “YouTube, Gmail and GitHub”.
    description = t(
      'Every site with Stylebot themes and styles, including {sites}.',
      { sites: topSites(locale, sites) },
    );
  }

  return {
    title: pageTitle(t, sitesTitle(t)),
    description,
    ...sitesContent(content, sites),
  };
};

const homePage: Lookup = async (env, content) => {
  const { locale, t } = content;
  const [page, sitesPage] = await Promise.all([
    listStyles(env, { sort: 'popular', limit: LIST_SIZE }),
    api<{ sites: Array<Site> }>(env, '/sites'),
  ]);
  const sites = sitesPage?.sites ?? [];
  let description: string | undefined;

  if (sites.length) {
    // i18n: The gallery home page's description in search results. {sites} lists up to three sites, such as “YouTube, Gmail and GitHub”.
    description = t(
      'Dark modes, themes and cleaner layouts for sites like {sites}, made with Stylebot. Install one in a click.',
      { sites: topSites(locale, sites) },
    );
  }

  return {
    title: pageTitle(t, homeTitle(t)),
    description,
    ...homeContent(content, page?.styles ?? [], sites),
  };
};

const ROUTES: Array<[RegExp, Lookup]> = [
  [/^\/$/, homePage],
  [/^\/sites$/, sitesPage],
  [/^\/style\/([^/]+)(?:\/([^/]+))?$/, stylePage],
  [/^\/site\/([^/]+)$/, sitePage],
  [/^\/author\/([^/]+)$/, authorPage],
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

  if (meta.body) {
    const body = `<div id="g-static" hidden>${meta.body}</div><noscript><style>#g-static{display:block}</style></noscript>`;

    rewriter.on('.g-page', {
      element(element) {
        element.prepend(body, { html: true });
      },
    });
  }

  if (meta.data) {
    const data = meta.data.map(jsonLd).join('');

    rewriter.on('head', {
      element(element) {
        element.append(data, { html: true });
      },
    });
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

  response.headers.set('Cache-Control', PAGE_CACHE);
  response.headers.delete('ETag');

  return rewriter.transform(response);
}

/**
 * The home, sites, site, style or author page: the locale's app shell, with the title,
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
      params = decode(match.slice(1).filter((s) => s !== undefined));
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
      origin: url.origin,
      params,
    });
  } catch {
    const response = new Response(shell.body, shell);

    response.headers.set('Cache-Control', PAGE_CACHE);

    return response;
  }

  if ('redirect' in page) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: page.redirect + url.search,
        'Cache-Control': REDIRECT_CACHE,
      },
    });
  }

  return rewrite(shell, page, locale, path);
}
