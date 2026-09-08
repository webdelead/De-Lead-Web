import Link from "next/link";

export function S02_nav() {
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            <img src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
            <span>DLI Students</span>
          </Link>
          <nav className="nav-links" id="navLinks">
            <a href="#catalogue">Catalogue</a>
            <a href="#delivery">Delivery</a>
            <a href="#heroes">Outcomes</a>
            <a href="/professionals">Professionals</a>
            <a href="#contact">Contact</a>
            <Link className="nav-back" href="/">&larr; DLI Education</Link>
          </nav>
          <div className="nav-cta">
            <Link className="btn btn-magenta nav-desk" href="/">&larr; DLI Education</Link>
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
