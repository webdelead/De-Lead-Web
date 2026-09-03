import { getTestimonials } from "@/lib/content";

export async function S10_testimonials() {
  const rows = await getTestimonials();
  return (
    <>
      <section className="section testi" id="testimonials">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow"><i className="mk"></i>What clients say</span>
            <h2>In their words</h2>
            <p>Short quotes from the people who booked the programme.</p>
          </div>
          <div className="testi-grid reveal">
            {rows.map((t) => (
              <figure className="quote" key={t.id}>
                <span className="quote-mark" aria-hidden="true">&ldquo;</span>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <b>{t.authorName}</b>
                  <span>{t.authorRole}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="testi-note">Placeholder quotes. Send the approved wording, names and roles and we will drop them in.</p>
        </div>
      </section>

      {/* ============ TEAM ============ */}
    </>
  );
}
