import { useState } from 'preact/hooks';

import { type OwnStyle, updateStyle } from '@/gallery/lib/api';

import { useAction } from './useAction';
import { useScreenshotChoices } from './useScreenshotChoices';

/**
 * A style's name, description and screenshots being edited, and `save`, which
 * changes them without a new version. `style` is the style as last saved.
 * `saved` says the last save went through, and whether its screenshots hid the
 * style until a moderator looks at it, until the next change.
 */
export function useStyleEdit(session: string, initial: OwnStyle) {
  const [style, setStyle] = useState(initial);
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description ?? '');
  const [saved, setSaved] = useState<'saved' | 'hidden'>();
  const choices = useScreenshotChoices(null, style.screenshots, () =>
    setSaved(undefined),
  );

  const save = useAction(
    async () =>
      updateStyle(session, style.id, {
        name: name.trim(),
        description: description.trim(),
        screenshots: await choices.entries(),
      }),
    (next) => {
      let result: 'saved' | 'hidden' = 'saved';

      if (style.status === 'live' && next.status !== 'live') {
        result = 'hidden';
      }

      setStyle(next);
      setSaved(result);
      choices.reset(next.screenshots);
    },
  );

  const changed =
    <T>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setSaved(undefined);
    };

  return {
    style,
    name,
    description,
    setName: changed(setName),
    setDescription: changed(setDescription),
    choices,
    save,
    saved,
  };
}
