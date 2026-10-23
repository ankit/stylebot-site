import { useState } from 'preact/hooks';

import SbIcon from '@/components/icons/SbIcon';

import './Logo.css';

type Props = {
  href: string;
  label: string;
  // Another site's name after the wordmark, such as the gallery's.
  tag?: string;
};

/**
 * The header logo. The icon draws itself on hover; on the page it links to,
 * clicking it jumps to the top instead of reloading.
 */
export default function Logo({ href, label, tag }: Props) {
  const [hover, setHover] = useState(false);

  // Already on the page the logo links to, with nothing like a search in the
  // URL that following the link would clear.
  const atHome = () =>
    new URL(href, location.href).pathname === location.pathname &&
    !location.search;

  const goHome = (ev: MouseEvent) => {
    if (!atHome()) {
      return;
    }

    ev.preventDefault();
    window.scrollTo({ top: 0 });
  };

  return (
    <a
      href={href}
      class="logo"
      aria-label={label}
      onClick={goHome}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span class="logo-mark">
        <SbIcon size={26} nudgeY={1} once animate={hover} />
      </span>
      <span class="logo-name">stylebot</span>
      {tag && <span class="logo-tag">{tag}</span>}
    </a>
  );
}
