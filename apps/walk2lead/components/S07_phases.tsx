type Phase = {
  tag: string;
  live?: boolean;
  current?: boolean;
  h3: string;
  where: React.ReactNode;
  stats: [string, string][];
};

const PHASES: Phase[] = [
  {
    tag: "Phase 1 · Pilot",
    h3: "Kinalur GUPS",
    where: "Kozhikode, where it all began",
    stats: [
      ["1", "School"],
      ["48", "Students"],
    ],
  },
  {
    tag: "Phase 2 · Scale-up",
    h3: "Two Districts",
    where: <>Malappuram &amp; Kozhikode</>,
    stats: [
      ["16", "Schools"],
      ["480", "Students"],
    ],
  },
  {
    tag: "Phase 3 · New Ground",
    h3: "Kannur",
    where: "Incl. DIET Lab School, Palayad",
    stats: [
      ["3", "Schools"],
      ["90", "Students"],
    ],
  },
  {
    tag: "Phase 4 · Running Now",
    live: true,
    current: true,
    h3: "Three Districts",
    where: <>Kozhikode, Malappuram &amp; Wayanad</>,
    stats: [
      ["24", "Schools"],
      ["705", "Students"],
    ],
  },
];

export function S07_phases() {
  return (
    <>
      <section
        id="phases"
        className="relative overflow-hidden bg-magenta text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[url('/assets/pattern.svg')] before:bg-[length:800px] before:opacity-50 before:[filter:invert(1)] before:content-['']"
      >
        <div className="wrap relative">
          <div className="eyebrow reveal text-[#f9cccc] before:bg-[#f9cccc]">By The Numbers</div>
          <h2 className="h2 reveal">Every phase, funded on the results of the last</h2>
          <p className="lead reveal text-white/[0.78]">
            The strongest endorsement a CSR programme can earn: the same funder, paying for it four
            times running.
          </p>
          <div className="mt-14 grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {PHASES.map((p) => (
              <div
                key={p.tag}
                className={`reveal rounded-[18px] px-6 py-7 [backdrop-filter:blur(4px)] ${
                  p.current
                    ? "bg-white text-ink [border:1px_solid_rgba(255,255,255,0.16)]"
                    : "bg-white/[0.06] [border:1px_solid_rgba(255,255,255,0.16)]"
                }`}
              >
                <div
                  className={`mb-3 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${
                    p.current ? "text-accent" : "text-[#f9cccc]"
                  }`}
                >
                  {p.live && (
                    <span className="h-[7px] w-[7px] rounded-full bg-w2l-bright [animation:pulse_1.6s_infinite]" />
                  )}
                  {p.tag}
                </div>
                <h3 className="mb-1.5 text-[1.2rem]">{p.h3}</h3>
                <div className="mb-[18px] min-h-[2.6em] text-[0.85rem] opacity-75">{p.where}</div>
                <div
                  className={`flex gap-[22px] pt-4 ${
                    p.current
                      ? "[border-top:1px_solid_var(--color-line)]"
                      : "[border-top:1px_solid_rgba(255,255,255,0.18)]"
                  }`}
                >
                  {p.stats.map(([n, label]) => (
                    <div key={label}>
                      <b className="block font-serif text-[1.5rem] leading-[1.1]">{n}</b>
                      <span className="text-[0.74rem] uppercase tracking-[0.08em] opacity-70">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT MOSAIC */}
    </>
  );
}
