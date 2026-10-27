import { useFilePicker } from '@/gallery/hooks/useFilePicker';

type Props = {
  label: string;
  class: string;
  onUpload: (file: File) => void;
};

/**
 * A button that opens the file picker for a screenshot.
 */
export default function ScreenshotUploadButton({
  label,
  class: className,
  onUpload,
}: Props) {
  const picker = useFilePicker(onUpload);

  return (
    <>
      <button type="button" class={className} onClick={picker.open}>
        {label}
      </button>

      <input {...picker.inputProps} />
    </>
  );
}
