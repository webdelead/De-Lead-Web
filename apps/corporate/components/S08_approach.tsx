const STEPS: { n: string; h: string; p: string }[] = [
  {
    n: "01",
    h: "Experiential by default",
    p: "People learn by doing, under real pressure. Every session turns on an activity, not a slide.",
  },
  {
    n: "02",
    h: "Tailored, not templated",
    p: "Assembled from your team’s actual challenges and the room it happens in.",
  },
  {
    n: "03",
    h: "Boardroom to open field",
    p: "Strategy drills and rope courses inside one engagement.",
  },
  {
    n: "04",
    h: "The whole team",
    p: "Leadership included. That’s where the shift actually sticks.",
  },
];

export function S08_approach() {
  return (
    <>
      <section className="section relative bg-ink text-white" id="approach">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow on-dark">
              <i className="mk"></i>How every programme runs
            </span>
            <h2 className="text-white">The method behind every batch</h2>
          </div>
          <ol className="reveal grid grid-cols-2 gap-0.5 overflow-hidden rounded-[var(--r)] [border:1px_solid_rgba(255,255,255,0.14)] max-[1000px]:grid-cols-1">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="flex gap-[22px] [padding:38px_34px] [background:rgba(255,255,255,0.02)] max-[520px]:[padding:28px_24px]"
              >
                <span className="flex-none [font-family:'Instrument_Sans',sans-serif] text-[1.6rem] font-semibold leading-none tracking-[-0.03em] [color:var(--color-magenta-soft)]">
                  {s.n}
                </span>
                <div>
                  <h4 className="mb-[9px] text-[1.2rem] text-white">{s.h}</h4>
                  <p className="text-[0.94rem] leading-[1.55] [color:#c9bcc3]">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ TRACK RECORD ============ */}
    </>
  );
}
