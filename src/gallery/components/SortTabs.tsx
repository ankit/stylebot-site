import { type Sort } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

import Tabs from './Tabs';

type Props = {
  sort: Sort;
  onChange: (sort: Sort) => void;
  t: Translate;
};

export default function SortTabs({ sort, onChange, t }: Props) {
  return (
    <Tabs
      value={sort}
      tabs={[
        ['popular', t('Most installed')],
        ['new', t('Recently updated')],
      ]}
      label={t('Sort styles')}
      onChange={onChange}
    />
  );
}
