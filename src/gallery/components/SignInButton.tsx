import { useState } from 'preact/hooks';

import { signIn } from '@/gallery/lib/auth';

import Button from '@/components/Button';
import GoogleIcon from '@/components/icons/GoogleIcon';

import { type Translate } from '@/i18n/t';

import './SignInButton.css';

export default function SignInButton({ t }: { t: Translate }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const onClick = async () => {
    setBusy(true);
    setFailed(false);

    try {
      await signIn();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  let label = t('Sign in');

  if (failed) {
    // i18n: On the sign-in button after signing in with Google failed.
    label = t('Couldn’t sign in. Try again');
  }

  return (
    <Button size="sm" class="sign-in-button" onClick={onClick} disabled={busy}>
      <GoogleIcon />

      {label}
    </Button>
  );
}
