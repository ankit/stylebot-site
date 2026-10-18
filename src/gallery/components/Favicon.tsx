import './Favicon.css';

type Props = { site: string; size?: number };

/**
 * A site's icon, from Google's favicon service.
 */
export default function Favicon({ site, size = 14 }: Props) {
  return (
    <img
      class="favicon"
      src={`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(site)}`}
      width={size}
      height={size}
      alt=""
      loading="lazy"
    />
  );
}
