import { type ComponentChildren } from 'preact';

import Button from '@/components/Button';

import './PublishSubmit.css';

type Props = {
  label: string;
  disabled: boolean;
  // Other buttons, beside the submit button.
  children?: ComponentChildren;
};

/**
 * The form's submit button, with any other buttons beside it.
 */
export default function PublishSubmit({ label, disabled, children }: Props) {
  return (
    <div class="publish-submit">
      <Button type="submit" disabled={disabled}>
        {label}
      </Button>

      {children}
    </div>
  );
}
