import { getGalleryPage, GALLERY_BATCH } from "@/lib/content";

// fixed grid slots in the approved layout — repeats every 5 items so the
// mosaic shape holds across "Load more" pages too. main.js reuses this exact
// list when it appends fetched items — keep the two in sync.
const SLOTS = ["g-a", "g-b", "g-c", "g-d", "g-e"];

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-none">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

export async function S12_gallery() {
  const { items, hasMore } = await getGalleryPage(0, GALLERY_BATCH);
  return (
    <>
      <section className="section relative" id="gallery">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">
              <i className="mk"></i>From the sessions
            </span>
            <h2>What a programme looks like</h2>
            <a
              className="reveal mt-[18px] inline-flex items-center gap-2 rounded-full [padding:9px_16px_9px_12px] text-[0.82rem] font-semibold text-magenta transition-[background,border-color,transform] duration-200 [border:1px_solid_rgba(117,6,73,0.22)] hover:-translate-y-px hover:[background:rgba(117,6,73,0.06)] hover:[border-color:rgba(117,6,73,0.4)]"
              href="https://www.instagram.com/deleadint/?hl=en"
              target="_blank"
              rel="noopener"
            >
              {instagramIcon}
              More on Instagram
            </a>
          </div>
          {/* .gallery-grid + .g-* slot classes stay as legacy CSS: main.js
              appends fetched <figure class="g-a"> nodes and needs those rules. */}
          <div className="gallery-grid reveal" id="gallery-grid">
            {items.map((g, i) => (
              <figure className={SLOTS[i % 5]} key={g.id}>
                <img src={g._url} alt={g._alt} loading="lazy" />
                <figcaption>{g.title}</figcaption>
              </figure>
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex w-full justify-center">
              <button
                type="button"
                className="btn btn-ghost disabled:cursor-default disabled:opacity-60 disabled:!transform-none"
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
