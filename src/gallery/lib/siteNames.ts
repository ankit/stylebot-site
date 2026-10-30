// Most widely used first, so descriptions can lead with sites people know.
const SITES: Array<[string, string]> = [
  ['google.com', 'Google'],
  ['youtube.com', 'YouTube'],
  ['facebook.com', 'Facebook'],
  ['instagram.com', 'Instagram'],
  ['chatgpt.com', 'ChatGPT'],
  ['en.wikipedia.org', 'Wikipedia'],
  ['reddit.com', 'Reddit'],
  ['x.com', 'X'],
  ['twitter.com', 'Twitter'],
  ['mail.google.com', 'Gmail'],
  ['web.whatsapp.com', 'WhatsApp Web'],
  ['linkedin.com', 'LinkedIn'],
  ['github.com', 'GitHub'],
  ['gemini.google.com', 'Gemini'],
  ['docs.google.com', 'Google Docs'],
  ['nytimes.com', 'The New York Times'],
  ['claude.ai', 'Claude'],
  ['stackoverflow.com', 'Stack Overflow'],
  ['duckduckgo.com', 'DuckDuckGo'],
  ['medium.com', 'Medium'],
  ['news.ycombinator.com', 'Hacker News'],
  ['old.reddit.com', 'Old Reddit'],
  ['gutenberg.org', 'Project Gutenberg'],
];

const NAMES = new Map(SITES);

const RANKS = new Map(SITES.map(([site], i) => [site, i]));

/**
 * What people call a site, such as YouTube for youtube.com, for titles that
 * match what they search for. Sites not listed keep their hostname.
 */
export const siteName = (site: string) => NAMES.get(site) ?? site;

/**
 * Sites with the best known first; the rest keep their order after them.
 */
export const byPopularity = <T>(sites: Array<T>, site: (item: T) => string) =>
  [...sites].sort(
    (a, b) =>
      (RANKS.get(site(a)) ?? SITES.length) -
      (RANKS.get(site(b)) ?? SITES.length),
  );
