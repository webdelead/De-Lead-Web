import { getPress } from "@/lib/content";

export async function S17_press() {
  const rows = await getPress();
  const imgs = rows.map((r) => ({
    src: r._url,
    alt: r._alt || "Walk2Lead newspaper coverage",
  }));

  return (
    <>
      <section className="press">
        <div className="wrap">
          <div className="eyebrow reveal">In the Press</div>
          <h2 className="h2 reveal">Kerala media covered it</h2>
        </div>
        <div className="press-scroll-wrap">
          <div className="press-track">
            {imgs.map((im, i) => (
              <div className="press-card" key={`a${i}`}>
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" />
              </div>
            ))}
            {/* cloned for seamless loop */}
            {imgs.map((im, i) => (
              <div className="press-card" aria-hidden="true" key={`b${i}`}>
                <img src={im.src} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
    </>
  );
}
