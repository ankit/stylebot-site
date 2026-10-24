import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { useSession } from '@/gallery/hooks/useSession';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import EditFlow from './EditFlow';
import PublishHead from './PublishHead';
import SignInButton from './SignInButton';

import './EditPage.css';

type Props = { id: string; locale: Locale; strings: Catalog };

/**
 * Edits one of the account's styles without publishing a new version: its
 * name, description and screenshot, not its CSS. Stylebot links here.
 */
export default function EditPage({ id, strings }: Props) {
  const t = translator(strings);
  const session = useSession();
  const title = t('Edit style');

  usePageMeta(t('{title} | Stylebot', { title }), { noindex: true });

  return (
    <div class="edit-page">
      {session === null && (
        <>
          <PublishHead title={title} t={t} />

          <div class="g-empty">
            <p>{t('Sign in to see and manage the styles you’ve published.')}</p>

            <SignInButton t={t} />
          </div>
        </>
      )}

      {session && <EditFlow id={Number(id)} session={session.session} t={t} />}
    </div>
  );
}
