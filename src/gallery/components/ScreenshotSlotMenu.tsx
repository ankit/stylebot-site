import { type ComponentChildren } from 'preact';

import { useFilePicker } from '@/gallery/hooks/useFilePicker';
import { type ScreenshotChoice } from '@/gallery/hooks/useScreenshotChoices';

import Menu from '@/components/Menu';

import { type Translate } from '@/i18n/t';

import './ScreenshotSlotMenu.css';

type Props = {
  choice: ScreenshotChoice;
  number: 1 | 2;
  onBlur: () => void;
  // Items after Replace.
  children?: ComponentChildren;
  t: Translate;
};

/**
 * The Edit button under a screenshot, opening Blur areas where it can be blurred,
 * Replace, and `children`.
 */
export default function ScreenshotSlotMenu({
  choice,
  number,
  onBlur,
  children,
  t,
}: Props) {
  const picker = useFilePicker(choice.upload);

  return (
    <div class="screenshot-slot-menu">
      <Menu
        buttonClass="screenshot-slot-menu-button"
        listClass="screenshot-slot-menu-list"
        label={
          // i18n: The Edit button under a screenshot, for screen readers;
          // {number} is 1 for the cover or 2.
          t('Edit screenshot {number}', { number })
        }
        button={
          // i18n: Under a screenshot, opens Blur areas, Replace and so on.
          t('Edit')
        }
      >
        {choice.canBlur && (
          <button
            type="button"
            role="menuitem"
            class="menu-item"
            onClick={onBlur}
          >
            {
              // i18n: Opens the screenshot full size to mark parts to blur.
              t('Blur areas…')
            }
          </button>
        )}

        <button
          type="button"
          role="menuitem"
          class="menu-item"
          onClick={picker.open}
        >
          {
            // i18n: Picks another image in place of this screenshot.
            t('Replace')
          }
        </button>

        {children}
      </Menu>

      <input {...picker.inputProps} />
    </div>
  );
}
