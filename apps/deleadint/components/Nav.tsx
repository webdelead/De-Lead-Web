export function Nav() {
  return (
    <header className="nav">
      <div className="container">
        <a href="#top" className="brand">
          <img className="brand-white" src="/assets/logo/logo-delead-white.png" alt="De' Lead International" />
          <img className="brand-dark" src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
        </a>
        <nav className="nav-links" id="navLinks">
          <a href="#about">About</a>
          <div className="nav-dropdown" id="ecoDropdown">
            <button className="nav-drop-trigger" aria-expanded="false" aria-controls="ecoDropPanel">
              Ecosystem
              <svg className="nav-drop-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="nav-drop-panel" id="ecoDropPanel">
              <a href="#corporate" className="nav-drop-item">
                <span className="ndi-logo"><img src="/assets/logo/logo-delead-dark.png" alt="" /></span>
                <span>Corporate Training</span>
              </a>
              <a href="https://tinkerchamps.deleadint.com" target="_blank" rel="noopener" className="nav-drop-item">
                <span className="ndi-logo"><img src="/assets/logos-verticals/tinkerchamps-logo.webp" alt="" /></span>
                <span>TinkerChamps</span>
              </a>
              <a href="#makerchamps" className="nav-drop-item">
                <span className="ndi-logo"><img src="/assets/logos-verticals/makerchamps-logo.svg" alt="" /></span>
                <span>MakerChamps</span>
              </a>
              <a href="#dli-education" className="nav-drop-item">
                <span className="ndi-logo"><img src="/assets/logo/logo-delead-dark.png" alt="" /></span>
                <span>DLI Education</span>
              </a>
              <a href="https://goalfinder.org/" target="_blank" rel="noopener" className="nav-drop-item">
                <span className="ndi-logo"><img src="/assets/logos-verticals/goalfinder-logo.png" alt="" /></span>
                <span>Goal Finder</span>
              </a>
              <a href="https://w2l.deleadint.com" target="_blank" rel="noopener" className="nav-drop-item">
                <span className="ndi-logo"><img src="/assets/logos-verticals/walk2lead-logo.svg" alt="" /></span>
                <span>DLI Foundation &middot; Walk2Lead</span>
              </a>
            </div>
          </div>
          <a href="#press">Press</a>
          <a href="#voices">Voices</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary" href="#contact">
            Partner With Us
            <span className="btn-ring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </a>
          <button className="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
