// grid placement + @900 collapse (all tiles -> full-width, auto row, min-h)
const brk =
  "max-[900px]:[grid-column:1/3] max-[900px]:[grid-row:auto] max-[900px]:min-h-[150px]";
const tileBase =
  "reveal relative flex flex-col justify-end overflow-hidden rounded-[20px] p-[26px]";
const num = "font-serif text-[clamp(2.2rem,3.6vw,3rem)] leading-none";
const lbl = "mt-2 text-[0.98rem] font-semibold";
const body = "mt-1.5 max-w-[34ch] text-[0.85rem]";

type Tile = {
  count: number;
  suffix?: string;
  lbl: React.ReactNode;
  body: React.ReactNode;
  place: string;
  tile: string;
  pClass: string;
};

const TILES: Tile[] = [
  {
    count: 44,
    lbl: "Schools Implemented",
    body: (
      <>
        Government UP &amp; high schools across four districts, each running the full 30-session
        curriculum.
      </>
    ),
    place: "[grid-column:1/4] [grid-row:1/3]",
    tile: "bg-w2l text-white",
    pClass: "text-white/85",
  },
  {
    count: 1300,
    suffix: "+",
    lbl: "Students = Families Reached",
    body: (
      <>
        Grades 6 &amp; 7, selected from cohorts of 300–400 applicants per school, in rural &amp;
        coastal Kerala.
      </>
    ),
    place: "[grid-column:4/7] [grid-row:1/3]",
    tile: "bg-ink text-white",
    pClass: "text-white/70",
  },
  {
    count: 4,
    lbl: "Districts Reached",
    body: <>Kozhikode, Malappuram, Kannur &amp; Wayanad, across four phases.</>,
    place: "[grid-column:1/3] [grid-row:3/5]",
    tile: "bg-cream-2 text-ink",
    pClass: "text-ink-soft",
  },
  {
    count: 14,
    lbl: <>→ Students at International Bootcamp</>,
    body: (
      <>
        Selected for the TechTop 2025 International Inclusive Innovation Challenge &amp;
        Zero2Entrepreneur Bootcamp, 28 Nov–4 Dec 2025, Maker Village, Kochi.
      </>
    ),
    place: "[grid-column:3/5] [grid-row:3/5]",
    tile: "bg-white text-ink [border:1.5px_solid_var(--color-line)]",
    pClass: "text-ink-soft",
  },
  {
    count: 20,
    suffix: "+",
    lbl: "Students with State-Level Recognition",
    body: (
      <>
        Won recognition at the innovation competition hosted by Kerala Government&apos;s General
        Education Department.
      </>
    ),
    place: "[grid-column:1/4] [grid-row:5/7]",
    tile: "bg-cream-2 text-ink",
    pClass: "text-ink-soft",
  },
  {
    count: 2,
    lbl: <>→ Students with Inspire Awards</>,
    body: (
      <>
        Harshit Raj of GMUPS Edakkanad, the only Inspire Award winner in Tirur Sub-District that
        year, and Ashish Krishna of GUPS Thavanur.
      </>
    ),
    place: "[grid-column:4/7] [grid-row:5/7]",
    tile: "bg-white text-ink [border:1.5px_solid_var(--color-line)]",
    pClass: "text-ink-soft",
  },
];

export function S08_impact() {
  return (
    <>
      <section id="impact" className="bg-white [border-top:1px_solid_var(--color-line)]">
        <div className="wrap">
          <div className="eyebrow reveal">The Numbers</div>
          <h2 className="h2 reveal">What four phases add up to</h2>
          <p className="lead reveal">
            Not vanity metrics: every number here is verified against school-wise attendance records
            and session reports.
          </p>
          <div className="reveal mt-12 grid grid-cols-6 gap-4 [grid-auto-rows:96px] max-[900px]:grid-cols-2 max-[900px]:[grid-auto-rows:auto]">
            {TILES.slice(0, 4).map((t, i) => (
              <div key={i} className={`${tileBase} ${brk} ${t.place} ${t.tile}`}>
                <b className={num} data-count={t.count} data-suffix={t.suffix}>
                  0
                </b>
                <div className={lbl}>{t.lbl}</div>
                <p className={`${body} ${t.pClass}`}>{t.body}</p>
              </div>
            ))}
            <div
              className={`reveal relative overflow-hidden rounded-[20px] p-0 [grid-column:5/7] [grid-row:3/5] ${brk} max-[900px]:aspect-[16/10]`}
            >
              <img
                loading="lazy"
                decoding="async"
                src="/assets/robot-track.jpg"
                alt="Student-built robot on test track"
                className="h-full w-full object-cover"
              />
            </div>
            {TILES.slice(4).map((t, i) => (
              <div key={i} className={`${tileBase} ${brk} ${t.place} ${t.tile}`}>
                <b className={num} data-count={t.count} data-suffix={t.suffix}>
                  0
                </b>
                <div className={lbl}>{t.lbl}</div>
                <p className={`${body} ${t.pClass}`}>{t.body}</p>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              color: "var(--ink-soft)",
              fontSize: ".9rem",
              marginTop: "22px",
            }}
          >
            <b style={{ color: "var(--red)" }}>10+ sub-education districts</b> reached across the
            four.
          </p>
        </div>
      </section>

      {/* REALITY */}
    </>
  );
}
