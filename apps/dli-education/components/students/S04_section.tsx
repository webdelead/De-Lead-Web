export function S04_section() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <div className="shead reveal">
            <div><span className="kicker">How it works</span><h2 className="h2" style={{ marginTop: "10px" }}>Built to be done, not just attended</h2></div>
            <div className="deco" aria-hidden="true"><svg className="ic"><use href="#i-sparkles" /></svg></div>
            <p className="sh-note">Every track is a build. A mentor tracks each learner, and everyone who finishes gets certified.</p>
          </div>
          <div className="tgrid c3">
            <article className="tcard lime reveal">
              <span className="tc-ico"><svg className="ic"><use href="#i-code" /></svg></span>
              <h3>A project every track</h3>
              <p>An app, a site, a model, a robot. The theory is taught through the build, not a deck.</p>
            </article>
            <article className="tcard lav reveal">
              <span className="tc-ico"><svg className="ic"><use href="#i-users" /></svg></span>
              <h3>Mentor per learner</h3>
              <p>Group sizes stay small, and 1-to-1 is available on every track.</p>
            </article>
            <article className="tcard rose reveal">
              <span className="tc-ico"><svg className="ic"><use href="#i-graduation" /></svg></span>
              <h3>Certificate on completion</h3>
              <p>Every learner who finishes a track receives a completion certificate from De' Lead International.</p>
            </article>
          </div>
        </div>
      </section>
      
      {/* ============ CATALOGUE ============ */}
    </>
  );
}
