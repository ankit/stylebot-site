export const STORES = {
  chrome: {
    name: 'Chrome',
    href: 'https://chromewebstore.google.com/detail/stylebot/oiaejidbmkiecgbjeifoejpgmdaleoha',
  },
  firefox: {
    name: 'Firefox',
    href: 'https://addons.mozilla.org/firefox/addon/stylebot-web/',
  },
  edge: {
    name: 'Edge',
    href: 'https://microsoftedge.microsoft.com/addons/detail/stylebot/mjolbpfednnbebfapicajpifliopnnai',
  },
};

export type Browser = keyof typeof STORES;

export const BROWSERS = Object.keys(STORES) as Array<Browser>;

/**
 * The browser this page runs in, by its user agent, among those Stylebot is
 * made for: Firefox, Edge, or Chrome for any other Chromium browser. Null
 * where Stylebot doesn't run, such as Safari and phones or tablets.
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
  author: 'https://ankitahuja.com',
  feedbackEmail: 'stylebot+ahuja.ankit@gmail.com',
  cli: '/cli',
};
