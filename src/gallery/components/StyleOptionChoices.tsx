import { type StyleOption } from '@/gallery/lib/styleOptions';

import CheckIcon from '@/components/icons/CheckIcon';

import { type Translate } from '@/i18n/t';

import './StyleOptionChoices.css';

type Props = { option: StyleOption; t: Translate };

/**
 * A select's choices, with the default checked, or whether a checkbox starts
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
        <li key={choice.value}>
          {choice.label}

          {choice.value === option.default && (
            <span
              role="img"
              aria-label={
                // i18n: Marks the choice a style option starts with.
                t('Default', { context: 'option' })
              }
            >
              <CheckIcon size={11} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
