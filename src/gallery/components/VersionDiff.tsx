import { useVersionDiff } from '@/gallery/hooks/useVersionDiff';

import { type Translate } from '@/i18n/t';

import CssDiff from './CssDiff';

import './VersionDiff.css';

type Props = {
  styleId: number;
  version: number;
  previous: number;
  t: Translate;
};

/**
 * The CSS a version changed since the one before it.
 */
export default function VersionDiff({ styleId, version, previous, t }: Props) {
  const {
    data: hunks,
    error,
    loading,
  } = useVersionDiff(styleId, version, previous);

  if (loading) {
    return <p class="version-diff-note">{t('Loading changes…')}</p>;
  }

  if (error) {
    return (
      <p class="version-diff-note is-error">
        {t('Couldn’t load the changes.')}
      </p>
    );
  }

  if (hunks === null) {
    return (
      <p class="version-diff-note">{t('Too many changes to show here.')}</p>
    );
  }

  if (!hunks || hunks.length === 0) {
    return <p class="version-diff-note">{t('The CSS didn’t change.')}</p>;
  }

  return (
    <CssDiff
      hunks={hunks}
      label={t('Changes in version {version}', { version })}
    />
  );
}
