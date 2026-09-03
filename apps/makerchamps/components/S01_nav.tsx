export function S01_nav() {
  return (
    <>
      <nav className="nav">
        <div className="container">
          <a href="#top" className="nav-logo">
            <img src="/assets/brand/makerchamps-logo-on-dark.webp" alt="MakerChamps" />
          </a>
          <div className="nav-links">
            <a href="#modules">Modules</a>
            <a href="#backers">Why NIT</a>
            <a href="#safety">Safety</a>
            <a href="#gallery">Gallery</a>
            <a href="#testimonials">Stories</a>
          </div>
          <a href="#enquire" className="btn btn-primary nav-cta">Enquire Now</a>
          <button className="nav-toggle" id="navToggle" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
        <div className="nav-mobile-panel" id="navMobilePanel">
          <a href="#modules">Modules</a>
          <a href="#backers">Why NIT</a>
          <a href="#safety">Safety</a>
          <a href="#gallery">Gallery</a>
          <a href="#testimonials">Stories</a>
          <a href="#enquire" className="btn btn-primary">Enquire Now</a>
        </div>
      </nav>
    </>
  );
}
