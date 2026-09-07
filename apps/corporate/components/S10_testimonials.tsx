import { getTestimonials } from "@/lib/content";

export async function S10_testimonials() {
  const rows = await getTestimonials();
  return (
    <>
      <section
        className="section relative [background:var(--color-cream)] [border-bottom:1px_solid_var(--line)] [border-top:1px_solid_var(--line)]"
        id="testimonials"
      >
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">
              <i className="mk"></i>What clients say
            </span>
            <h2>In their words</h2>
            <p>Short quotes from the people who booked the programme.</p>
          </div>
          <div className="reveal grid grid-cols-3 gap-5 max-[1000px]:grid-cols-1">
            {rows.map((t) => (
              <figure
                className="relative m-0 flex flex-col gap-5 rounded-[var(--r)] [padding:32px_30px_28px] [background:var(--color-paper)] [border:1px_solid_var(--line)]"
                key={t.id}
              >
                <span
                  className="h-[26px] [font-family:var(--font-instrument)] text-[3.4rem] font-bold leading-[0.6] [color:var(--color-magenta-soft)]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="m-0 flex-1 text-[1.02rem] leading-[1.55] text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="pt-4 [border-top:1px_solid_var(--line)]">
                  <b className="block [font-family:var(--font-instrument)] text-base text-ink">
                    {t.authorName}
                  </b>
                  <span className="mt-0.5 block text-[0.82rem] text-ink-soft">{t.authorRole}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-[0.8rem] [color:var(--color-ink-faint)]">
            Placeholder quotes. Send the approved wording, names and roles and we will drop them in.
          </p>
        </div>
      </section>

      {/* ============ TEAM ============ */}
    </>
  );
}
