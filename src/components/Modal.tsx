import { type ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import CloseIcon from '@/components/icons/CloseIcon';

import './Modal.css';

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  class?: string;
  children: ComponentChildren;
};

/**
 * A modal dialog over a dimmed page, shown while `open`. Escape, a click on
 * the backdrop or its close button calls `onClose`.
 */
export default function Modal({
  open,
  onClose,
  label,
  closeLabel,
  class: className = '',
  children,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;

    if (open && !element?.open) {
      element?.showModal();
    }

    if (!open && element?.open) {
      element.close();
    }
  }, [open]);

  const onClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialog}
      class={`modal ${className}`}
      aria-label={label}
      onClose={onClose}
      onClick={onClick}
    >
      {children}

      <button
        type="button"
        class="modal-close"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <CloseIcon strokeWidth={1.6} />
      </button>
    </dialog>
  );
}
