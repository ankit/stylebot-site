import { useState } from 'preact/hooks';

import { type OwnStyle } from '@/gallery/lib/api';
import { type PublishDraft } from '@/gallery/lib/bridge';

/**
 * The name, description and version notes being published, starting from
 * the style an update is for, or the draft's profile name. `details` is what
 * to send, trimmed.
 */
export function usePublishDetails(
  draft: PublishDraft,
  existing: OwnStyle | null,
) {
  const [name, setName] = useState(existing?.name ?? draft.name);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [notes, setNotes] = useState('');

  return {
    name,
    description,
    notes,
    setName,
    setDescription,
    setNotes,
    details: {
      name: name.trim(),
      description: description.trim(),
      notes: notes.trim(),
    },
  };
}
