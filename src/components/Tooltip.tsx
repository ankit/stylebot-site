import { type ComponentChildren } from 'preact';

import './Tooltip.css';

/**
 * A label that shows below its parent while it's hovered or focused. The
 * parent needs a position, and its own accessible name, since screen readers
 * skip the tooltip.
 */
export default function Tooltip({ children }: { children: ComponentChildren }) {
  return (
    <span class="tooltip" aria-hidden="true">
      {children}
    </span>
  );
}
