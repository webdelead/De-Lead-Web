const MODULES: { n: string; h: string; p: string; kind?: "set-a" | "featured" }[] = [
  {
    n: "01",
    h: "Expert Mentors & Real-World Insights",
    p: "Learn from international trainers, NIT professors and students, and NIT-TBI founders through expert sessions and real experiences.",
    kind: "set-a",
  },
  {
    n: "02",
    h: "NIT Campus Exploration & Lab Visits",
    p: "Guided campus walks and lab visits with researchers, helping your child see real innovation up close.",
    kind: "set-a",
  },
  {
    n: "03",
    h: "Team Management & Leadership Skills",
    p: "Mixed teams teach your child to lead, listen, and collaborate under real conditions.",
    kind: "set-a",
  },
  {
    n: "04",
    h: "STEM Learning & Science Experiments",
    p: 'Physics and chemistry that spark real "aha" moments. Science becomes adventure, not a textbook.',
  },
  {
    n: "05",
    h: "Design Thinking & Entrepreneurship",
    p: "The same framework used at IDEO and Stanford. They learn to solve problems the way innovators do.",
  },
  {
    n: "06",
    h: "Maker Mindset & Prototype Building",
    p: "They go home with something built by their own hands. Real materials, real creation.",
  },
  {
    n: "07",
    h: "Entrepreneur Idea Pitching Training",
    p: "Stand up. Speak clearly. Sell the idea. The one skill that opens every door.",
    kind: "featured",
  },
];

const cardBase =
  "stagger-item relative rounded-[var(--radius-md)] p-[22px] shadow-[var(--shadow-card)] transition-transform duration-200 odd:[--tilt:-1deg] even:[--tilt:1deg]";
const kindClass = {
  "set-a": "[background:var(--color-mc-lime)]",
  featured: "[background:var(--color-mc-navy)]",
  white: "bg-white",
} as const;

// num / h3 / p colour per card kind
const tone = {
  "set-a": {
    num: "[color:var(--color-mc-navy)]",
    h3: "[color:var(--color-mc-navy)]",
    p: "relative z-[1] opacity-100 [color:rgba(2,30,93,0.75)]",
  },
  featured: {
    num: "[color:var(--color-mc-lime)]",
    h3: "text-white",
    p: "opacity-100 [color:rgba(247,247,247,0.8)]",
  },
  white: {
    num: "[color:var(--color-mc-orange)]",
    h3: "[color:var(--color-mc-navy)]",
    p: "opacity-75",
  },
} as const;

export function S06_modules() {
  return (
    <>
      <section className="section" id="modules">
        <div className="pattern-bg on-light"></div>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Inside MakerChamps</span>
            <h2>
              7 modules, <span className="mc-accent">skills for life</span>
            </h2>
            <p className="lede">
              Not lectures, not slides. Seven hands-on experiences where your child does, makes, and
              presents.
            </p>
          </div>
          <div className="reveal-stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => {
              const k = m.kind ?? "white";
              return (
                <div key={m.n} className={`${cardBase} ${kindClass[k]}`}>
                  <span className="torn-triangle !-top-2 !right-5 !h-7 !w-7 !rotate-[160deg]"></span>
                  <span className={`[font-family:var(--font-anton)] text-[2.6rem] ${tone[k].num}`}>
                    {m.n}
                  </span>
                  <h3 className={`mt-2 text-[1.42rem] leading-[1.15] ${tone[k].h3}`}>{m.h}</h3>
                  <p className={`mt-2 text-[0.9rem] leading-[1.55] ${tone[k].p}`}>{m.p}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
