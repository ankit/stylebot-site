// Where each address was scrolled to when last seen.
const positions = new Map<string, number>();
// The address back or forward went to, until its route renders.
let poppedTo: string | null = null;

const here = () => location.pathname + location.search;

// Listening as the module loads, before the router mounts, so a popstate is
// seen before the router renders the route it leads to.
if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual';
  addEventListener('scroll', () => positions.set(here(), window.scrollY), {
    passive: true,
  });
  addEventListener('popstate', () => {
    poppedTo = here();
  });
}

/**
 * Takes the window back to where it was on an address when going back or
 * forward to it. For the router's onRouteChange, called once the new route
 * has rendered.
 */
export function restoreScroll(url: string) {
  if (url === poppedTo) {
    window.scrollTo(0, positions.get(url) ?? 0);
  }

  poppedTo = null;
}
