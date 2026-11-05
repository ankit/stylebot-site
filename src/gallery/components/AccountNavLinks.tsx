import './AccountNavLinks.css';

type Link = { href: string; label: string };

type Props = { links: Array<Link>; current?: string };

/**
 * The header's links, with the page they lead to marked as current.
 */
export default function AccountNavLinks({ links, current }: Props) {
  return (
    <nav class="account-nav">
      {links.map((link) => (
        <a
          key={link.href}
          class="account-nav-link"
          href={link.href}
          aria-current={link.href === current}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
