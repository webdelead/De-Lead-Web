export function S07_backers() {
  return (
    <>
      <section className="section backers" id="backers">
        <div className="pattern-bg on-light"></div>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Who's behind it</span>
            <h2>Built by innovators, <span className="italic">backed by NIT Calicut</span></h2>
            <p className="lede">An experience like this is only as good as the people and the campus behind it. This is what makes the exposure real, not staged.</p>
          </div>
          <div className="backers-grid">
            <div className="reveal">
              <div className="backer-orgs">
                <div className="backer-org">
                  <img className="backer-org-logo" src="/assets/brand/dli-logo-color.webp" alt="De' Lead International" />
                  <h4>De' Lead International</h4>
                  <p>A forward-thinking learning organisation shaping the next generation through hands-on, experiential learning across India and the UAE — the team that designs and runs every MakerChamps batch.</p>
                </div>
                <div className="backer-org">
                  <img className="backer-org-logo" src="/assets/brand/nlightened-logo.png" alt="Nlightened ZenSolutions LLP" />
                  <h4>Nlightened ZenSolutions</h4>
                  <p>A technology startup incubated inside NIT Calicut's Technology Business Incubator. This program runs from within NIT itself — not an outside group renting a venue.</p>
                </div>
                <div className="backer-org">
                  <img className="backer-org-logo" src="/assets/brand/nit-holistic-centre-logo.png" alt="Centre for Holistic Teaching and Learning, NIT Calicut" />
                  <h4>Centre for Holistic Teaching &amp; Learning</h4>
                  <p>NIT Calicut's own centre for holistic student development. MakerChamps runs in association with them — that's what gets your child real access to NIT's classrooms, labs, and faculty, not a rented hall nearby.</p>
                </div>
              </div>
            </div>
            <div className="backer-side">
              <div className="directors reveal">
                <div className="director-card">
                  <img src="/assets/photos/director-arjun-cp.webp" alt="Arjun C P" />
                  <div className="name">Arjun C P</div>
                  <div className="role">Director, De' Lead International</div>
                </div>
                <div className="director-card">
                  <img src="/assets/photos/director-sabarinath-k.webp" alt="Sabarinath K" />
                  <div className="name">Sabarinath K</div>
                  <div className="role">Director, De' Lead International</div>
                </div>
              </div>
              <div className="backer-stat reveal">
                <svg className="stat-bg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M50 10L90 30v40L50 90 10 70V30z" />
                  <path d="M10 30l40 20 40-20M50 50v40" />
                </svg>
                <div className="big">#1</div>
                <p>NIT in Kerala, NIRF top-ranked — and where your child spends two days building, not just visiting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
