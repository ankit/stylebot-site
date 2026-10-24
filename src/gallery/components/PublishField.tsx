import { type ComponentChildren } from 'preact';

import { type Translate } from '@/i18n/t';

import './PublishField.css';

type Props = {
  label: string;
  optional?: boolean;
  hint?: string;
  // How much of `max` the value takes, shown under the field once it's over.
  length?: number;
  max?: number;
  children: ComponentChildren;
  t: Translate;
};

/**
 * A publish form field: its label, marked when it's optional, then the
 * control, then a hint and, once the value is too long, a character count.
 */
export default function PublishField({
  label,
  optional = false,
  hint,
  length,
  max,
  children,
  t,
}: Props) {
  const over = length !== undefined && max !== undefined && length > max;

  return (
    <label class="publish-field">
      <span class="publish-field-head">
        {label}

        {optional && (
          <span class="publish-field-optional">
            {
              // i18n: Beside the label of a form field that can be left empty.
              t('Optional')
            }
          </span>
        )}
      </span>

      {children}

      {(hint || over) && (
        <span class="publish-field-foot">
          <span>{hint}</span>

          {over && (
            <span class="publish-field-over" role="alert">
              {length} / {max}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
