const FACTS: { k: string; big?: string; rest: React.ReactNode }[] = [
  { k: "Since 2023", big: "7+", rest: <> corporate engagements delivered</> },
  { k: "DP World", big: "100", rest: <> staff in a single confidence &amp; team-building cohort</> },
  { k: "Kayzan Group", big: "35", rest: <> senior staff on a two-day outbound in Abu Dhabi</> },
  { k: "Al Ahalia Group", big: "50+", rest: <> decision-makers across five departments</> },
  { k: "Reach", big: "5", rest: <> client organisations, India &amp; the UAE</> },
  { k: "Formats", rest: <>Half-day, one-day, or two-day residential</> },
];

const MASK =
  "linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent)";

const factCard =
  "flex flex-col gap-3 flex-[0_0_288px] rounded-[var(--r)] [padding:24px_24px_26px] [background:rgba(255,255,255,0.05)] [border:1px_solid_rgba(255,255,255,0.13)] max-[520px]:flex-[0_0_78vw]";

export function S03_facts() {
  const row = (clone: boolean) =>
    FACTS.map((f) => (
      <article
        className={factCard}
        key={(clone ? "b" : "a") + f.k}
        {...(clone ? { "aria-hidden": "true" } : {})}
      >
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.13em] [color:#f3c8dc]">
          {f.k}
        </span>
        <p className="text-[0.95rem] leading-[1.45] [color:rgba(255,255,255,0.72)]">
          {f.big && (
            <b className="mb-1.5 block [font-family:var(--font-instrument)] text-[2.4rem] font-semibold leading-none tracking-[-0.03em] text-white">
              {f.big}
            </b>
          )}
          {f.rest}
        </p>
      </article>
    ));

  return (
    <>
      <section className="relative z-[5] mt-[-92px] overflow-hidden bg-ink [padding:26px_0_62px] max-[820px]:mt-[-64px] max-[820px]:pt-10">
        <div
          className="group overflow-hidden"
          style={{ WebkitMaskImage: MASK, maskImage: MASK }}
        >
          <div className="flex w-max gap-[18px] pb-1 [animation:factscroll_46s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </section>

      {/* ============ STATEMENT ============ */}
    </>
  );
}
