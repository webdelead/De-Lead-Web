import { getTrackRecord } from "@/lib/content";

const MASK = "linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent)";

export async function S09_trackrecord() {
  const rows = await getTrackRecord();
  const card = (r: (typeof rows)[number], clone: boolean) => (
    <article
      className="flex flex-col gap-[11px] flex-[0_0_316px] rounded-[var(--r)] [padding:28px_26px] [background:var(--color-paper)] [border:1px_solid_var(--line)] max-[520px]:flex-[0_0_80vw]"
      key={(clone ? "b" : "a") + r.id}
      {...(clone ? { "aria-hidden": "true" } : {})}
    >
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-magenta">
        {r.whenLabel}
      </span>
      <h4 className="[font-family:var(--font-instrument)] text-[1.35rem] tracking-[-0.02em]">
        {r.client}
      </h4>
      <p className="flex-1 text-[0.92rem] leading-[1.5] text-ink-soft">{r.blurb}</p>
      <span className="self-start rounded-full [padding:6px_13px] text-[0.76rem] font-bold [background:var(--color-cream-2)] [color:var(--color-magenta-deep)]">
        {r.badge}
      </span>
    </article>
  );

  return (
    <>
      <section className="section relative" id="track-record">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">
              <i className="mk"></i>Proof
            </span>
            <h2>Engagements, dated and named</h2>
            <p>Corporate programmes delivered since 2023.</p>
          </div>
        </div>
        <div
          className="group overflow-hidden [padding:6px_0_16px]"
          style={{ WebkitMaskImage: MASK, maskImage: MASK }}
        >
          <div className="flex w-max gap-[18px] [animation:trackscroll_64s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {rows.map((r) => card(r, false))}
            {rows.map((r) => card(r, true))}
          </div>
        </div>
        <div className="wrap">
          <p className="mt-3.5 text-[0.8rem] [color:var(--color-ink-faint)]">
            Dates and details per De&rsquo; Lead International&rsquo;s programme records.
          </p>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
    </>
  );
}
