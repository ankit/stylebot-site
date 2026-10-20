import {
  type Account,
  ApiError,
  createSession,
  type Session,
} from '@/gallery/lib/api';

// The extension's web OAuth client: the styles API only takes tokens issued to
// the extension's clients, and the gallery's origin has to be listed on it.
const GOOGLE_CLIENT_ID =
  '662998053209-s49tq55ic3td87m08gi8vpjqm5t7r9st.apps.googleusercontent.com';

// The API only needs the Google account id, the same whichever scope or
// client the extension signed in with.
const SCOPE = 'openid';

const GOOGLE_SIGN_IN_SCRIPT = 'https://accounts.google.com/gsi/client';
const STORAGE_KEY = 'stylebot-gallery:session';

export const SESSION_EVENT = 'stylebot-gallery:session';

type TokenResponse = { access_token?: string; error?: string };

declare global {
  // Augmenting Window needs an interface, which types can't merge into.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
            error_callback?: (error: { type: string }) => void;
          }): { requestAccessToken(): void };
        };
      };
    };
  }
}

let googleSignIn: Promise<void> | undefined;

function loadGoogleSignIn() {
  googleSignIn ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = GOOGLE_SIGN_IN_SCRIPT;
    script.async = true;
    script.onload = () => resolve();

    script.onerror = () => {
      googleSignIn = undefined;
      reject(new Error('Google sign-in didn’t load'));
    };

    document.head.appendChild(script);
  });

  return googleSignIn;
}

export function readSession(): Session | null {
  try {
    const saved: Session | null = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null',
    );

    if (saved && saved.expiresAt > Date.now()) {
      return saved;
    }
  } catch {
    // Unreadable or blocked storage counts as signed out.
  }

  return null;
}

function writeSession(session: Session | null) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Blocked storage keeps the session only until the page closes.
  }

  window.dispatchEvent(new Event(SESSION_EVENT));
}

function requestGoogleToken() {
  return new Promise<string | null>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error(response.error ?? 'Google sign-in failed'));
        }
      },
      error_callback: (error) => {
        if (error.type === 'popup_closed') {
          resolve(null);
        } else {
          reject(error);
        }
      },
    });

    client.requestAccessToken();
  });
}

/**
 * Signs in with Google in a popup and trades its token for a session. Resolves
 * null when the popup is closed.
 */
export async function signIn() {
  await loadGoogleSignIn();

  const token = await requestGoogleToken();

  if (!token) {
    return null;
  }

  const session = await createSession(token);

  writeSession(session);

  return session;
}

export const signOut = () => writeSession(null);

/**
 * Keeps the saved session's account, such as its name, in step after a
 * change.
 */
export function updateAccount(account: Account) {
  const current = readSession();

  if (current) {
    writeSession({ ...current, account });
  }
}

/**
 * Signs out when the API no longer takes the session, then rethrows.
 */
export function onAuthError(error: unknown): never {
  if (error instanceof ApiError && error.status === 401) {
    signOut();
  }

  throw error;
}
