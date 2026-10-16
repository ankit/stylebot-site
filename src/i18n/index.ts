import de from './catalogs/de.json';
import es from './catalogs/es.json';
import fr from './catalogs/fr.json';
import id from './catalogs/id.json';
import it from './catalogs/it.json';
import ja from './catalogs/ja.json';
import ko from './catalogs/ko.json';
import ptBr from './catalogs/pt-br.json';
import ptPt from './catalogs/pt-pt.json';
import ro from './catalogs/ro.json';
import ru from './catalogs/ru.json';
import vi from './catalogs/vi.json';
import zhCn from './catalogs/zh-cn.json';
import zhTw from './catalogs/zh-tw.json';
import { type Locale } from './locales';
import sourceJson from './source.json';
import { type Catalog } from './t';

const source: Array<{ text: string; files: Array<string> }> = sourceJson;

const CATALOGS: Record<Exclude<Locale, 'en'>, Catalog> = {
  de,
  es,
  fr,
  it,
  'pt-br': ptBr,
  'pt-pt': ptPt,
  ro,
  id,
  vi,
  ru,
  ja,
  ko,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
};

export function catalog(locale: Locale): Catalog {
  return locale === 'en' ? {} : CATALOGS[locale];
}

/**
 * The translations an island needs: those of the messages used in files
 * under the given paths, relative to src/, such as 'components/demo/'.
 */
export function islandStrings(locale: Locale, ...paths: Array<string>) {
  const all = catalog(locale);
  const strings: Catalog = {};

  for (const { text, files } of source) {
    if (
      text in all &&
      files.some((f) => paths.some((p) => f.startsWith(`src/${p}`)))
    ) {
      strings[text] = all[text];
    }
  }

  return strings;
}

export * from './format';
export * from './locales';
export * from './t';
