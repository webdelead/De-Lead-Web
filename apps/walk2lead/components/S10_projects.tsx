import { getProjects } from "@/lib/content";

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

export async function S10_projects() {
  const rows = await getProjects();
  return (
    <>
      <section className="projects">
        <div className="wrap">
          <div className="eyebrow reveal">Proof, not promises</div>
          <h2 className="h2 reveal">What 12-year-olds built</h2>
          <p className="lead reveal">Not toy demos: socially relevant prototypes, designed, coded and presented by government school students.</p>
          <div className="cards" id="proj-track">
            {rows.map((p) => (
              <div className="pcard reveal" key={p.id}>
                <img loading="lazy" decoding="async" src={p._url} alt={p._alt || `Students presenting the ${p.title}`} />
                <div className="body">
                  <span className="chip">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-nav">
            <button className="slider-btn" id="proj-prev" aria-label="Previous project">{chevL}</button>
            <button className="slider-btn" id="proj-next" aria-label="Next project">{chevR}</button>
          </div>
        </div>
      </section>

      {/* VIDEO */}
    </>
  );
}
