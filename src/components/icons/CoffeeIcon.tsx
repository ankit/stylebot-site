export default function CoffeeIcon({ size = 15 }: { size?: number }) {
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
      <path d="M2.5 6h9v4.5a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3z" />
      <path d="M11.5 7.2h.8a1.9 1.9 0 0 1 0 3.8h-.9" />
      <path d="M5 1.8c-.5.6-.5 1.2 0 1.8M8 1.8c-.5.6-.5 1.2 0 1.8" />
    </svg>
  );
}
