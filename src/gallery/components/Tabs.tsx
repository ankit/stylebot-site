import './Tabs.css';

type Props<T extends string> = {
  value: T;
  tabs: Array<[T, string]>;
  label: string;
  onChange: (value: T) => void;
};

export default function Tabs<T extends string>({
  value,
  tabs,
  label,
  onChange,
}: Props<T>) {
  return (
    <div class="tabs" role="group" aria-label={label}>
      {tabs.map(([tab, text]) => (
        <button
          key={tab}
          aria-pressed={value === tab}
          onClick={() => onChange(tab)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
