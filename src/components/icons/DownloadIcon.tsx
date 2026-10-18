export default function DownloadIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2v6.5M3.2 5.8 6 8.6l2.8-2.8M2.5 10.5h7" />
    </svg>
  );
}
