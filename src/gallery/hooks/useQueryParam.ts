import { useEffect, useState } from 'preact/hooks';

/**
 * A parameter in the page's address, such as ?q=, and a setter that updates
 * both. It's null until the island runs, since the page is built without the
 * address; a missing parameter reads as `fallback`, which the setter leaves out
 * of the address.
 */
export function useQueryParam(name: string, fallback = '') {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setValue(new URLSearchParams(location.search).get(name) ?? fallback);
  }, [name, fallback]);

  const change = (next: string) => {
    const url = new URL(location.href);

    if (next === fallback) {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, next);
    }

    history.replaceState(null, '', url);
    setValue(next);
  };

  return [value, change] as const;
}
