import { type ComponentChildren } from 'preact';

import './PublishForm.css';

type Props = {
  onSubmit: (e: Event) => void;
  children: ComponentChildren;
  aside: ComponentChildren;
  footer?: ComponentChildren;
};

/**
 * The publish and edit forms' columns: the fields, then the screenshots beside
 * them, or above them on a narrow screen, with `footer`, the submit button,
 * under both, since it saves both.
 */
export default function PublishFormLayout({
  onSubmit,
  children,
  aside,
  footer,
}: Props) {
  return (
    <form class="publish-form" onSubmit={onSubmit}>
      <div class="publish-form-main">{children}</div>

      {aside}

      {footer && <div class="publish-form-footer">{footer}</div>}
    </form>
  );
}
