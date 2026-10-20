import { checkUsername, type UsernameCheck } from '@/gallery/lib/api';

import { useDebounced } from './useDebounced';
import { useRequest } from './useRequest';

const CHECK_DELAY_MS = 300;
const USERNAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Whether a username can be taken, checked with the API once typing pauses.
 * The account's own username needs no check, and one that breaks the rules
 * is caught without asking.
 */
export function useUsernameCheck(
  session: string,
  username: string,
  current: string,
): UsernameCheck | undefined {
  const settled = useDebounced(username, CHECK_DELAY_MS);
  const valid =
    username.length >= 3 && username.length <= 30 && USERNAME.test(username);
  const needsCheck = valid && username !== current;
  const { data } = useRequest(async () => {
    if (!needsCheck || settled !== username) {
      return undefined;
    }

    const check = await checkUsername(session, settled);

    return { ...check, username: settled };
  }, [settled, needsCheck]);

  if (username === current) {
    return { available: true };
  }

  if (!valid) {
    return { available: false, reason: 'invalid' };
  }

  if (data?.username !== username) {
    return undefined;
  }

  return data;
}
