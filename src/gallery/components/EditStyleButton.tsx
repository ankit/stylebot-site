import { useSession } from '@/gallery/hooks/useSession';
import { type Style } from '@/gallery/lib/api';
import { editHref } from '@/gallery/lib/paths';

import ButtonLink from '@/components/ButtonLink';

import { type Locale } from '@/i18n/locales';
import { type Translate } from '@/i18n/t';

import './EditStyleButton.css';

type Props = { style: Style; locale: Locale; t: Translate };

/**
 * Edit, shown only to the style's author.
 */
export default function EditStyleButton({ style, locale, t }: Props) {
  const session = useSession();

  if (session?.account.id !== style.author.id) {
    return null;
  }

  return (
    <ButtonLink
      class="edit-style-button"
      href={editHref(locale, style)}
      variant="outline"
      size="sm"
    >
      {t('Edit')}
    </ButtonLink>
  );
}
