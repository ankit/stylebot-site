import { type ComponentChildren } from 'preact';

import { type Translate } from '@/i18n/t';

import './PublishField.css';

type Props = {
  label: string;
  optional?: boolean;
  hint?: string;
  // How much of `max` the value takes, shown under the field.
  length?: number;
  max?: number;
  children: ComponentChildren;
  t: Translate;
};

/**
 * A publish form field: its label, marked when it's optional, then the
 * control, then a hint and a character count.
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
  const counted = length !== undefined && max !== undefined;

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

      {(hint || counted) && (
        <span class="publish-field-foot">
          <span>{hint}</span>

          {counted && (
            <span>
              {length} / {max}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
