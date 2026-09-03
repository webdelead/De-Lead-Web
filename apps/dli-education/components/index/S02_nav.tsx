export function S02_nav() {
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a href="/" className="brand">
            <img src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
            <span>DLI Education</span>
          </a>
          <nav className="nav-links" id="navLinks">
            <a href="/students">Students</a>
            <a href="/professionals">Professionals</a>
            <a href="#courses">Courses</a>
            <a href="#outcomes">Outcomes</a>
            <a href="#contact">Contact</a>
            <a className="nav-back" href="https://deleadint.com" target="_blank" rel="noopener">De' Lead International &nearr;</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-magenta nav-desk" href="https://deleadint.com" target="_blank" rel="noopener">De' Lead &nearr;</a>
            <a className="btn btn-dark" href="#contact">Enquire</a>
            <button className="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      
      {/* ============ HERO ============ */}
    </>
  );
}
