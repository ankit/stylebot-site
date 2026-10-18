import { type JSX } from 'preact';

import { buttonClass, type ButtonStyle } from '@/components/Button';

import './Button.css';

type Props = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'size'> &
  ButtonStyle & { href: string };

/**
 * A link that looks like a Button.
 */
export default function ButtonLink({
  variant,
  size,
  class: className,
  ...rest
}: Props) {
  return (
    <a class={buttonClass({ variant, size, class: className })} {...rest} />
  );
}
