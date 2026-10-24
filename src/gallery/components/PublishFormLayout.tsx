import { type ComponentChildren } from 'preact';

import './PublishForm.css';

type Props = {
  onSubmit: (e: Event) => void;
  children: ComponentChildren;
  aside: ComponentChildren;
};

/**
 * The publish and edit forms' columns: the fields, then the screenshot beside
 * them, or above them on a narrow screen.
 */
export default function PublishFormLayout({
  onSubmit,
  children,
  aside,
}: Props) {
  return (
    <form class="publish-form" onSubmit={onSubmit}>
      <div class="publish-form-main">{children}</div>

      {aside}
    </form>
  );
}
