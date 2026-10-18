import { type Style } from '@/gallery/lib/api';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import LoadError from './LoadError';
import ScrollSentinel from './ScrollSentinel';
import StyleCard from './StyleCard';
import StyleCardSkeleton from './StyleCardSkeleton';

import './StyleGrid.css';

type Props = {
  feed: {
    items: Array<Style>;
    loading: boolean;
    error: unknown;
    hasMore: boolean;
    more: () => void;
    retry: () => void;
  };
  locale: Locale;
  t: Translate;
};

/**
 * Styles as a grid of cards that loads more as the reader scrolls, with
 * placeholders while a page loads and a retry when one fails.
 */
export default function StyleGrid({ feed, locale, t }: Props) {
  return (
    <>
      <div class="style-grid" aria-busy={feed.loading}>
        {feed.items.map((style) => (
          <StyleCard key={style.id} style={style} locale={locale} t={t} />
        ))}

        {feed.loading && <StyleCardSkeleton count={6} />}
      </div>

      {feed.error && (
        <LoadError
          message={t('Couldn’t load styles.')}
          onRetry={feed.retry}
          t={t}
        />
      )}

      {feed.hasMore && !feed.error && <ScrollSentinel onVisible={feed.more} />}
    </>
  );
}
