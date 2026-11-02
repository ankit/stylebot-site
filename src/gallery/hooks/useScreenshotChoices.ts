import { useState } from 'preact/hooks';

import { type ScreenshotEntry } from '@/gallery/lib/api';

import { useScreenshotChoice } from './useScreenshotChoice';

export type ScreenshotChoice = ReturnType<typeof useScreenshotChoice>;

// The most screenshots the API takes for a style.
export const MAX_SCREENSHOTS = 4;

const FIRST_ORDER = [0, 1, 2, 3];

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
 * A style's screenshot slots, in `order` with the cover first, and the slot
 * `shown` large. Only the cover shows while empty; `entries` is what to
 * send, or undefined when nothing changed.
 */
export function useScreenshotChoices(
  tabShot: string | null,
  current: Array<string>,
  onChange?: () => void,
) {
  const all = [
    useScreenshotChoice(tabShot, current[0]),
    useScreenshotChoice(null, current[1]),
    useScreenshotChoice(null, current[2]),
    useScreenshotChoice(null, current[3]),
  ];
  const [order, setOrder] = useState(FIRST_ORDER);
  const [shown, setShown] = useState(0);
  const coverId = order[0];

  const changing =
    <A extends Array<unknown>>(run: (...args: A) => void) =>
    (...args: A) => {
      run(...args);
      onChange?.();
    };

  const slots = all.map((choice, id) => ({
    ...choice,
    id,
    upload: changing(choice.upload),
    choose: changing(choice.choose),
    remove: changing(() => {
      choice.remove();
      setShown(coverId);
    }),
    setRegions: changing(choice.setRegions),
  }));

  const listed = order
    .filter((id) => id === coverId || all[id].preview)
    .map((id) => slots[id]);

  const entries = async () => {
    const picked = await Promise.all(order.map((id) => toEntry(all[id])));
    const list = picked.filter((entry) => entry !== undefined);

    if (sameScreenshots(list, current)) {
      return undefined;
    }

    return list;
  };

  // After a save, back to the style's screenshots as they now are.
  const reset = (saved: Array<string>) => {
    setOrder(FIRST_ORDER);
    setShown(0);

    all.forEach((choice, i) => {
      if (saved[i]) {
        choice.choose('current');
      } else {
        choice.remove();
      }
    });
  };

  // A new screenshot goes after the ones in use, in an empty slot with
  // nothing of its own to go back to where there's one.
  const add = (file: File) => {
    const free = order.filter((slot) => slot !== coverId && !all[slot].preview);
    const id =
      free.find((slot) => !all[slot].canKeepCurrent && !all[slot].canUseTab) ??
      free[0];

    if (id === undefined) {
      return;
    }

    slots[id].upload(file);
    setOrder([...order.filter((slot) => slot !== id), id]);
    setShown(id);
  };

  return {
    cover: slots[coverId],
    listed,
    canAdd: listed.length < MAX_SCREENSHOTS,
    // A blurred copy is still being made.
    pending: all.some((choice) => choice.pending),
    shown: slots[shown],
    show: setShown,
    makeCover: changing((id: number) => {
      setOrder([id, ...order.filter((slot) => slot !== id)]);
      setShown(id);
    }),
    add,
    entries,
    reset,
  };
}
