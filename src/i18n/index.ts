import deDemo from './de/demo';
import deGallery from './de/gallery';
import deSite from './de/site';
import enDemo from './en/demo';
import enGallery from './en/gallery';
import enSite from './en/site';
import esDemo from './es/demo';
import esGallery from './es/gallery';
import esSite from './es/site';
import frDemo from './fr/demo';
import frGallery from './fr/gallery';
import frSite from './fr/site';
import idDemo from './id/demo';
import idGallery from './id/gallery';
import idSite from './id/site';
import itDemo from './it/demo';
import itGallery from './it/gallery';
import itSite from './it/site';
import jaDemo from './ja/demo';
import jaGallery from './ja/gallery';
import jaSite from './ja/site';
import koDemo from './ko/demo';
import koGallery from './ko/gallery';
import koSite from './ko/site';
import { type Locale, localeOf } from './locales';
import ptBrDemo from './pt-br/demo';
import ptBrGallery from './pt-br/gallery';
import ptBrSite from './pt-br/site';
import ptPtDemo from './pt-pt/demo';
import ptPtGallery from './pt-pt/gallery';
import ptPtSite from './pt-pt/site';
import roDemo from './ro/demo';
import roGallery from './ro/gallery';
import roSite from './ro/site';
import ruDemo from './ru/demo';
import ruGallery from './ru/gallery';
import ruSite from './ru/site';
import viDemo from './vi/demo';
import viGallery from './vi/gallery';
import viSite from './vi/site';
import zhCnDemo from './zh-cn/demo';
import zhCnGallery from './zh-cn/gallery';
import zhCnSite from './zh-cn/site';
import zhTwDemo from './zh-tw/demo';
import zhTwGallery from './zh-tw/gallery';
import zhTwSite from './zh-tw/site';

export type SiteMessages = typeof enSite;
export type DemoMessages = typeof enDemo;
export type Plural = { other: string } & Partial<
  Record<'zero' | 'one' | 'two' | 'few' | 'many', string>
>;

/**
 * A catalog's type with its plural forms loosened, so each language can list
 * the forms it needs.
 */
type WithPlurals<T> = T extends { one: string; other: string }
  ? Plural
  : T extends string
    ? string
    : { [K in keyof T]: WithPlurals<T[K]> };

export type GalleryMessages = WithPlurals<typeof enGallery>;
export type Messages = {
  site: SiteMessages;
  demo: DemoMessages;
  gallery: GalleryMessages;
};

const MESSAGES: Record<Locale, Messages> = {
  en: { site: enSite, demo: enDemo, gallery: enGallery },
  de: { site: deSite, demo: deDemo, gallery: deGallery },
  es: { site: esSite, demo: esDemo, gallery: esGallery },
  fr: { site: frSite, demo: frDemo, gallery: frGallery },
  it: { site: itSite, demo: itDemo, gallery: itGallery },
  'pt-br': { site: ptBrSite, demo: ptBrDemo, gallery: ptBrGallery },
  'pt-pt': { site: ptPtSite, demo: ptPtDemo, gallery: ptPtGallery },
  ro: { site: roSite, demo: roDemo, gallery: roGallery },
  id: { site: idSite, demo: idDemo, gallery: idGallery },
  vi: { site: viSite, demo: viDemo, gallery: viGallery },
  ru: { site: ruSite, demo: ruDemo, gallery: ruGallery },
  ja: { site: jaSite, demo: jaDemo, gallery: jaGallery },
  ko: { site: koSite, demo: koDemo, gallery: koGallery },
  'zh-cn': { site: zhCnSite, demo: zhCnDemo, gallery: zhCnGallery },
  'zh-tw': { site: zhTwSite, demo: zhTwDemo, gallery: zhTwGallery },
};

export function messages(locale: Locale): Messages {
  return MESSAGES[locale];
}

/**
 * The messages for the page at a URL, from its locale prefix.
 */
export function messagesFor(url: URL) {
  const locale = localeOf(url.pathname);

  return { locale, ...messages(locale) };
}

export * from './format';
export * from './locales';
