import { type ComponentChildren } from 'preact';

import Button from '@/components/Button';

import './PublishSubmit.css';

type Props = {
  label: string;
  hint?: string;
  disabled: boolean;
  // Other buttons, beside the submit button.
  children?: ComponentChildren;
};

/**
 * The form's submit button, with any other buttons beside it and any line on
 * what it does.
 */
export default function PublishSubmit({
  label,
  hint,
  disabled,
  children,
}: Props) {
  return (
    <div class="publish-submit">
      <div class="publish-submit-buttons">
        <Button type="submit" disabled={disabled}>
          {label}
        </Button>

        {children}
      </div>

      {hint && <p>{hint}</p>}
    </div>
  );
}
