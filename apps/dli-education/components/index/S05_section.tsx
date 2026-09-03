export function S05_section() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <div className="shead reveal">
            <div><span className="kicker">How it works</span><h2 className="h2" style={{ marginTop: "10px" }}>Learning in 3 simple ways</h2></div>
            <div className="deco" aria-hidden="true"><svg className="ic"><use href="#i-sparkles" /></svg></div>
            <p className="sh-note">We pair expertly built content with real projects and per-learner mentorship, so skills actually stick.</p>
          </div>
          <div className="tgrid c3">
            <article className="tcard lime reveal">
              <h3>Build something real</h3>
              <p>Each course ends with a working thing: an app, a site, a model, a robot. The theory is taught through the build.</p>
              <div className="tc-photo"><img src="/assets/photos/session-4.webp" alt="Students building projects on laptops" /></div>
            </article>
            <article className="tcard lav reveal">
              <h3>Learn with a mentor</h3>
              <p>Small groups or 1-to-1, with a mentor guiding each learner. Progress is tracked per person, not per class.</p>
              <div className="tc-photo"><img src="/assets/photos/session-2.webp" alt="A mentor-led class in session" /></div>
            </article>
            <article className="tcard rose reveal">
              <h3>Go any format</h3>
              <p>Online, offline at a centre, inside a residential camp, or as a corporate workshop. Same curriculum, your room.</p>
              <div className="tc-photo"><img src="/assets/photos/session-1.webp" alt="An in-person DLI Education session" /></div>
            </article>
          </div>
        </div>
      </section>
      
      {/* ============ WHAT THEY'LL LEARN (bento) ============ */}
    </>
  );
}
