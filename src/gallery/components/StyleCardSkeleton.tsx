import './StyleCard.css';

/**
 * Placeholder cards, shaped like StyleCard, while styles load.
 */
export default function StyleCardSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div class="style-card is-skeleton" key={i} aria-hidden="true">
          <span class="style-card-frame">
            <span class="style-card-bar" />
            <span class="style-card-shot" />
          </span>
          <span class="style-card-line" style={{ width: '60%' }} />
          <span class="style-card-line" style={{ width: '35%' }} />
        </div>
      ))}
    </>
  );
}
