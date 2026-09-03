import type { CSSProperties } from "react";
import { getVoices } from "@/lib/content";

const chevL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const chevR = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// crop tweak that lived as an inline style on one feature photo in the static markup
const PHOTO_STYLE: Record<string, CSSProperties> = {
  "Dr. Sumitra Binu": { objectPosition: "50% 10%" },
};

export async function S12_voices() {
  const rows = await getVoices();
  const features = rows.filter((r) => r.sourceNote === "feature");
  const slider = rows.filter((r) => r.sourceNote !== "feature");

  return (
    <>
      <section className="quotes" id="voices">
        <div className="wrap">
          <div className="eyebrow reveal">Voices</div>
          <h2 className="h2 reveal">The foundation, the government, the schools, and the parents</h2>

          {features.map((f) => (
            <div className="feature-quote reveal" key={f.id}>
              <div className="feature-photo">
                <img loading="lazy" decoding="async" src={f._url} alt={f.authorName} style={PHOTO_STYLE[f.authorName]} />
              </div>
              <div className="feature-body">
                <span className="mark">&quot;</span>
                <p>{f.quote}</p>
                <div className="who">
                  <div>
                    <b>{f.authorName}</b>
                    <span>{f.authorRole}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="quote-slider reveal">
            <div className="quote-track" id="quote-track">
              {slider.map((q) => (
                <div className="quote" key={q.id}>
                  <span className="mark">&quot;</span>
                  <p>{q.quote}</p>
                  <div className="who">
                    <div className="avatar">
                      {q._url ? (
                        <img loading="lazy" decoding="async" src={q._url} alt={q.authorName} />
                      ) : (
                        (q.authorName.split(/\s+/).pop() ?? "?")[0]
                      )}
                    </div>
                    <div>
                      <b>{q.authorName}</b>
                      <span>{q.authorRole}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-nav">
              <button className="slider-btn" id="quote-prev" aria-label="Previous testimonial">{chevL}</button>
              <button className="slider-btn" id="quote-next" aria-label="Next testimonial">{chevR}</button>
            </div>
          </div>
        </div>
      </section>

      {/* DE'LEAD SPOTLIGHT */}
    </>
  );
}
