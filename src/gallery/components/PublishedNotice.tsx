import { type LinkState } from '@/gallery/hooks/usePublish';
import { type PublishedStyle } from '@/gallery/lib/api';
import { styleHref } from '@/gallery/lib/paths';

import Button from '@/components/Button';
import ButtonLink from '@/components/ButtonLink';
import CheckIcon from '@/components/icons/CheckIcon';

import { type Locale, localizePath } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './PublishedNotice.css';

type Props = {
  style: PublishedStyle;
  isNewVersion: boolean;
  detailsOnly: boolean;
  link: LinkState;
  onRetryLink: () => void;
  locale: Locale;
  t: Translate;
};

/**
 * What was published, any CSS the Gallery took out, and whether Stylebot has
 * linked the style to it, with a retry until it has.
 */
export default function PublishedNotice({
  style,
  isNewVersion,
  detailsOnly,
  link,
  onRetryLink,
  locale,
  t,
}: Props) {
  let heading = t('{name} is published', { name: style.name });

  if (isNewVersion) {
    heading = t('Version {version} of {name} is published', {
      version: style.version,
      name: style.name,
    });
  }

  if (detailsOnly) {
    heading = t('{name} is saved', { name: style.name });
  }

  return (
    <div class="published-notice">
      <h2>
        <CheckIcon size={16} />
        {heading}
      </h2>

      {style.status === 'hidden' && (
        <p>
          {t(
            'It’s hidden from the Gallery until a moderator has looked at its screenshot.',
          )}
        </p>
      )}

      {link === 'linking' && <p>{t('Telling Stylebot…')}</p>}

      {link === 'unlinked' && (
        <div class="published-notice-unlinked" role="alert">
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

      {style.removed.length > 0 && (
        <div class="published-notice-removed">
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

      <div class="published-notice-actions">
        {style.status === 'live' && (
          <ButtonLink href={styleHref(locale, style)}>
            {t('View style')}
          </ButtonLink>
        )}

        <ButtonLink href={localizePath(locale, '/mine')} variant="outline">
          {t('Your styles')}
        </ButtonLink>
      </div>
    </div>
  );
}
