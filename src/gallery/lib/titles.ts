import { type Translate } from '@/i18n/t';

import { siteName } from './siteNames';

export const pageTitle = (t: Translate, title: string) =>
  t('{title} | Stylebot', { title });

const namesSite = (name: string, site: string) =>
  new RegExp(
    `(^|\\W)${site.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`,
    'i',
  ).test(name);

/**
 * A style's name and the site it's for, or just its name when that already
 * says the site, as in “Claude Slate”.
 */
export function styleTitle(
  t: Translate,
  style: { name: string; site: string },
) {
  const site = siteName(style.site);

  if (namesSite(style.name, site)) {
    return style.name;
  }

  // i18n: A style's page title in search results and tabs: its name, then the site it restyles, such as “Quiet Reel for YouTube”.
  return t('{name} for {site}', { name: style.name, site });
}

export const homeTitle = (t: Translate) =>
  // i18n: The gallery home page's title in search results and tabs.
  t('Themes, styles and dark modes for any website');

export const sitesTitle = (t: Translate) =>
  // i18n: The title of the page listing every site with styles, in search results and tabs.
  t('Themes and styles by site');

export const authorTitle = (t: Translate, username: string) =>
  // i18n: An author's page title in search results and tabs.
  t('Styles by {username}', { username });

export const siteTitle = (t: Translate, site: string) =>
  // i18n: A site's page title in search results and tabs, such as “YouTube themes and styles”.
  t('{site} themes and styles', { site: siteName(site) });
