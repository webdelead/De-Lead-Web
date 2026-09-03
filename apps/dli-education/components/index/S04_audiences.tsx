export function S04_audiences() {
  return (
    <>
      <section className="section" id="audiences">
        <div className="wrap">
          <div className="shead simple reveal">
            <span className="kicker">Who it's for</span>
            <h2 className="h2" style={{ marginTop: "10px" }}>Two paths, one hands-on method</h2>
            <p className="sh-note">Pick the track that fits. Same build-first approach, scaled to the learner.</p>
          </div>
          <div className="apath reveal">
            <a className="apath-card students" href="/students">
              <div className="apath-photo"><img src="/assets/photos/session-4.webp" alt="Students building projects" /></div>
              <span className="apath-badge">For students</span>
              <h3>Technology courses, ages 7 to college</h3>
              <p>Python, web, robotics, 3D design, data, Gen AI and block coding. Real projects, a mentor per learner, a certificate at the end.</p>
              <ul><li>11 course tracks</li><li>Group or 1-to-1</li><li>Online, offline, camps</li></ul>
              <span className="btn btn-dark">Explore student courses
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></span>
            </a>
            <a className="apath-card pros" href="/professionals">
              <div className="apath-photo"><img src="/assets/photos/session-3.webp" alt="A professional cohort" /></div>
              <span className="apath-badge">For professionals</span>
              <h3>Future skills for educators, HR and institutions</h3>
              <p>Design thinking, leadership, communication, an entrepreneurial mindset and applied Gen AI for the way your team actually works.</p>
              <ul><li>6 skill areas</li><li>Cohort or 1-to-1</li><li>Schools, colleges, teams</li></ul>
              <span className="btn btn-dark">Explore professional tracks
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></span>
            </a>
          </div>
        </div>
      </section>
      
      {/* ============ HOW WE TEACH ============ */}
    </>
  );
}
