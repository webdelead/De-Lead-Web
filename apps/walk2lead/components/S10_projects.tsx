import { getProjects } from "@/lib/content";

const chevL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const chevR = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// `.pcard` class + #proj-track / #proj-prev / #proj-next ids kept — main.js
// initInfiniteSlider('proj-track', …, '.pcard', 4200) still drives this.
const sliderBtn =
  "grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-white text-ink transition-colors [border:1.5px_solid_var(--color-line)] hover:text-accent hover:[border-color:var(--color-w2l)]";

export async function S10_projects() {
  const rows = await getProjects();
  return (
    <>
      <section>
        <div className="wrap">
          <div className="eyebrow reveal">Proof, not promises</div>
          <h2 className="h2 reveal">What 12-year-olds built</h2>
          <p className="lead reveal">
            Not toy demos: socially relevant prototypes, designed, coded and presented by government
            school students.
          </p>
          <div
            id="proj-track"
            className="mt-12 flex gap-[22px] overflow-x-auto overflow-y-hidden scroll-smooth pb-1 [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {rows.map((p) => (
              <div
                key={p.id}
                className="pcard reveal flex flex-[0_0_320px] flex-col overflow-hidden rounded-[20px] bg-white transition-all duration-[250ms] [border:1px_solid_var(--color-line)] [scroll-snap-align:start] hover:-translate-y-1 hover:shadow-card"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={p._url}
                  alt={p._alt || `Students presenting the ${p.title}`}
                  className="aspect-[16/10] object-cover"
                />
                <div className="p-[26px]">
                  <span className="mb-3 inline-block rounded-full bg-cream-2 px-3 py-[5px] text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-accent">
                    {p.category}
                  </span>
                  <h3 className="mb-2 text-[1.18rem]">{p.title}</h3>
                  <p className="text-[0.9rem] text-ink-soft">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[18px] flex justify-end gap-2.5">
            <button className={sliderBtn} id="proj-prev" aria-label="Previous project">
              {chevL}
            </button>
            <button className={sliderBtn} id="proj-next" aria-label="Next project">
              {chevR}
            </button>
          </div>
        </div>
      </section>

      {/* VIDEO */}
    </>
  );
}
