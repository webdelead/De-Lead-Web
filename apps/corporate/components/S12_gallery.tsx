import { getGalleryPage, GALLERY_BATCH } from "@/lib/content";

// fixed grid slots in the approved layout — repeats every 5 items so the
// mosaic shape holds across "Load more" pages too (used to hard-cap at 5
// and silently drop anything past that)
const SLOTS = ["g-a", "g-b", "g-c", "g-d", "g-e"];

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

export async function S12_gallery() {
  const { items, hasMore } = await getGalleryPage(0, GALLERY_BATCH);
  return (
    <>
      <section className="section gallery" id="gallery">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow"><i className="mk"></i>From the sessions</span>
            <h2>What a programme looks like</h2>
            <a
              className="gallery-ig-badge reveal"
              href="https://www.instagram.com/deleadint/?hl=en"
              target="_blank"
              rel="noopener"
            >
              {instagramIcon}
              More on Instagram
            </a>
          </div>
          <div className="gallery-grid reveal" id="gallery-grid">
            {items.map((g, i) => (
              <figure className={SLOTS[i % 5]} key={g.id}>
                <img src={g._url} alt={g._alt} loading="lazy" />
                <figcaption>{g.title}</figcaption>
              </figure>
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

      {/* ============ CTA ============ */}
    </>
  );
}
