// Decorative floating photos — still driven by public/js/main.js (pointer drag +
// `floaty` keyframe). Kept verbatim; migrates in the Phase B behaviour swap.
const SCATTER: [string, string, string, string, string][] = [
  ["140px", "40px", "-6deg", "0s", "boy-mic.jpg"],
  ["255px", "250px", "5deg", ".5s", "girl-mic-team.jpg"],
  ["370px", "60px", "4deg", "1s", "award-kids.jpg"],
  ["485px", "240px", "-4deg", "1.5s", "panel.jpg"],
  ["600px", "50px", "7deg", "2s", "memento-group.jpg"],
  ["715px", "230px", "-8deg", "2.5s", "inauguration.jpg"],
  ["830px", "90px", "6deg", "3s", "project-table.jpg"],
  ["930px", "260px", "-5deg", "3.5s", "expo-team1.jpg"],
];
const SCATTER_ALT = [
  "Student presenting his project",
  "Student team presenting",
  "Students receiving recognition",
  "Stakeholder panel at district event",
  "Memento distribution ceremony",
  "Programme inauguration",
  "Students demonstrating a prototype",
  "Team at the expo",
];

const tag =
  "mb-2.5 inline-block rounded-full bg-cream-2 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-w2l";

const BEATS: { tag: string; global?: boolean; yr: React.ReactNode; h3: string; body: React.ReactNode; countries?: boolean }[] = [
  {
    tag: "2023 · Phase 1",
    yr: "Kinalur GUPS, Kozhikode",
    h3: "The pilot nobody had to renew",
    body: (
      <>
        One school, 48 students, no track record to point to. De&apos; Lead ran the full 30-session
        curriculum anyway, taking students from electronics to a working prototype, presented by
        12-year-olds. It was enough to take the programme into a second district next.
      </>
    ),
  },
  {
    tag: "Phase 2 · Scale-up",
    yr: <>Malappuram &amp; Kozhikode</>,
    h3: "16 schools, 480 students: the first real test of the system",
    body: (
      <>
        Two districts at once meant real operational strain: shared laptops, patchy power, schools
        running in parallel across both. The programme still delivered a documented{" "}
        <strong>92.99% average attendance</strong>, tracked school-by-school, not estimated.
      </>
    ),
  },
  {
    tag: "Phase 3 · New ground",
    yr: "Kannur",
    h3: "Trusted across a third district",
    body: (
      <>
        3 schools, 90 students, including DIET&apos;s own Lab School in Palayad, with the academic
        partner trusting the programme inside its own training ground.
      </>
    ),
  },
  {
    tag: "Phase 4 · Running now",
    yr: <>Kozhikode, Malappuram &amp; Wayanad</>,
    h3: "24 schools, 705 students, and a jump to the international stage",
    body: (
      <>
        The largest phase yet. Twelve students from this cohort were selected for the{" "}
        <strong>
          TechTop 2025 International Inclusive Innovation Challenge &amp; Zero2Entrepreneur Bootcamp
        </strong>
        , held 28 Nov–4 Dec 2025 at Maker Village, Kochi: 5 from Kozhikode, 7 from Malappuram.
        Government-school kids from Phase 4, on a global startup stage.
      </>
    ),
  },
  {
    tag: "28 Nov–4 Dec 2025 · International milestone",
    global: true,
    yr: "TechTop 2025 International Inclusive Innovation Challenge & Zero2Entrepreneur Bootcamp",
    h3: "Walk2Lead students ranked top 2 — out of the world",
    body: (
      <>
        A 7-day maker-to-entrepreneur bootcamp at <strong>Maker Village, Kochi</strong>, bringing
        together 37–45 hand-picked student innovators from Grades 6–12 across India, Japan and UAE.
        Students worked alongside mentors from <strong>MIT and Stanford</strong>, building prototypes
        addressing UN Sustainable Development Goals. Out of all participants across every country, the{" "}
        <strong>top 2 ranked students came from Walk2Lead</strong> — government school kids from
        Kerala.
      </>
    ),
    countries: true,
  },
];

export function S06_story() {
  return (
    <>
      <section
        id="story"
        className="bg-[linear-gradient(180deg,#fff,var(--color-cream))] [border-top:1px_solid_var(--color-line)]"
      >
        <div className="wrap relative">
          <div className="eyebrow reveal">The Story</div>
          <h2 className="h2 reveal">One school in Kozhikode. Scaled to four districts</h2>
          <p className="lead reveal">
            Kinalur GUPS was a single pilot in 2023. Walk2Lead has since reached Kozhikode,
            Malappuram, Wayanad and Kannur, expanding with every phase.
          </p>
          <div
            id="story-scatter"
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-[460px] min-[1350px]:block"
          >
            {SCATTER.map(([top, left, r, d, file], i) => (
              <div
                key={file}
                className="scatter-photo pointer-events-auto absolute w-[190px] cursor-grab select-none overflow-hidden rounded-[16px] bg-white shadow-[0_16px_34px_-14px_rgba(0,0,0,0.35)] [animation:floaty_5s_ease-in-out_infinite] [animation-delay:var(--d,0s)] [border:5px_solid_#fff] [touch-action:none] [transform:rotate(var(--r,0deg))] active:cursor-grabbing active:[animation-play-state:paused] motion-reduce:[animation:none] [&.dragging]:[animation-play-state:paused]"
                style={{ top, left, "--r": r, "--d": d, zIndex: String(i + 1) }}
              >
                <img
                  src={`/assets/${file}`}
                  alt={SCATTER_ALT[i]}
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none block aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="relative mt-[52px] pl-8 [border-left:2px_solid_var(--color-line)]">
            {BEATS.map((b) => (
              <div
                key={b.h3}
                className="relative pb-[42px] last:pb-0 before:absolute before:left-[-38px] before:top-1 before:h-3 before:w-3 before:rounded-full before:bg-w2l before:[border:3px_solid_var(--color-cream)] before:content-['']"
              >
                <div className={b.global ? `${tag} !bg-[#fff8e6] !text-[#a06800]` : tag}>{b.tag}</div>
                <div className="mb-1.5 font-serif text-[1.05rem] font-semibold text-w2l">{b.yr}</div>
                <h3 className="mb-2 text-[1.25rem]">{b.h3}</h3>
                <p className="max-w-[640px] text-[0.96rem] text-ink-soft">{b.body}</p>
                {b.countries && (
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {["🇮🇳 India", "🇯🇵 Japan", "🇦🇪 UAE"].map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-[#fff8e6] px-3 py-[5px] text-[0.82rem] font-semibold text-[#7a5000] [border:1px_solid_#f0d88a]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
    </>
  );
}
