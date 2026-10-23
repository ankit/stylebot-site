import { type LinkState } from '@/gallery/hooks/usePublish';
import { type PublishedStyle } from '@/gallery/lib/api';
import { styleHref } from '@/gallery/lib/paths';

import Button from '@/components/Button';
import ButtonLink from '@/components/ButtonLink';
import CheckIcon from '@/components/icons/CheckIcon';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import CopyButton from './CopyButton';

import './PublishedNotice.css';

// What was published: a new style, a new version, or only its details.
export type PublishedKind = 'new' | 'version' | 'details';

type Props = {
  style: PublishedStyle;
  kind: PublishedKind;
  screenshot: string | undefined;
  link: LinkState;
  onRetryLink: () => void;
  locale: Locale;
  t: Translate;
};

/**
 * What was published, beside the screenshot that went with it: its link to
 * share, any CSS the Gallery took out, and whether Stylebot has linked the
 * style to it, with a retry until it has.
 */
export default function PublishedNotice({
  style,
  kind,
  screenshot,
  link,
  onRetryLink,
  locale,
  t,
}: Props) {
  const live = style.status === 'live';
  const path = styleHref(locale, style);
  const url = location.origin + path;
  let tag = t('Published');
  let heading = t('{name} is live', { name: style.name });
  let summary = t('Anyone can now install it on {site}.', { site: style.site });

  if (kind === 'version') {
    heading = t('Version {version} of {name} is live', {
      version: style.version,
      name: style.name,
    });
    summary = t('Everyone who installed it gets the update.');
  }

  if (!live) {
    heading = t('{name} is published', { name: style.name });
    summary = t(
      'It’s hidden from the Gallery until a moderator has looked at its screenshot.',
    );
  }

  if (kind === 'details') {
    // i18n: A tag on the page after saving a style's name and description.
    tag = t('Saved');
    heading = t('{name} is saved', { name: style.name });
    summary = t('Its name and description are updated. Installs aren’t.');
  }

  return (
    <div class="published">
      <div class="published-main">
        <div class="published-head">
          <span class="published-tag">
            <CheckIcon size={12} />
            {tag}
          </span>

          <h1>{heading}</h1>

          <p>{summary}</p>
        </div>

        {link === 'linking' && (
          <p class="published-note">{t('Telling Stylebot…')}</p>
        )}

        {link === 'unlinked' && (
          <div class="published-unlinked" role="alert">
            <p>
              {t(
                'Stylebot didn’t hear that it’s published, so publishing from it again would make a second style. Keep this tab open and try again.',
              )}
            </p>

            <Button variant="outline" size="sm" onClick={onRetryLink}>
              {t('Try again')}
            </Button>
          </div>
        )}

        {live && (
          <div class="published-link">
            <span>
              {
                // i18n: The label above the address of a published style, to share.
                t('Link')
              }
            </span>

            <div class="published-link-box">
              <code>{url.replace(/^https?:\/\//, '')}</code>

              <CopyButton text={url} label={t('Copy link')} t={t} />
            </div>
          </div>
        )}

        <div class="published-actions">
          {live && <ButtonLink href={path}>{t('View in Gallery')}</ButtonLink>}

          <ButtonLink href={localizePath(locale, '/mine')} variant="outline">
            {t('Your styles')}
          </ButtonLink>
        </div>

        {style.removed.length > 0 && (
          <div class="published-removed">
            <p>
              {t(
                'The Gallery took out CSS that loads from other sites or embeds large images:',
              )}
            </p>

            <ul>
              {style.removed.map((css, i) => (
                <li key={i}>
                  <code>{css}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr class="published-rule" />

        <p class="published-note">
          {t('Later edits stay in Stylebot until you publish an update.')}
        </p>
      </div>

      {screenshot && (
        <img
          class="published-shot"
          src={screenshot}
          alt={t('Screenshot of {name} on {site}', {
            name: style.name,
            site: style.site,
          })}
        />
      )}
    </div>
  );
}
