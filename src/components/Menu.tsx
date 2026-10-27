import { type ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import './Menu.css';

type Props = {
  // What the button that opens the menu shows, and its classes.
  button: ComponentChildren;
  buttonClass: string;
  // The button's accessible name, when what it shows isn't one.
  label?: string;
  class?: string;
  listClass?: string;
  children: ComponentChildren;
};

/**
 * A button opening a list of menu items below it. Choosing an item, Escape
 * or a click outside closes it. Items take the `menu-item` class.
 */
export default function Menu({
  button,
  buttonClass,
  label,
  class: className,
  listClass,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const buttonClasses = [buttonClass];

  if (open) {
    buttonClasses.push('is-open');
  }

  return (
    <div class={['menu', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        class={buttonClasses.join(' ')}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {button}
      </button>

      {open && (
        <>
          <div class="menu-scrim" onClick={() => setOpen(false)} />

          <div
            class={['menu-list', listClass].filter(Boolean).join(' ')}
            role="menu"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
