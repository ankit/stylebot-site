export default function CloseIcon({
  size = 14,
  strokeWidth = 1.5,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
    </svg>
  );
}
