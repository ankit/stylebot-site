import { type ComponentChildren } from 'preact';

import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon';

import './BackLink.css';

type Props = { href: string; children: ComponentChildren };

export default function BackLink({ href, children }: Props) {
  return (
    <a class="back-link" href={href}>
      <ChevronLeftIcon />
      {children}
    </a>
  );
}
