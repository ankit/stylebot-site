import { useState } from 'preact/hooks';

function hasFiles(e: DragEvent) {
  return e.dataTransfer?.types.includes('Files') ?? false;
}

/**
 * Handlers that make an element take a dropped file, passing the first one to
 * `onDrop`, with whether a file is being dragged over it.
 */
export function useFileDrop(onDrop: (file: File) => void) {
  const [over, setOver] = useState(false);

  const onDragOver = (e: DragEvent) => {
    if (!hasFiles(e)) {
      return;
    }

    e.preventDefault();
    setOver(true);
  };

  // Moving onto a child fires dragleave on the element itself.
  const onDragLeave = (e: DragEvent) => {
    const target = e.currentTarget as HTMLElement;

    if (!target.contains(e.relatedTarget as Node | null)) {
      setOver(false);
    }
  };

  const onDropFile = (e: DragEvent) => {
    if (!hasFiles(e)) {
      return;
    }

    e.preventDefault();
    setOver(false);

    const file = e.dataTransfer?.files[0];

    if (file) {
      onDrop(file);
    }
  };

  return {
    over,
    handlers: { onDragOver, onDragLeave, onDrop: onDropFile },
  };
}
