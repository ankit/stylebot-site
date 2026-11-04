import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { pageTitle } from '@/gallery/lib/titles';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import NotFound from './NotFound';

type Props = { locale: Locale; strings: Catalog };

export default function NotFoundPage({ locale, strings }: Props) {
  const t = translator(strings);
  const title = t('Page not found');

  usePageMeta(pageTitle(t, title), { noindex: true });

  return <NotFound title={title} locale={locale} t={t} />;
}
