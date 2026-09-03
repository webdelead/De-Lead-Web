export function S03_top() {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-panel">
          <h1 className="h1">Skills that shape<br />leaders.</h1>
          <p className="hero-sub">Academic knowledge alone is no longer enough. Future-skills and soft-skills training for educators, HR teams, institutions and working professionals, plus applied Gen AI.</p>
          <div className="hero-paths">
            <a className="hp-pros" href="#areas">See the skill areas
              <svg className="ic" aria-hidden="true"><use href="#i-arrow" /></svg></a>
            <a className="hp-students" href="/students">For students
              <svg className="ic" aria-hidden="true"><use href="#i-arrow" /></svg></a>
          </div>
      
          <div className="hero-cols">
            <div className="hero-intro">
              <h3><svg className="ic" aria-hidden="true"><use href="#i-lightbulb" /></svg> The gap is not knowledge</h3>
              <p>It is what you do with it. We build the cognitive and interpersonal skills that complex, fast-changing work asks for.</p>
              <div className="avatars"><span>DT</span><span>LD</span><span>AI</span><span>HR</span><span>+</span></div>
              <div className="hi-count">6 skill areas, plus applied Gen AI</div>
            </div>
      
            <figure className="hero-figure">
              <svg className="squiggle" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M14 224c-4-48 26-84 70-84 40 0 58 44 22 66-30 18-70-8-46-44 20-30 74-40 128-96" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
              <img src="/assets/photos/session-1.webp" alt="A DLI Education professional training session" />
              <span className="photo-tag pt-1">Hands-on</span>
              <span className="photo-tag pt-2">Cohort or 1-to-1</span>
            </figure>
      
            <div className="hero-aside">
              <div className="hero-blobs"><i></i><i></i><i></i></div>
              <p>Delivered the same hands-on way as the rest of De' Lead International, scoped to your team, department or whole institution.</p>
              <a href="#areas" className="btn">See the skill areas
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></a>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============ WHY ============ */}
    </>
  );
}
