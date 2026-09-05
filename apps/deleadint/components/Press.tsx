import { getPress } from "@/lib/content";

const star = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3 6.5 7 1-5 5 1.5 7L12 18l-6.5 3.5L7 14.5l-5-5 7-1z" />
  </svg>
);

export async function Press() {
  const rows = await getPress();
  const imgs = rows.map((r) => ({ src: r._url, alt: r.title ? String(r.title) : "Walk2Lead newspaper coverage" }));
  // hold a roughly constant scroll speed as clippings are added/removed
  const marqueeDur = `${Math.max(24, imgs.length * 5)}s`;

  return (
    <section className="press" id="press">
      <div className="container">
        <div className="press-top">
          <div className="section-head reveal">
            <span className="eyebrow">Achievements &amp; Press</span>
            <h2>Recognised beyond the classroom</h2>
            <p>
              A few milestones from the De&rsquo; Lead journey, and the local press that&apos;s
              covered our schools along the way.
            </p>
          </div>

          <div className="press-chips reveal-stagger">
            <span className="press-chip">
              {star}Top 2 international ranking at TechTop 2025, Maker Village Kochi
            </span>
            <span className="press-chip">
              {star}State-level recognition, Kerala General Education Dept.
            </span>
            <span className="press-chip">
              {star}Sharjah Award for Educational Excellence: Evana Eliza Vinoj, DLI Education, UAE
            </span>
          </div>
        </div>
      </div>

      <div className="press-strip reveal">
        <div className="press-track" style={{ animationDuration: marqueeDur }}>
          {imgs.map((im, i) => (
            <img key={i} src={im.src} alt={im.alt} loading="lazy" />
          ))}
        </div>
        <div className="press-track" aria-hidden="true" style={{ animationDuration: marqueeDur }}>
          {imgs.map((im, i) => (
            <img key={i} src={im.src} alt="" loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
