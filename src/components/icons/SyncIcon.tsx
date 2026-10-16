export default function SyncIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5.5A5 5 0 0 0 3 4M2 8.5A5 5 0 0 0 11 10" />
      <path d="M3 1.5V4h2.5M11 12.5V10H8.5" />
    </svg>
  );
}
