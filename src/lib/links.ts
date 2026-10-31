export const STORES = {
  chrome: {
    name: 'Chrome',
    href: 'https://chromewebstore.google.com/detail/stylebot/oiaejidbmkiecgbjeifoejpgmdaleoha',
  },
  firefox: {
    name: 'Firefox',
    href: 'https://addons.mozilla.org/firefox/addon/stylebot-web/',
  },
  safari: {
    name: 'Safari',
    href: 'https://apps.apple.com/app/id6821400927',
  },
  edge: {
    name: 'Edge',
    href: 'https://microsoftedge.microsoft.com/addons/detail/stylebot/mjolbpfednnbebfapicajpifliopnnai',
  },
};

export type Browser = keyof typeof STORES;

export const BROWSERS = Object.keys(STORES) as Array<Browser>;

const PLACEMENT_SITES = {
  header: 'stylebot.dev',
  hero: 'stylebot.dev',
  install: 'stylebot.dev',
  cli: 'stylebot.dev',
  goodbye: 'stylebot.dev',
  'get-stylebot': 'gallery.stylebot.dev',
  publish: 'gallery.stylebot.dev',
  footer: 'gallery.stylebot.dev',
};

export type Placement = keyof typeof PLACEMENT_SITES;

/**
 * The store link for a browser, tagged with the site and spot it's on, so the
 * stores' dashboards can say where installs come from.
 */
export function storeHref(browser: Browser, placement: Placement) {
  const url = new URL(STORES[browser].href);

  url.searchParams.set('utm_source', PLACEMENT_SITES[placement]);
  url.searchParams.set('utm_medium', placement);

  return url.href;
}

/**
 * The browser this page runs in, by its user agent, among those Stylebot is
 * made for: Firefox, Safari on a Mac, Edge, or Chrome for any other Chromium
 * browser. Null where Stylebot doesn't run, such as phones and tablets.
 */
export function currentBrowser(): Browser | null {
  const ua = navigator.userAgent;
  // iPadOS Safari says it's a Mac, so a Mac with a touchscreen is an iPad.
  const isIpad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

  if (/Android|iPhone|iPad|iPod|Mobile/.test(ua) || isIpad) {
    return null;
  }

  if (/Firefox\//.test(ua)) {
    return 'firefox';
  }

  if (/Edg\//.test(ua)) {
    return 'edge';
  }

  if (/Chrome\/|Chromium\//.test(ua)) {
    return 'chrome';
  }

  // Chromium browsers also say Safari, so this comes after them.
  if (/Version\/.+Safari\//.test(ua)) {
    return 'safari';
  }

  return null;
}

export const LINKS = {
  // stylebot.dev, for links from the gallery, which is on its own domain.
  site: 'https://stylebot.dev',
  github: 'https://github.com/ankit/stylebot',
  siteGithub: 'https://github.com/ankit/stylebot-site',
  issues: 'https://github.com/ankit/stylebot/issues',
  changelog: 'https://github.com/ankit/stylebot/releases',
  donate: 'https://ko-fi.com/stylebot',
  manual: '/manual',
  gallery: 'https://gallery.stylebot.dev',
  author: 'https://ankitahuja.com',
  feedbackEmail: 'stylebot+ahuja.ankit@gmail.com',
  cli: '/cli',
};
