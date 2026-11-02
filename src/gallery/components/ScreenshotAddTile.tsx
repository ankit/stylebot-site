import { useFileDrop } from '@/gallery/hooks/useFileDrop';
import { useFilePicker } from '@/gallery/hooks/useFilePicker';

import PlusIcon from '@/components/icons/PlusIcon';

import { type Translate } from '@/i18n/t';

type Props = {
  onAdd: (file: File) => void;
  t: Translate;
};

/**
 * The tile after the thumbnails that adds another screenshot, picked
 * or dropped on it.
 */
export default function ScreenshotAddTile({ onAdd, t }: Props) {
  const picker = useFilePicker(onAdd);
  const drop = useFileDrop(onAdd);

  return (
    <>
      <button
        type="button"
        class="screenshot-thumbnails-add"
        data-over={drop.over || undefined}
        onClick={picker.open}
        {...drop.handlers}
      >
        <PlusIcon />

        {t('Add image')}
      </button>

      <input {...picker.inputProps} />
    </>
  );
}
