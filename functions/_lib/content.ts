import { compactNumber, fullNumber } from '@/gallery/lib/format';
import {
  authorHref,
  siteHref,
  sitesHref,
  styleHref,
} from '@/gallery/lib/paths';
import { siteName } from '@/gallery/lib/siteNames';
import { homeTitle } from '@/gallery/lib/titles';

import { htmlLang, type Locale, localizePath, type Translate } from '@/i18n';

import { type Author, type Site, type Style } from './api';
import { escape } from './html';

export type Content = { locale: Locale; t: Translate; origin: string };

type Link = { name: string; path: string };

const link = (path: string, text: string) =>
  `<a href="${escape(path)}">${escape(text)}</a>`;

const homeLink = ({ locale, t }: Content): Link => ({
  name: t('Gallery'),
  path: localizePath(locale, '/'),
});

function breadcrumbs({ origin }: Content, links: Array<Link>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: links.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.name,
      item: origin + l.path,
    })),
  };
}

function collection(content: Content, name: string, links: Array<Link>) {
  const { locale, origin } = content;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    inLanguage: htmlLang(locale),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: links.map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: l.name,
        url: origin + l.path,
      })),
    },
  };
}

const installs = (count: number) => ({
  '@type': 'InteractionCounter',
  interactionType: 'https://schema.org/InstallAction',
  userInteractionCount: count,
});

const styleLink = ({ locale }: Content, style: Style): Link => ({
  name: style.name,
  path: styleHref(locale, style),
});

const siteLink = ({ locale }: Content, site: string): Link => ({
  name: site,
  path: siteHref(locale, site),
});

function styleList(content: Content, styles: Array<Style>) {
  const { locale } = content;
  const items = styles.map((s) =>
    [
      link(styleHref(locale, s), s.name),
      link(siteHref(locale, s.site), s.site),
      link(authorHref(locale, s.author.username), s.author.username),
    ].join(' · '),
  );

  return `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

function siteList(content: Content, sites: Array<Site>) {
  const items = sites.map((s) => {
    const { name, path } = siteLink(content, s.site);

    return `<li>${link(path, name)}</li>`;
  });

  return `<ul>${items.join('')}</ul>`;
}

const counts = ({ locale, t }: Content, styles: number, count: number) =>
  [
    t('Styles: {count}', { count: fullNumber(locale, styles) }),
    t('Installs: {count}', { count: compactNumber(locale, count) }),
  ].join(' · ');

export function homeContent(
  content: Content,
  styles: Array<Style>,
  sites: Array<Site>,
) {
  const { locale, t, origin } = content;
  const title = homeTitle(t);

  return {
    body: [
      `<h1 class="g-title">${escape(title)}</h1>`,
      `<nav aria-label="${escape(t('Top sites'))}">${siteList(content, sites.slice(0, 12))}`,
      `<p>${link(sitesHref(locale), t('All sites'))}</p></nav>`,
      styleList(content, styles),
    ].join(''),
    data: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Stylebot',
        url: origin + localizePath(locale, '/'),
        inLanguage: htmlLang(locale),
      },
      collection(
        content,
        title,
        styles.map((s) => styleLink(content, s)),
      ),
    ],
  };
}

export function sitesContent(content: Content, sites: Array<Site>) {
  const { locale, t } = content;
  const title = t('All sites');

  return {
    body: [
      `<h1 class="g-title">${escape(title)}</h1>`,
      siteList(content, sites),
    ].join(''),
    data: [
      collection(
        content,
        title,
        sites.map((s) => siteLink(content, s.site)),
      ),
      breadcrumbs(content, [
        homeLink(content),
        { name: title, path: sitesHref(locale) },
      ]),
    ],
  };
}

export function siteContent(
  content: Content,
  site: string,
  styles: Array<Style>,
) {
  const { locale, t } = content;
  const title = t('Styles for {site}', { site: siteName(site) });

  return {
    body: [
      `<h1 class="g-title">${escape(title)}</h1>`,
      styleList(content, styles),
    ].join(''),
    data: [
      collection(
        content,
        title,
        styles.map((s) => styleLink(content, s)),
      ),
      breadcrumbs(content, [
        homeLink(content),
        { name: t('All sites'), path: sitesHref(locale) },
        siteLink(content, site),
      ]),
    ],
  };
}

export function authorContent(
  content: Content,
  author: Author,
  styles: Array<Style>,
) {
  const { locale, origin } = content;
  const path = authorHref(locale, author.username);

  return {
    body: [
      `<h1 class="g-title">${escape(author.username)}</h1>`,
      `<p>${escape(counts(content, author.styles, author.installs))}</p>`,
      styleList(content, styles),
    ].join(''),
    data: [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        inLanguage: htmlLang(locale),
        mainEntity: {
          '@type': 'Person',
          name: author.username,
          url: origin + path,
          interactionStatistic: installs(author.installs),
        },
        hasPart: styles.map((s) => ({
          '@type': 'CreativeWork',
          name: s.name,
          url: origin + styleHref(locale, s),
        })),
      },
      breadcrumbs(content, [
        homeLink(content),
        { name: author.username, path },
      ]),
    ],
  };
}

export function styleContent(
  content: Content,
  style: Style,
  screenshot: string,
) {
  const { locale, t, origin } = content;
  const lang = htmlLang(locale);
  const author = authorHref(locale, style.author.username);
  const updated = new Date(style.updatedAt);
  const alt = t('Screenshot of {name} on {site}', {
    name: style.name,
    site: style.site,
  });
  const facts = [
    [t('Author'), link(author, style.author.username)],
    [t('Installs'), escape(fullNumber(locale, style.installs))],
    [
      t('Updated'),
      `<time datetime="${updated.toISOString()}">${escape(updated.toLocaleDateString(lang, { dateStyle: 'medium' }))}</time>`,
    ],
  ];

  return {
    body: [
      '<article>',
      `<h1 class="g-title">${escape(style.name)}</h1>`,
      `<p>${link(siteHref(locale, style.site), style.site)}</p>`,
      `<img src="${escape(screenshot)}" alt="${escape(alt)}" loading="lazy" />`,
      style.description && `<p>${escape(style.description)}</p>`,
      `<dl>${facts.map(([dt, dd]) => `<dt>${escape(dt)}</dt><dd>${dd}</dd>`).join('')}</dl>`,
      '</article>',
    ].join(''),
    data: [
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: style.name,
        description: style.description ?? undefined,
        url: origin + styleHref(locale, style),
        image: screenshot,
        inLanguage: lang,
        version: style.version,
        dateCreated: new Date(style.createdAt).toISOString(),
        dateModified: updated.toISOString(),
        author: {
          '@type': 'Person',
          name: style.author.username,
          url: origin + author,
        },
        about: {
          '@type': 'WebSite',
          name: style.site,
          url: `https://${style.site}/`,
        },
        interactionStatistic: installs(style.installs),
      },
      breadcrumbs(content, [
        homeLink(content),
        siteLink(content, style.site),
        styleLink(content, style),
      ]),
    ],
  };
}
