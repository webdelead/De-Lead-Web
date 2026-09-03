import { getGallery } from "@/lib/content";

// positions rendered wide in the approved static layout
const WIDE = new Set([0, 7]);

export async function S15_gallery() {
  const rows = await getGallery();
  return (
    <>
      <section id="gallery">
        <div className="wrap">
          <div className="eyebrow reveal">Gallery</div>
          <h2 className="h2 reveal">Moments from the ground</h2>
          <div className="gallery-grid reveal">
            {rows.map((g, i) => (
              <div className={WIDE.has(i) ? "wide" : undefined} key={g.id}>
                <img src={g._url} alt={g._alt || String(g.title)} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAKEHOLDERS */}
    </>
  );
}
