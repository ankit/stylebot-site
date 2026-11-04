import { type FeedbackSource } from '@/gallery/lib/api';

const SOURCES: Array<FeedbackSource> = ['editor', 'options'];

// The extension adds its version to the goodbye and feedback pages' URLs.
export function extensionVersion() {
  const version = new URLSearchParams(location.search).get('version');

  if (version && /^[0-9]+(\.[0-9]+)*$/.test(version)) {
    return version;
  }

  return undefined;
}

// Where in the extension the feedback page was opened from.
export function feedbackSource() {
  const source = new URLSearchParams(location.search).get('source');

  return SOURCES.find((s) => s === source);
}
