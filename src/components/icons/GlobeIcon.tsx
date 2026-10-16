export default function GlobeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.3" />
      <path d="M1.9 8h12.2M8 1.7c-3.6 3.6-3.6 9 0 12.6M8 1.7c3.6 3.6 3.6 9 0 12.6" />
    </svg>
  );
}
