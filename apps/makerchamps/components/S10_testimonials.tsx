import { getTestimonials } from "@/lib/content";

export async function S10_testimonials() {
  const rows = await getTestimonials();
  return (
    <>
      <section className="section testimonials" id="testimonials">
        <div className="pattern-bg on-dark"></div>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: "var(--mc-lime)" }}>This is what we hear</span>
            <h2>From parents. From students. <span className="italic">From the MakerChamps experience.</span></h2>
          </div>
          <div className="testimonial-grid reveal-stagger">
            {rows.map((t) => (
              <div className="testimonial-card stagger-item" key={t.id}>
                <span className="quote-mark">&quot;</span>
                <p>{t.quote}</p>
                <cite>
                  {t.authorName}
                  <span>{t.authorRole}</span>
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
