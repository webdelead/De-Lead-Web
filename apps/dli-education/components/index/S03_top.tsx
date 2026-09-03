export function S03_top() {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-panel">
          <h1 className="h1">Build Real Skills.<br />Have Real Fun.</h1>
          <p className="hero-sub">Mentor-led courses in coding, AI and robotics for students, plus future-skills training for working professionals. Online, offline, camps and workshops.</p>
          <div className="hero-paths">
            <a className="hp-students" href="/students">For students
              <svg className="ic" aria-hidden="true"><use href="#i-arrow" /></svg></a>
            <a className="hp-pros" href="/professionals">For professionals
              <svg className="ic" aria-hidden="true"><use href="#i-arrow" /></svg></a>
          </div>
      
          <div className="hero-cols">
            <div className="hero-intro">
              <h3><svg className="ic" aria-hidden="true"><use href="#i-rocket" /></svg> Hands-on from day one</h3>
              <p>Every track runs on a real project and a mentor per learner, not a slide deck. Concepts come from the build.</p>
              <div className="avatars"><span>DL</span><span>AI</span><span>PY</span><span>3D</span><span>+</span></div>
              <div className="hi-count">2,000+ learners trained</div>
            </div>
      
            <figure className="hero-figure">
              <svg className="squiggle" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M14 224c-4-48 26-84 70-84 40 0 58 44 22 66-30 18-70-8-46-44 20-30 74-40 128-96" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
              <img src="/assets/photos/session-6.webp" alt="Students in a DLI Education session" />
              <span className="photo-tag pt-1">Mentor-led</span>
              <span className="photo-tag pt-2">Real projects</span>
            </figure>
      
            <div className="hero-aside">
              <div className="hero-blobs"><i></i><i></i><i></i></div>
              <p>We believe anyone can code. Every course is built around making something real, then keeping the lesson long after the class ends.</p>
              <a href="#courses" className="btn">Get started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></a>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============ AUDIENCES ============ */}
    </>
  );
}
