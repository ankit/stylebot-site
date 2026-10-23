export default function HackerNewsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M3 1h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Zm1.6 3.2L7.2 8.6v3.6h1.6V8.6l2.6-4.4H9.6L8 7.1 6.4 4.2H4.6Z"
      />
    </svg>
  );
}
