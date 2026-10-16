import deDemo from './de/demo';
import deSite from './de/site';
import enDemo from './en/demo';
import enSite from './en/site';
import esDemo from './es/demo';
import esSite from './es/site';
import frDemo from './fr/demo';
import frSite from './fr/site';
import idDemo from './id/demo';
import idSite from './id/site';
import itDemo from './it/demo';
import itSite from './it/site';
import jaDemo from './ja/demo';
import jaSite from './ja/site';
import koDemo from './ko/demo';
import koSite from './ko/site';
import type { Locale } from './locales';
import ptBrDemo from './pt-br/demo';
import ptBrSite from './pt-br/site';
import ptPtDemo from './pt-pt/demo';
import ptPtSite from './pt-pt/site';
import roDemo from './ro/demo';
import roSite from './ro/site';
import ruDemo from './ru/demo';
import ruSite from './ru/site';
import viDemo from './vi/demo';
import viSite from './vi/site';
import zhCnDemo from './zh-cn/demo';
import zhCnSite from './zh-cn/site';
import zhTwDemo from './zh-tw/demo';
import zhTwSite from './zh-tw/site';

export type SiteMessages = typeof enSite;
export type DemoMessages = typeof enDemo;
export type Messages = { site: SiteMessages; demo: DemoMessages };

const MESSAGES: Record<Locale, Messages> = {
  en: { site: enSite, demo: enDemo },
  de: { site: deSite, demo: deDemo },
  es: { site: esSite, demo: esDemo },
  fr: { site: frSite, demo: frDemo },
  it: { site: itSite, demo: itDemo },
  'pt-br': { site: ptBrSite, demo: ptBrDemo },
  'pt-pt': { site: ptPtSite, demo: ptPtDemo },
  ro: { site: roSite, demo: roDemo },
  id: { site: idSite, demo: idDemo },
  vi: { site: viSite, demo: viDemo },
  ru: { site: ruSite, demo: ruDemo },
  ja: { site: jaSite, demo: jaDemo },
  ko: { site: koSite, demo: koDemo },
  'zh-cn': { site: zhCnSite, demo: zhCnDemo },
  'zh-tw': { site: zhTwSite, demo: zhTwDemo },
};

export function messages(locale: Locale): Messages {
  return MESSAGES[locale];
}

export * from './format';
export * from './locales';
