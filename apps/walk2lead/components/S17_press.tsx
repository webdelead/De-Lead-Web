import { getPress } from "@/lib/content";

// `.press-track` / `.press-scroll-wrap` / `.press-card` kept — main.js drives
// the drag-to-scrub + `press-scroll` marquee. Converts in the Phase B swap.
export async function S17_press() {
  const rows = await getPress();
  const imgs = rows.map((r) => ({
    src: r._url,
    alt: r._alt || "Walk2Lead newspaper coverage",
  }));

  return (
    <>
      <section className="bg-cream pb-20 pt-[72px]">
        <div className="wrap">
          <div className="eyebrow reveal">In the Press</div>
          <h2 className="h2 reveal !mb-0">Kerala media covered it</h2>
        </div>
        <div className="press-scroll-wrap mt-10 overflow-hidden">
          <div className="press-track flex w-max cursor-grab select-none items-start gap-6 [animation:press-scroll_216s_linear_infinite] [will-change:transform] active:cursor-grabbing motion-reduce:[animation:none]">
            {imgs.map((im, i) => (
              <div
                className="press-card w-80 flex-none overflow-hidden rounded-[16px] bg-white shadow-[0_8px_28px_-8px_rgba(0,0,0,0.14)] [border:1px_solid_var(--color-line)] max-[600px]:w-[260px]"
                key={`a${i}`}
              >
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="block h-auto w-full" />
              </div>
            ))}
            {imgs.map((im, i) => (
              <div
                className="press-card w-80 flex-none overflow-hidden rounded-[16px] bg-white shadow-[0_8px_28px_-8px_rgba(0,0,0,0.14)] [border:1px_solid_var(--color-line)] max-[600px]:w-[260px]"
                aria-hidden="true"
                key={`b${i}`}
              >
                <img src={im.src} alt="" loading="lazy" decoding="async" className="block h-auto w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
    </>
  );
}
