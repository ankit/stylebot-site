export default function RedditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M2.4 10a5.6 4 0 1 0 11.2 0 5.6 4 0 1 0-11.2 0Zm2.7-.3a1 1 0 1 0 2 0 1 1 0 1 0-2 0Zm3.8 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z"
      />
      <circle cx="2.6" cy="7.6" r="1.5" />
      <circle cx="13.4" cy="7.6" r="1.5" />
      <circle cx="11.9" cy="2.6" r="1.2" />
      <path
        d="M8 6.2 8.9 2.3l2.4.4"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
