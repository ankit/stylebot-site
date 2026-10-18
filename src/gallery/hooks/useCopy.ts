import { useEffect, useState } from 'preact/hooks';

const COPIED_MS = 1600;

// The older way to copy, for when the Clipboard API is blocked, such as on a
// page without focus.
function copyBySelecting(text: string) {
  const area = document.createElement('textarea');

  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();

  const copied = document.execCommand('copy');

  area.remove();

  return copied;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return copyBySelecting(text);
  }
}

/**
 * Copies text to the clipboard. `copied` stays true for a moment after a copy
 * works, for a button to say so.
 */
export function useCopy() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), COPIED_MS);

    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async (text: string) => setCopied(await copyText(text));

  return { copied, copy };
}
