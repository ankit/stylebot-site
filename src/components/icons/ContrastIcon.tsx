export default function ContrastIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.3" stroke="currentColor" stroke-width="1.4" />
      <path d="M8 1.7a6.3 6.3 0 0 1 0 12.6z" fill="currentColor" />
    </svg>
  );
}
