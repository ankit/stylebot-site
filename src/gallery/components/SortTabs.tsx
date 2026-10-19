import { type Sort } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

import './SortTabs.css';

type Props = {
  sort: Sort;
  onChange: (sort: Sort) => void;
  t: Translate;
};

export default function SortTabs({ sort, onChange, t }: Props) {
  const tabs: Array<[Sort, string]> = [
    ['popular', t('Most installed')],
    ['new', t('Recently updated')],
  ];

  return (
    <div class="sort-tabs" role="group" aria-label={t('Sort styles')}>
      {tabs.map(([value, label]) => (
        <button
          key={value}
          aria-pressed={sort === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
