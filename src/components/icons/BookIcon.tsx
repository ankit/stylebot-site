export default function BookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3.6C6.6 2.6 4.6 2.2 2 2.4v10c2.6-.2 4.6.2 6 1.2 1.4-1 3.4-1.4 6-1.2v-10c-2.6-.2-4.6.2-6 1.2z" />
      <path d="M8 3.6v10" stroke-linecap="round" />
    </svg>
  );
}
