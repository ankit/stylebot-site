import { listStyles } from '@/gallery/lib/api';
import { useRequest } from '@/gallery/lib/request';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import StyleCard from './StyleCard';
import StyleCardSkeleton from './StyleCardSkeleton';

import './Browse.css';

const PAGE = 24;

type Props = { locale: Locale; strings: Catalog };

/**
 * The most-installed styles, as a grid of cards.
 */
export default function Browse({ locale, strings }: Props) {
  const t = translator(strings);
  const feed = useRequest(() =>
    listStyles({ sort: 'popular', limit: PAGE }).then((page) => page.styles),
  );

  if (feed.error) {
    return (
      <div class="browse-note" role="alert">
        {t('Couldn’t load styles.')}
        <button class="btn btn-outline btn-sm" onClick={feed.reload}>
          {t('Try again')}
        </button>
      </div>
    );
  }

  if (feed.data?.length === 0) {
    return <div class="browse-note">{t('No styles yet.')}</div>;
  }

  return (
    <div class="browse-grid" aria-busy={feed.loading}>
      {feed.data?.map((style) => (
        <StyleCard key={style.id} style={style} locale={locale} t={t} />
      ))}
      {feed.loading && <StyleCardSkeleton count={6} />}
    </div>
  );
}
