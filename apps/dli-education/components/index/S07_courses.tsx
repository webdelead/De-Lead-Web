export function S07_courses() {
  return (
    <>
      <section className="section" id="courses">
        <div className="wrap">
          <div className="shead reveal">
            <div><h2 className="h2">Featured tracks</h2></div>
            <div className="deco" aria-hidden="true"><svg className="ic"><use href="#i-arrow" /></svg></div>
            <p className="sh-note">A snapshot of the student catalogue. Full modules and outcomes live on the Students page.</p>
          </div>
          <div className="filters reveal">
            <span className="filter active">All</span>
            <span className="filter">AI &amp; Data</span>
            <span className="filter">Coding &amp; Web</span>
            <span className="filter">Design</span>
            <span className="filter">Robotics &amp; Kids</span>
          </div>
          <div className="cgrid reveal">
            <article className="ccard">
              <div className="cc-top lime"><svg className="ic"><use href="#i-code" /></svg></div>
              <div className="cc-rate">Level: <b>Beginner</b></div>
              <h4>Python Programming</h4>
              <p className="cc-desc">Core fundamentals, problem solving, data structures, file and exception handling.</p>
              <p className="cc-meta">Ages 12+ &bull; Group or 1-to-1</p>
              <div className="cc-foot"><span className="cc-price">32 hrs</span><a href="students/index.html#catalogue" className="btn btn-outline btn-sm">See details</a></div>
            </article>
            <article className="ccard">
              <div className="cc-top peach"><svg className="ic"><use href="#i-chart" /></svg></div>
              <div className="cc-rate">Level: <b>Intermediate</b></div>
              <h4>Python for Data Analytics</h4>
              <p className="cc-desc">Statistics, data management, exploratory analysis, visualisation and capstone projects.</p>
              <p className="cc-meta">Ages 14+ &bull; 4 to 5 months</p>
              <div className="cc-foot"><span className="cc-price">48 to 60 hrs</span><a href="students/index.html#catalogue" className="btn btn-outline btn-sm">See details</a></div>
            </article>
            <article className="ccard">
              <div className="cc-top rose"><svg className="ic"><use href="#i-globe" /></svg></div>
              <div className="cc-rate">Level: <b>Beginner</b></div>
              <h4>Web Development</h4>
              <p className="cc-desc">HTML, CSS and Bootstrap, JavaScript and jQuery, frameworks and deployment.</p>
              <p className="cc-meta">Ages 12+ &bull; Group or 1-to-1</p>
              <div className="cc-foot"><span className="cc-price">32 to 48 hrs</span><a href="students/index.html#catalogue" className="btn btn-outline btn-sm">See details</a></div>
            </article>
            <article className="ccard">
              <div className="cc-top teal"><svg className="ic"><use href="#i-bot" /></svg></div>
              <div className="cc-rate">Level: <b>Beginner</b></div>
              <h4>Robotics</h4>
              <p className="cc-desc">Electronics and sensors, mechanical design and robot programming, geared to STEM pathways.</p>
              <p className="cc-meta">Ages 10+ &bull; 3 to 4 months</p>
              <div className="cc-foot"><span className="cc-price">32 hrs</span><a href="students/index.html#catalogue" className="btn btn-outline btn-sm">See details</a></div>
            </article>
            <article className="ccard">
              <div className="cc-top lav"><svg className="ic"><use href="#i-box" /></svg></div>
              <div className="cc-rate">Level: <b>Beginner</b></div>
              <h4>3D Design &amp; Modeling</h4>
              <p className="cc-desc">Modelling fundamentals, sculpting, texturing and rendering for product and architecture.</p>
              <p className="cc-meta">Ages 12+ &bull; 3 to 4 months</p>
              <div className="cc-foot"><span className="cc-price">32 hrs</span><a href="students/index.html#catalogue" className="btn btn-outline btn-sm">See details</a></div>
            </article>
            <article className="ccard">
              <div className="cc-top lime"><svg className="ic"><use href="#i-sparkles" /></svg></div>
              <div className="cc-rate">Level: <b>All levels</b></div>
              <h4>Gen AI for Smart Learning</h4>
              <p className="cc-desc">AI study techniques, prompt engineering, memory and revision tools, ethical use.</p>
              <p className="cc-meta">Ages 13+ &bull; Group or 1-to-1</p>
              <div className="cc-foot"><span className="cc-price">2 months</span><a href="students/index.html#catalogue" className="btn btn-outline btn-sm">See details</a></div>
            </article>
          </div>
          <p style={{ marginTop: "26px" }} className="reveal"><a className="tlink" href="/students">See all 11 student courses
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></a></p>
        </div>
      </section>
      
      {/* ============ OUTCOMES ============ */}
    </>
  );
}
