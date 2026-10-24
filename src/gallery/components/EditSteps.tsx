import { useStyleEdit } from '@/gallery/hooks/useStyleEdit';
import { type OwnStyle } from '@/gallery/lib/api';

import { type Translate } from '@/i18n/t';

import EditForm from './EditForm';
import PublishHead from './PublishHead';

type Props = { style: OwnStyle; session: string; t: Translate };

/**
 * The edit form under its title and site.
 */
export default function EditSteps({ style, session, t }: Props) {
  const edit = useStyleEdit(session, style);

  return (
    <>
      <PublishHead
        title={t('Edit {name}', { name: edit.style.name })}
        draft={{ site: style.site, url: `https://${style.site}` }}
        t={t}
      />

      <EditForm edit={edit} t={t} />
    </>
  );
}
