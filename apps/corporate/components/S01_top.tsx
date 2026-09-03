export function S01_top() {
  return (
    <>
      <header className="nav" id="top">
        <div className="nav-pill">
          <a href="#top" className="brand">
            <img className="brand-white" src="/assets/logo/logo-delead-white.png" alt="De' Lead International" />
            <img className="brand-dark" src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
            <span className="brand-sub">Corporate Training</span>
          </a>
          <nav className="nav-links" id="navLinks">
            <a href="#about">About</a>
            <a href="#programmes">Programmes</a>
            <a href="#approach">Approach</a>
            <a href="#track-record">Track record</a>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
            <a className="nav-home nav-home-inline" href="https://deleadint.com" target="_blank" rel="noopener">De'&nbsp;Lead&nbsp;International&nbsp;&nearr;</a>
          </nav>
          <div className="nav-cta">
            <a className="nav-home nav-home-desk" href="https://deleadint.com" target="_blank" rel="noopener">De'&nbsp;Lead&nbsp;&nearr;</a>
            <a className="btn btn-primary btn-dot" href="#contact">Book a session</a>
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
