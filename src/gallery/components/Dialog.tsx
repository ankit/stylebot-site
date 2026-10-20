import { type ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import './Dialog.css';

type Props = {
  title: string;
  onClose: () => void;
  // False for a dialog that needs an answer from its buttons.
  dismissible?: boolean;
  children: ComponentChildren;
  actions: ComponentChildren;
};

/**
 * A small modal dialog with a title, a body and buttons at the bottom.
 * Escape or a click on the backdrop calls `onClose`, unless it's not
 * `dismissible`.
 */
export default function Dialog({
  title,
  onClose,
  dismissible = true,
  children,
  actions,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const onClick = (e: MouseEvent) => {
    if (dismissible && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Chrome closes a dialog on a second Escape even when its cancel event is
  // prevented, so the key itself is stopped too.
  const onKeyDown = (e: KeyboardEvent) => {
    if (!dismissible && e.key === 'Escape') {
      e.preventDefault();
    }
  };

  const onCancel = (e: Event) => {
    if (!dismissible) {
      e.preventDefault();
    }
  };

  return (
    <dialog
      ref={dialog}
      class="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onCancel={onCancel}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div class="dialog-body">
        <h2 id="dialog-title">{title}</h2>

        {children}
      </div>

      <div class="dialog-actions">{actions}</div>
    </dialog>
  );
}
