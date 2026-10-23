import { usePageMeta } from '@/gallery/hooks/usePageMeta';
import { usePublishDraft } from '@/gallery/hooks/usePublishDraft';
import { useQueryParam } from '@/gallery/hooks/useQueryParam';
import { useSession } from '@/gallery/hooks/useSession';

import { type Locale } from '@/i18n/locales';
import { type Catalog, translator } from '@/i18n/t';

import PublishFlow from './PublishFlow';
import PublishHead from './PublishHead';
import PublishUnavailable from './PublishUnavailable';
import SignInButton from './SignInButton';

import './PublishPage.css';

type Props = { locale: Locale; strings: Catalog };

/**
 * Publishes the style Stylebot opened this page with, as named by its
 * `?draft=`, once the person is signed in.
 */
export default function PublishPage({ locale, strings }: Props) {
  const t = translator(strings);
  const [nonce] = useQueryParam('draft');
  const draft = usePublishDraft(nonce);
  const session = useSession();
  const title = t('Publish to the Gallery');

  usePageMeta(t('{title} | Stylebot', { title }), { noindex: true });

  if (draft && session) {
    return (
      <div class="publish-page">
        <PublishFlow
          draft={draft}
          nonce={nonce}
          session={session}
          locale={locale}
          t={t}
        />
      </div>
    );
  }

  return (
    <div class="publish-page">
      <PublishHead draft={draft} t={t} />

      {draft === null && <PublishUnavailable locale={locale} t={t} />}

      {draft && session === null && (
        <div class="g-empty">
          <p>
            {t('Sign in to publish {name} for {site}.', {
              name: draft.name,
              site: draft.site,
            })}
          </p>

          <SignInButton t={t} />
        </div>
      )}
    </div>
  );
}
