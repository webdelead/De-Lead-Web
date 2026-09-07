import { getTestimonials } from "@/lib/content";

export async function S10_testimonials() {
  const rows = await getTestimonials();
  return (
    <>
      <section
        className="section overflow-hidden [background:var(--color-mc-navy)] [color:var(--color-mc-cream)]"
        id="testimonials"
      >
        <div className="pattern-bg on-dark"></div>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: "var(--mc-lime)" }}>
              This is what we hear
            </span>
            <h2>
              From parents. From students.{" "}
              <span className="mc-accent">From the MakerChamps experience.</span>
            </h2>
          </div>
          <div className="reveal-stagger flex flex-col gap-4 md:grid md:grid-cols-2">
            {rows.map((t) => (
              <div
                className="stagger-item relative rounded-[var(--radius-md)] [border-top-left-radius:4px] p-5 [background:var(--color-mc-navy-deep)] [border:1px_solid_rgba(247,247,247,0.1)]"
                key={t.id}
              >
                <span className="mb-1.5 block [font-family:var(--font-anton)] text-[2.8rem] leading-none [color:var(--color-mc-lime)]">
                  &quot;
                </span>
                <p className="text-[0.92rem] leading-[1.6] [color:rgba(247,247,247,0.9)]">{t.quote}</p>
                <cite className="mt-3.5 block not-italic [font-family:var(--font-bricolage)] text-[0.82rem] [color:var(--color-mc-lime)]">
                  {t.authorName}
                  <span className="mt-0.5 block [font-family:var(--font-inter)] text-[0.76rem] font-normal [color:rgba(247,247,247,0.55)]">
                    {t.authorRole}
                  </span>
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
