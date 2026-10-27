import { useLocation } from 'preact-iso';

import { useStyleEdit } from '@/gallery/hooks/useStyleEdit';
import { type OwnStyle } from '@/gallery/lib/api';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import EditForm from './EditForm';
import PublishHead from './PublishHead';

type Props = {
  style: OwnStyle;
  session: string;
  locale: Locale;
  t: Translate;
};

/**
 * The edit form under its title and site, which goes to Your styles once the
 * style is deleted.
 */
export default function EditSteps({ style, session, locale, t }: Props) {
  const edit = useStyleEdit(session, style);
  const { route } = useLocation();

  return (
    <>
      <PublishHead
        title={t('Edit {name}', { name: edit.style.name })}
        draft={style}
        t={t}
      />

      <EditForm
        edit={edit}
        session={session}
        onDeleted={() => route(localizePath(locale, '/mine'))}
        t={t}
      />
    </>
  );
}
