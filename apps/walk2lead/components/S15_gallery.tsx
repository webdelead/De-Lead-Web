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
            className="reveal my-[14px] mb-2 inline-flex items-center gap-2 rounded-full py-[9px] pl-3 pr-4 text-[0.85rem] font-semibold text-accent transition-all [border:1.5px_solid_rgba(200,28,28,0.25)] hover:-translate-y-px hover:bg-[rgba(200,28,28,0.06)] hover:[border-color:var(--color-w2l)] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:flex-none"
            href="https://www.instagram.com/deleadint/?hl=en"
            target="_blank"
            rel="noopener"
          >
            {instagramIcon}
            More on Instagram
          </a>
          {/* .gallery-grid class + #gallery-grid id kept — main.js wires each
              img to the lightbox and appends "Load more" pages here */}
          <div
            id="gallery-grid"
            className="gallery-grid reveal mt-12 grid grid-cols-4 gap-3.5 max-[700px]:grid-cols-2"
          >
            {items.map((g, i) => (
              <div
                className={WIDE_IDX.has(i % 8) ? "wide col-span-2 [&_img]:aspect-[2.08/1]" : undefined}
                key={g.id}
              >
                <img
                  src={g._url}
                  alt={g._alt || String(g.title)}
                  loading="lazy"
                  className="aspect-square cursor-zoom-in rounded-[14px] object-cover transition-transform duration-[250ms] hover:scale-[1.02] hover:shadow-card"
                />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex w-full justify-center">
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
