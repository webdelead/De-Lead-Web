export function S02_top() {
  return (
    <>
      <header className="hero" id="top">
        <div className="container hero-inner">
          <div className="hero-grid">
            <span className="hero-eyebrow">Think · Make · Transform</span>
            <h1 className="hero-mega">
              <span className="line">TWO DAYS ON</span>
              <span className="line callout">NIT CALICUT CAMPUS</span>
              <span className="line">THAT SHOW WHO</span>
              <span className="line fill-orange">THEY CAN BECOME</span>
            </h1>
      
            <div className="hero-collage">
              <div className="hero-photo-wrap">
                <div className="hero-photo-back torn">
                  <img src="/assets/photos/orientation-auditorium.webp" alt="Students at MakerChamps orientation inside an NIT Calicut auditorium" loading="eager" />
                </div>
                <div className="hero-photo-inner torn">
                  <img src="/assets/photos/nit-calicut-gate.webp" alt="NIT Calicut campus gate with the National Institute of Technology Calicut signboard" loading="eager" style={{ objectPosition: "right center" }} />
                </div>
                <span className="torn-triangle"></span>
                {/* Invite card: only rendered when a next batch is scheduled. Remove this block entirely between seasons. */}
                <a href="#enquire" className="invite-card">
                  <img className="invite-logo" src="/assets/brand/season-3-logo.webp" alt="MakerChamps Season 3" />
                  <span className="invite-label">You're Invited</span>
                  <span className="invite-date">Aug 28–29</span>
                  <span className="invite-loc">NIT Calicut Campus</span>
                </a>
              </div>
            </div>
      
            <div className="hero-actions">
              <a href="#enquire" className="btn btn-primary">Reserve a Seat</a>
              <a href="#modules" className="btn btn-ghost-light">See What They'll Do</a>
            </div>
            <div className="hero-microstats">
              <div>
                <span className="micro-label">WHEN &amp; WHERE</span>
                <span className="micro-val">Aug 28–29 · NIT Calicut Campus, Kozhikode</span>
              </div>
              <div>
                <span className="micro-label">WHAT TO EXPECT</span>
                <span className="micro-val">7 hands-on modules · Real NIT lab access · Only 60 seats</span>
              </div>
            </div>
          </div>
        </div>
        <svg className="hero-bg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--mc-lime)" }}>
          <circle cx="50" cy="42" r="26" />
          <path d="M40 42a10 10 0 0120 0c0 5-3 7-4 11H44c-1-4-4-6-4-11z" />
          <line x1="42" y1="60" x2="58" y2="60" />
          <line x1="44" y1="66" x2="56" y2="66" />
        </svg>
      </header>
    </>
  );
}
