const ORGS = [
  {
    logo: "/assets/brand/dli-logo-color.webp",
    alt: "De' Lead International",
    h: "De' Lead International",
    p: "A forward-thinking learning organisation shaping the next generation through hands-on, experiential learning across India and the UAE — the team that designs and runs every MakerChamps batch.",
  },
  {
    logo: "/assets/brand/nlightened-logo.png",
    alt: "Nlightened ZenSolutions LLP",
    h: "Nlightened ZenSolutions",
    p: "A technology startup incubated inside NIT Calicut's Technology Business Incubator. This program runs from within NIT itself — not an outside group renting a venue.",
  },
  {
    logo: "/assets/brand/nit-holistic-centre-logo.png",
    alt: "Centre for Holistic Teaching and Learning, NIT Calicut",
    h: "Centre for Holistic Teaching & Learning",
    p: "NIT Calicut's own centre for holistic student development. MakerChamps runs in association with them — that's what gets your child real access to NIT's classrooms, labs, and faculty, not a rented hall nearby.",
  },
];

const DIRECTORS = [
  { img: "/assets/photos/director-arjun-cp.webp", name: "Arjun C P" },
  { img: "/assets/photos/director-sabarinath-k.webp", name: "Sabarinath K" },
];

export function S07_backers() {
  return (
    <>
      <section className="section bg-white" id="backers">
        <div className="pattern-bg on-light"></div>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Who&apos;s behind it</span>
            <h2>
              Built by innovators, <span className="mc-accent">backed by NIT Calicut</span>
            </h2>
            <p className="lede">
              An experience like this is only as good as the people and the campus behind it. This is
              what makes the exposure real, not staged.
            </p>
          </div>
          <div className="flex flex-col gap-7 md:grid md:grid-cols-[1.3fr_1fr] md:items-start">
            <div className="reveal">
              <div className="flex flex-col gap-4">
                {ORGS.map((o) => (
                  <div
                    key={o.h}
                    className="grid grid-cols-[64px_1fr] items-start gap-x-4 gap-y-1 rounded-[var(--radius-md)] p-5 [border:1px_solid_rgba(2,30,93,0.1)]"
                  >
                    <img
                      className="col-start-1 row-span-2 row-start-1 h-auto w-full max-w-[64px] self-center object-contain"
                      src={o.logo}
                      alt={o.alt}
                    />
                    <h4 className="col-start-2 row-start-1 text-[1.25rem] [color:var(--color-mc-orange)]">
                      {o.h}
                    </h4>
                    <p className="col-start-2 row-start-2 mt-2 text-[0.92rem] leading-[1.55] opacity-[0.78]">
                      {o.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="reveal mt-2 grid grid-cols-2 gap-3.5">
                {DIRECTORS.map((d) => (
                  <div
                    key={d.name}
                    className="rounded-[var(--radius-sm)] p-3.5 text-center [background:var(--color-mc-cream)]"
                  >
                    <img
                      className="aspect-square w-full rounded-xl object-cover"
                      src={d.img}
                      alt={d.name}
                    />
                    <div className="mt-2.5 [font-family:var(--font-bricolage)] text-[0.9rem] [color:var(--color-mc-navy)]">
                      {d.name}
                    </div>
                    <div className="text-[0.72rem] opacity-60">Director, De&apos; Lead International</div>
                  </div>
                ))}
              </div>
              <div className="reveal relative overflow-hidden rounded-[var(--radius-lg)] [padding:30px_26px] text-center [background:var(--color-mc-navy)] [color:var(--color-mc-white)]">
                <svg
                  className="pointer-events-none absolute -bottom-[50px] -right-[50px] h-[190px] w-[190px] opacity-[0.18] [color:var(--color-mc-lime)]"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M50 10L90 30v40L50 90 10 70V30z" />
                  <path d="M10 30l40 20 40-20M50 50v40" />
                </svg>
                <div className="relative z-[1] [font-family:var(--font-anton)] [font-size:clamp(3.2rem,16vw,4.2rem)] leading-none [color:var(--color-mc-orange)]">
                  #1
                </div>
                <p className="relative z-[1] mt-2.5 text-[0.9rem] text-white">
                  NIT in Kerala, NIRF top-ranked — and where your child spends two days building, not
                  just visiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
