import './StylePage.css';

/**
 * A placeholder, shaped like StylePage, while the style loads.
 */
export default function StylePageSkeleton() {
  return (
    <div class="style-page is-skeleton" aria-busy="true">
      <span class="style-page-line" style={{ width: '100px' }} />

      <div class="style-page-top">
        <span class="style-page-shot" />

        <div class="style-page-side">
          <span class="style-page-line" style={{ width: '70%', height: 30 }} />
          <span class="style-page-line" style={{ width: '40%' }} />
          <span class="style-page-line" style={{ width: '90%' }} />
        </div>
      </div>
    </div>
  );
}
