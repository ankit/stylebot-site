import { type StyleOption } from '@/gallery/lib/styleOptions';

import StarIcon from '@/components/icons/StarIcon';
import Tooltip from '@/components/Tooltip';

import { type Translate } from '@/i18n/t';

import './StyleOptionChoices.css';

type Props = { option: StyleOption; t: Translate };

type ChoiceProps = { label: string; isDefault: boolean; t: Translate };

function Choice({ label, isDefault, t }: ChoiceProps) {
  if (!isDefault) {
    return <li>{label}</li>;
  }

  // i18n: Marks the choice a style option starts with.
  const defaultLabel = t('Default', { context: 'option' });

  return (
    <li class="is-default">
      {label}

      <span role="img" aria-label={defaultLabel}>
        <StarIcon size={10} />

        <Tooltip>{defaultLabel}</Tooltip>
      </span>
    </li>
  );
}

/**
 * A select's choices, with the default marked, or whether a checkbox starts
 * on or off.
 */
export default function StyleOptionChoices({ option, t }: Props) {
  if (option.type === 'checkbox') {
    if (option.default === '1') {
      // i18n: A style option that's a switch, turned on unless the user turns it off.
      return <>{t('On by default')}</>;
    }

    // i18n: A style option that's a switch, turned off unless the user turns it on.
    return <>{t('Off by default')}</>;
  }

  return (
    <ul class="style-option-choices">
      {option.choices.map((choice) => (
        <Choice
          key={choice.value}
          label={choice.label}
          isDefault={choice.value === option.default}
          t={t}
        />
      ))}
    </ul>
  );
}
