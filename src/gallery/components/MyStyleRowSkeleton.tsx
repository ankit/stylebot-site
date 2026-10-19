import './MyStyleRow.css';

/**
 * Placeholder rows, shaped like MyStyleRow, while the styles load.
 */
export default function MyStyleRowSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} class="my-style-row is-skeleton" aria-hidden="true">
          <span class="my-style-shot" />

          <div class="my-style-main">
            <span class="my-style-line" style={{ width: '30%' }} />
            <span class="my-style-line" style={{ width: '45%' }} />
          </div>
        </li>
      ))}
    </>
  );
}
