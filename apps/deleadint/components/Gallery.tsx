import { getGalleryPage, GALLERY_BATCH } from "@/lib/content";

// accent positions from the approved static layout, repeating every 10 items
// so the wide/tall rhythm holds however many photos the dashboard has
const WIDE_IDX = new Set([0, 7]);
const TALL_IDX = new Set([1, 5]);

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

export async function Gallery() {
  const { items, hasMore } = await getGalleryPage(0, GALLERY_BATCH);
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Gallery</span>
          <h2>Moments from across the ecosystem</h2>
          <p>
            Camps, robotics labs, boardrooms and school expos: a running record of what &quot;learning
            by doing&quot; actually looks like.
          </p>
          <a
            className="gallery-ig-badge"
            href="https://www.instagram.com/deleadint/?hl=en"
            target="_blank"
            rel="noopener"
          >
            {instagramIcon}
            More on Instagram
          </a>
        </div>
        <div className="gallery-grid reveal-stagger" id="gallery-grid">
          {items.map((g, i) => {
            const slot = i % 10;
            const cls = WIDE_IDX.has(slot) ? "g-wide" : TALL_IDX.has(slot) ? "g-tall" : undefined;
            return (
              <figure key={g.id} className={cls}>
                <img src={g._url} alt={String(g.title || "")} loading="lazy" />
                {g.title && <figcaption>{String(g.title)}</figcaption>}
              </figure>
            );
          })}
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
  );
}
