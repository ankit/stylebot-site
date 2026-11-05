export default function StarIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.8 9.9 5.9l4.5.5-3.3 3 .9 4.4L8 11.6l-3.9 2.2.9-4.4-3.3-3 4.5-.5z" />
    </svg>
  );
}
