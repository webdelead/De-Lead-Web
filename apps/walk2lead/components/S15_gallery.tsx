import { getGalleryPage, GALLERY_BATCH } from "@/lib/content";

// positions rendered wide in the approved static layout, repeating every 8
// items so the rhythm holds across "Load more" pages too
const WIDE_IDX = new Set([0, 7]);

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

export async function S15_gallery() {
  const { items, hasMore } = await getGalleryPage(0, GALLERY_BATCH);
  return (
    <>
      <section id="gallery">
        <div className="wrap">
          <div className="eyebrow reveal">Gallery</div>
          <h2 className="h2 reveal">Moments from the ground</h2>
          <a
            className="gallery-ig-badge reveal"
            href="https://www.instagram.com/deleadint/?hl=en"
            target="_blank"
            rel="noopener"
          >
            {instagramIcon}
            More on Instagram
          </a>
          <div className="gallery-grid reveal" id="gallery-grid">
            {items.map((g, i) => (
              <div className={WIDE_IDX.has(i % 8) ? "wide" : undefined} key={g.id}>
                <img src={g._url} alt={g._alt || String(g.title)} loading="lazy" />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="gallery-more">
              <button
                type="button"
                className="btn btn-ghost"
                id="gallery-load-more"
                data-offset={GALLERY_BATCH}
              >
                Load more photos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* STAKEHOLDERS */}
    </>
  );
}
