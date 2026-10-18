import { useRef } from 'preact/hooks';

import { useSearchShortcut } from '@/gallery/hooks/useSearchShortcut';

import CloseIcon from '@/components/icons/CloseIcon';
import SearchIcon from '@/components/icons/SearchIcon';

import { type Translate } from '@/i18n/t';

import './SearchBox.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
  t: Translate;
};

export default function SearchBox({ value, onChange, t }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const label = t('Search sites and styles');

  useSearchShortcut(input);

  const clear = () => {
    onChange('');
    input.current?.focus();
  };

  return (
    <label class="search-box">
      <SearchIcon />

      <input
        ref={input}
        type="search"
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
        placeholder={label}
        aria-label={label}
        maxLength={100}
      />

      {value && (
        <button
          type="button"
          class="icon-btn"
          onClick={clear}
          aria-label={t('Clear search')}
        >
          <CloseIcon />
        </button>
      )}

      {!value && <kbd title={t('Press / to search')}>/</kbd>}
    </label>
  );
}
