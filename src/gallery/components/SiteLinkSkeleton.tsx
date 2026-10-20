import './SiteLink.css';

/**
 * Placeholder links, shaped like SiteLink, while the sites load.
 */
export default function SiteLinkSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} aria-hidden="true">
          <span class="site-link is-skeleton" />
        </li>
      ))}
    </>
  );
}
