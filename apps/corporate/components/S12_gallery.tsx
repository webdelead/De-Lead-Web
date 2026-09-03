import { getGallery } from "@/lib/content";

// fixed grid slots in the approved layout
const SLOTS = ["g-a", "g-b", "g-c", "g-d", "g-e"];

export async function S12_gallery() {
  const rows = (await getGallery()).slice(0, SLOTS.length);
  return (
    <>
      <section className="section gallery" id="gallery">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow"><i className="mk"></i>From the sessions</span>
            <h2>What a programme looks like</h2>
          </div>
          <div className="gallery-grid reveal">
            {rows.map((g, i) => (
              <figure className={SLOTS[i]} key={g.id}>
                <img src={g._url} alt={g._alt} loading="lazy" />
                <figcaption>{g.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
    </>
  );
}
