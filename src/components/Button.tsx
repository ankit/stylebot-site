import { type JSX } from 'preact';

import './Button.css';

export type ButtonStyle = {
  variant?: 'primary' | 'outline';
  size?: 'md' | 'sm';
};

type Props = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> &
  ButtonStyle;

/**
 * The classes for a button's look, shared with ButtonLink.
 */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  class: className,
}: ButtonStyle & { class?: unknown }) {
  const classes = ['btn', `btn-${variant}`];

  if (size === 'sm') {
    classes.push('btn-sm');
  }

  if (className) {
    classes.push(String(className));
  }

  return classes.join(' ');
}

export default function Button({
  variant,
  size,
  class: className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      class={buttonClass({ variant, size, class: className })}
      {...rest}
    />
  );
}
