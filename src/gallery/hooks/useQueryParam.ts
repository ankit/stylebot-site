import { useLocation, useRoute } from 'preact-iso';

/**
 * A parameter in the page's address, such as ?q=, and a setter that updates
 * it in place. A missing parameter reads as `fallback`, which the setter leaves
 * out of the address.
 */
export function useQueryParam(name: string, fallback = '') {
  const { route } = useLocation();
  // The route's own query, which stays put while the next route's page loads.
  const { query } = useRoute();

  const change = (next: string) => {
    const url = new URL(location.href);

    if (next === fallback) {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, next);
    }

    route(url.pathname + url.search, true);
  };

  return [query[name] ?? fallback, change] as const;
}
