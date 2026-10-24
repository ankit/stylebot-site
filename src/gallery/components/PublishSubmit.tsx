import Button from '@/components/Button';

import './PublishSubmit.css';

type Props = { label: string; hint?: string; disabled: boolean };

/**
 * The form's submit button, with any line on what it does.
 */
export default function PublishSubmit({ label, hint, disabled }: Props) {
  return (
    <div class="publish-submit">
      <Button type="submit" disabled={disabled}>
        {label}
      </Button>

      {hint && <p>{hint}</p>}
    </div>
  );
}
