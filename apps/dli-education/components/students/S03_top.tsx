export function S03_top() {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-panel">
          <h1 className="h1">#anyonecancode.<br />Here is where.</h1>
          <p className="hero-sub">Technology courses that run on real projects and a mentor per learner. From a first line of Python to a working robot, a live website or a trained model.</p>
          <div className="hero-paths">
            <a className="hp-students" href="#catalogue">See the catalogue
              <svg className="ic" aria-hidden="true"><use href="#i-arrow" /></svg></a>
            <a className="hp-pros" href="/professionals">For professionals
              <svg className="ic" aria-hidden="true"><use href="#i-arrow" /></svg></a>
          </div>
      
          <div className="hero-cols">
            <div className="hero-intro">
              <h3><svg className="ic" aria-hidden="true"><use href="#i-bot" /></svg> Real robots, real code</h3>
              <p>Every course ends with something that runs. Small groups or 1-to-1, and a completion certificate at the end.</p>
              <div className="avatars"><span>PY</span><span>3D</span><span>AI</span><span>JS</span><span>+</span></div>
              <div className="hi-count">11 course tracks, four families</div>
            </div>
      
            <figure className="hero-figure">
              <img src="/assets/photos/session-4.webp" alt="Students building projects in a DLI Education session" />
              <span className="photo-tag pt-1">Project-first</span>
              <span className="photo-tag pt-2">Mentor per learner</span>
            </figure>
      
            <div className="hero-aside">
              <div className="hero-blobs"><i></i><i></i><i></i></div>
              <p>Fundamentals and clean thinking come before frameworks, so what learners pick up transfers to whatever tool is next.</p>
              <a href="#catalogue" className="btn">See the catalogue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></a>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============ HOW IT WORKS ============ */}
    </>
  );
}
