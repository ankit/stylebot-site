export default function CopyIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.8" />
      <path d="M10.5 3.2V3A1.5 1.5 0 0 0 9 1.5H4A2.5 2.5 0 0 0 1.5 4v5A1.5 1.5 0 0 0 3 10.5h.2" />
    </svg>
  );
}
