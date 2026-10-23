export default function CoffeeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6.5h9v3.5a3.5 3.5 0 0 1-3.5 3.5h-2A3.5 3.5 0 0 1 2 10z" />
      <path d="M11 7.5h1a2 2 0 0 1 0 4h-1.2" />
      <path d="M4.5 2v2M6.5 2v2M8.5 2v2" />
    </svg>
  );
}
