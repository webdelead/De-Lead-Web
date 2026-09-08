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
              <img src="/assets/photos/session-1.webp" alt="A DLI Education professional training session" />
              <span className="photo-tag pt-1">Hands-on</span>
              <span className="photo-tag pt-2">Cohort or 1-to-1</span>
            </figure>
      
            <div className="hero-aside">
              <div className="hero-blobs"><i></i><i></i><i></i></div>
              <p>Delivered the same hands-on way as the rest of De&apos; Lead International, scoped to your team, department or whole institution.</p>
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
