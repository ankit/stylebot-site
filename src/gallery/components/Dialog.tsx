import { type ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import './Dialog.css';

type Props = {
  title: string;
  onClose: () => void;
  children: ComponentChildren;
  actions: ComponentChildren;
};

/**
 * A small modal dialog with a title, a body and buttons at the bottom.
 * Escape or a click on the backdrop calls `onClose`.
 */
export default function Dialog({ title, onClose, children, actions }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const onClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialog}
      class="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={onClick}
    >
      <div class="dialog-body">
        <h2 id="dialog-title">{title}</h2>

        {children}
      </div>

      <div class="dialog-actions">{actions}</div>
    </dialog>
  );
}
