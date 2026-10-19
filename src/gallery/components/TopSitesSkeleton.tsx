import './TopSites.css';

const WIDTHS = [96, 120, 104, 84, 112, 92, 108, 88];

/**
 * Placeholder pills, shaped like TopSites' links, while the sites load.
 */
export default function TopSitesSkeleton() {
  return (
    <div class="top-sites" aria-hidden="true">
      {WIDTHS.map((width, i) => (
        <span key={i} class="top-sites-pill" style={{ width }} />
      ))}
    </div>
  );
}
