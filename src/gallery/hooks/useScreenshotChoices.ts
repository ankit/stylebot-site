import { useState } from 'preact/hooks';

import { type ScreenshotEntry } from '@/gallery/lib/api';

import { useScreenshotChoice } from './useScreenshotChoice';

export type ScreenshotChoice = ReturnType<typeof useScreenshotChoice>;

// A string screenshot is the data: URL of the one Stylebot took.
async function toEntry(choice: ScreenshotChoice) {
  if (typeof choice.screenshot === 'string') {
    return (await fetch(choice.screenshot)).blob();
  }

  return choice.screenshot ?? choice.kept;
}

function sameScreenshots(
  entries: Array<ScreenshotEntry>,
  current: Array<string>,
) {
  return (
    entries.length === current.length &&
    entries.every((entry, i) => entry === current[i])
  );
}

/**
 * A style's two screenshot slots, cover first, and which one is `shown`
 * large. `entries` is what to send, or undefined when nothing changed.
 */
export function useScreenshotChoices(
  tabShot: string | null,
  current: Array<string>,
  onChange?: () => void,
) {
  const first = useScreenshotChoice(tabShot, current[0]);
  const second = useScreenshotChoice(null, current[1]);
  const [swapped, setSwapped] = useState(false);
  const [shown, setShown] = useState<0 | 1>(0);
  let ordered = [first, second];

  if (swapped) {
    ordered = [second, first];
  }

  const changing =
    <A extends Array<unknown>>(run: (...args: A) => void) =>
    (...args: A) => {
      run(...args);
      onChange?.();
    };

  const slots = ordered.map((choice) => ({
    ...choice,
    upload: changing(choice.upload),
    choose: changing(choice.choose),
    remove: changing(() => {
      choice.remove();
      setShown(0);
    }),
    setRegions: changing(choice.setRegions),
  }));

  const entries = async () => {
    const picked = await Promise.all(ordered.map(toEntry));
    const list = picked.filter((entry) => entry !== undefined);

    if (sameScreenshots(list, current)) {
      return undefined;
    }

    return list;
  };

  // After a save, back to the style's screenshots as they now are.
  const reset = (saved: Array<string>) => {
    setSwapped(false);
    setShown(0);

    [first, second].forEach((choice, i) => {
      if (saved[i]) {
        choice.choose('current');
      } else {
        choice.remove();
      }
    });
  };

  return {
    cover: slots[0],
    second: slots[1],
    // A blurred copy is still being made.
    pending: first.pending || second.pending,
    shown,
    show: setShown,
    swap: changing(() => {
      setSwapped(!swapped);
      setShown(0);
    }),
    add: (file: File) => {
      slots[1].upload(file);
      setShown(1);
    },
    entries,
    reset,
  };
}
