export function S02_top() {
  return (
    <>
      <header className="hero" id="top">
        <div className="wrap bento">
          <div className="b-head reveal">
            <svg className="doodle-spark d1" viewBox="0 0 60 60" fill="none" aria-hidden="true"><path d="M30 4 C33 20 40 27 56 30 C40 33 33 40 30 56 C27 40 20 33 4 30 C20 27 27 20 30 4 Z" stroke="var(--red-bright)" strokeWidth="2" strokeLinejoin="round" /></svg>
            <svg className="doodle-spark d2" viewBox="0 0 60 24" fill="none" aria-hidden="true"><path d="M2 12 C10 3 16 3 22 12 C28 21 34 21 40 12 C46 3 52 3 58 12" stroke="var(--magenta)" strokeWidth="2.5" strokeLinecap="round" /></svg>
            <div className="b-live reveal"><span className="dot"></span> Phase 4 running now in Kozhikode, Malappuram &amp; Wayanad</div>
            <h1>44 government schools. <span className="doodle-wrap"><mark>1,300+</mark><svg className="doodle-circle" viewBox="0 0 200 90" fill="none" aria-hidden="true"><path d="M14,42 C10,14 58,2 101,4 C152,6 197,17 191,47 C186,76 129,87 89,84 C38,81 19,73 14,42 Z" stroke="var(--red)" strokeWidth="3" strokeLinecap="round" /></svg></span> children. Robots that actually worked.</h1>
            <p className="lead">Walk2Lead Robotics Tech Quest brings hands-on robotics, coding and AI into rural government schools across Kerala, funded by Walkaroo Foundation and implemented end-to-end by <strong>De' Lead International</strong>, a prominent CSR implementation team. In association with the District Institutes of Education and Training (DIET) and the General Education Department, Government of Kerala. Four phases. Scaling every time.</p>
            <div className="hero-actions" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <a className="btn btn-primary" href="#partner">Start a CSR project →</a>
              <a className="btn btn-ghost" href="#reality">See how we deliver</a>
            </div>
          </div>
          <div className="b-photo-group reveal">
            <div className="hero-slides">
              {/* ADD MORE GROUP PHOTOS HERE — duplicate a <div className="hero-slide"> block */}
              <div className="hero-slide"><img src="/assets/big-group.jpg" alt="Walk2Lead cohort group photo" /></div>
              <div className="hero-slide"><img src="/assets/group-hall-wyd.jpg" alt="Walk2Lead Wayanad cohort group photo" style={{ objectPosition: "center bottom" }} /></div>
            </div>
          </div>
          <div className="b-actions reveal">
            <img loading="lazy" decoding="async" className="b-actions-logo" src="/assets/logo-delead-dark.png" alt="De' Lead International" style={{ width: "auto", objectFit: "contain" }} />
            <div className="b-actions-text">
              <div className="b-actions-title">Implemented by De' Lead International</div>
              <p className="b-actions-sub">India &amp; UAE · "Learn, Develop &amp; Lead"</p>
            </div>
            <a className="btn btn-ghost" href="#delead">Why us →</a>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0,32 C240,80 480,0 720,28 C960,56 1200,88 1440,40 L1440,90 L0,90 Z" fill="var(--ink)" /></svg>
      </header>
    </>
  );
}
