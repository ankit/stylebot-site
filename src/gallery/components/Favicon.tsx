import { useEffect, useState } from 'preact/hooks';

import { API_ORIGIN } from '@/gallery/lib/api';

import './Favicon.css';

type IconState = 'loading' | 'loaded' | 'missing';

// A site's hostname, or undefined while it isn't known yet.
type Props = { site: string | undefined; size?: number };

// What each site's icon turned out to be, so icons drawn again, as when the
// grid reloads, skip the loading square.
const known = new Map<string, IconState>();

// Each site's icon width in pixels, as loaded.
const widths = new Map<string, number>();

const stateOf = (site: string | undefined) =>
  (site && known.get(site)) || 'loading';

/**
 * A site's icon, a muted square while it loads, or the site's first letter
 * when it has none. The API answers a missing icon with an empty 404, so the
 * image errors instead of showing Google's placeholder globe. An icon smaller
 * than `size` is drawn at its own size, centered, rather than stretched blurry.
 */
export default function Favicon({ site, size = 14 }: Props) {
  const [state, setState] = useState(() => stateOf(site));
  const [width, setWidth] = useState(() => site && widths.get(site));
  const box = { width: size, height: size };

  useEffect(() => {
    setState(stateOf(site));
    setWidth(site && widths.get(site));
  }, [site]);

  const settle = (next: IconState) => {
    if (site) {
      known.set(site, next);
    }

    setState(next);
  };

  const onLoad = (image: HTMLImageElement) => {
    if (site) {
      widths.set(site, image.naturalWidth);
    }

    setWidth(image.naturalWidth);
    settle('loaded');
  };

  let small = '';

  if (width && width < size) {
    small = ' is-small';
  }

  if (!site) {
    return <span class="favicon is-loading" style={box} aria-hidden="true" />;
  }

  if (state === 'missing') {
    return (
      <span
        class="favicon favicon-letter"
        style={{ ...box, fontSize: size * 0.62 }}
        aria-hidden="true"
      >
        {site
          .replace(/^www\./, '')
          .charAt(0)
          .toUpperCase()}
      </span>
    );
  }

  return (
    <img
      class={`favicon is-${state}${small}`}
      src={`${API_ORIGIN}/v1/favicons/${encodeURIComponent(site)}`}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      onLoad={(e) => onLoad(e.currentTarget)}
      onError={() => settle('missing')}
    />
  );
}
