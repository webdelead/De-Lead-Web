import { getWhatsappReviews } from "@/lib/content";

export async function S10b_whatsapp() {
  const rows = await getWhatsappReviews();
  if (!rows.length) return null;
  // duplicate once so the CSS marquee loop (translateX(-50%)) is seamless
  const loop = [...rows, ...rows];

  return (
    <section className="section wa-reviews" id="whatsapp-reviews">
      <div className="pattern-bg on-dark"></div>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: "var(--mc-lime)" }}>Straight from the group chat</span>
          <h2>What parents share on <span className="italic">WhatsApp</span></h2>
        </div>
      </div>
      <div className="wa-marquee-wrap reveal">
        <div className="wa-marquee-track">
          {loop.map((r, i) => (
            <div className="wa-card" key={`${r.id}-${i}`}>
              {r._url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r._url} alt={r._alt || r.title || "WhatsApp message from a MakerChamps parent"} loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
