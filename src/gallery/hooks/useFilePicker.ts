import { useRef } from 'preact/hooks';

import { SCREENSHOT_TYPES } from './useScreenshotChoice';

/**
 * A hidden screenshot file input's props, and `open`, which shows its file
 * picker, for a button or menu item that isn't its label.
 */
export function useFilePicker(onPick: (file: File) => void) {
  const ref = useRef<HTMLInputElement>(null);

  const onChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const picked = input.files?.[0];

    if (picked) {
      onPick(picked);
    }

    input.value = '';
  };

  return {
    inputProps: {
      ref,
      type: 'file',
      class: 'sr-only',
      tabIndex: -1,
      accept: SCREENSHOT_TYPES.join(','),
      onChange,
    },
    open: () => ref.current?.click(),
  };
}
