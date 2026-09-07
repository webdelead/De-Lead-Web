const NUMS: { n: string; count?: number; suffix?: string; label: string }[] = [
  { n: "7+", count: 7, suffix: "+", label: "Corporate engagements since 2023" },
  { n: "100", count: 100, suffix: "", label: "Staff in a single DP World cohort" },
  { n: "50+", count: 50, suffix: "+", label: "Decision-makers trained at Al Ahalia Group" },
  { n: "India & UAE", label: "Sessions run on the ground in both" },
];

const numB =
  "block [font-family:'Instrument_Sans',sans-serif] font-semibold [font-size:clamp(2.4rem,5vw,3.9rem)] tracking-[-0.04em] leading-none text-ink mb-3.5";

export function S07_section() {
  return (
    <>
      <section className="section relative">
        <div className="wrap">
          <div className="reveal grid grid-cols-4 gap-0 max-[1000px]:grid-cols-2 max-[1000px]:gap-x-6 max-[520px]:grid-cols-1">
            {NUMS.map((it, i) => (
              <div
                key={it.label}
                className={`[padding:8px_26px_22px_0] [border-bottom:2px_solid_var(--color-ink)] max-[520px]:mb-2 ${
                  i < 2 ? "max-[1000px]:mb-2" : ""
                }`}
              >
                {it.count != null ? (
                  <b className={numB} data-count={it.count} data-suffix={it.suffix}>
                    {it.n}
                  </b>
                ) : (
                  <b className={numB}>{it.n}</b>
                )}
                <span className="block max-w-[22ch] text-[0.86rem] leading-[1.4] text-ink-soft">
                  {it.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPROACH ============ */}
    </>
  );
}
