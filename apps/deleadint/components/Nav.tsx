/**
 * `home` (default true) = nav on the single-page homepage, hash links scroll.
 * `home={false}` = nav on a standalone page (journal): hash links point back to
 * the homepage (`/#about`), brand links to `/`.
 */
export function Nav({ home = true }: { home?: boolean } = {}) {
  const h = (hash: string) => (home ? hash : `/${hash}`);
  return (
    <header className="nav">
      <div className="container">
        <a href={home ? "#top" : "/"} className="brand">
          <img className="brand-white" src="/assets/logo/logo-delead-white.png" alt="De' Lead International" />
          <img className="brand-dark" src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
        </a>
        <nav className="nav-links" id="navLinks">
          <a href={h("#about")}>About</a>
          <div className="nav-dropdown" id="ecoDropdown">
            <button className="nav-drop-trigger" aria-expanded="false" aria-controls="ecoDropPanel">
              Ecosystem
              <svg className="nav-drop-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="nav-drop-panel" id="ecoDropPanel">
              <div className="ndp-list">
                <p className="nav-drop-head">The De&apos; Lead ecosystem</p>
                <a href={h("#corporate")} className="nav-drop-item" data-v="corporate">
                  <span className="ndi-logo"><img src="/assets/logo/logo-delead-dark.png" alt="" /></span>
                  <span className="ndi-body">
                    <span className="ndi-name">Corporate Training</span>
                    <span className="ndi-desc">Leadership &amp; outbound training</span>
                  </span>
                </a>
                <a href="https://tinkerchamps.deleadint.com" target="_blank" rel="noopener" className="nav-drop-item" data-v="tinkerchamps">
                  <span className="ndi-logo"><img src="/assets/logos-verticals/tinkerchamps-logo.webp" alt="" /></span>
                  <span className="ndi-body">
                    <span className="ndi-name">
                      TinkerChamps
                      <svg className="ndi-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg>
                    </span>
                    <span className="ndi-desc">Residential experiential camps</span>
                  </span>
                </a>
                <a href={h("#makerchamps")} className="nav-drop-item" data-v="makerchamps">
                  <span className="ndi-logo"><img src="/assets/logos-verticals/makerchamps-logo.svg" alt="" /></span>
                  <span className="ndi-body">
                    <span className="ndi-name">MakerChamps</span>
                    <span className="ndi-desc">Innovation bootcamp on NIT campus</span>
                  </span>
                </a>
                <a href={h("#dli-education")} className="nav-drop-item" data-v="dli-education">
                  <span className="ndi-logo"><img src="/assets/logo/logo-delead-dark.png" alt="" /></span>
                  <span className="ndi-body">
                    <span className="ndi-name">DLI Education</span>
                    <span className="ndi-desc">Tech &amp; future-skills courses</span>
                  </span>
                </a>
                <a href="https://goalfinder.org/" target="_blank" rel="noopener" className="nav-drop-item" data-v="goalfinder">
                  <span className="ndi-logo"><img src="/assets/logos-verticals/goalfinder-logo.png" alt="" /></span>
                  <span className="ndi-body">
                    <span className="ndi-name">
                      Goal Finder
                      <svg className="ndi-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg>
                    </span>
                    <span className="ndi-desc">AI career &amp; personality assessment</span>
                  </span>
                </a>
                <a href="https://w2l.deleadint.com" target="_blank" rel="noopener" className="nav-drop-item" data-v="walk2lead">
                  <span className="ndi-logo"><img src="/assets/logos-verticals/walk2lead-logo.svg" alt="" /></span>
                  <span className="ndi-body">
                    <span className="ndi-name">
                      DLI Foundation &middot; Walk2Lead
                      <svg className="ndi-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg>
                    </span>
                    <span className="ndi-desc">CSR robotics &amp; coding for schools</span>
                  </span>
                </a>
              </div>

              <div className="ndp-preview" aria-hidden="true">
                <div className="eco-preview is-default">
                  <span className="epv-media"><img src="/assets/stock/mc-hero.webp" alt="" /></span>
                  <span className="epv-name">One ecosystem, six ways to lead</span>
                  <span className="epv-desc">
                    From K&ndash;12 camps to corporate leadership and CSR robotics &mdash; every
                    De&apos; Lead program grows people who lead.
                  </span>
                </div>
                <div className="eco-preview" data-v="corporate">
                  <span className="epv-media"><img src="/assets/stock/corp-2.webp" alt="" /></span>
                  <span className="epv-name">Corporate Training</span>
                  <span className="epv-desc">
                    Leadership, team-building and outbound programs for companies across India
                    and the UAE.
                  </span>
                  <span className="epv-link">Explore Corporate Training &rarr;</span>
                </div>
                <div className="eco-preview" data-v="tinkerchamps">
                  <span className="epv-media"><img src="/assets/stock/tc-1.webp" alt="" /></span>
                  <span className="epv-name">TinkerChamps</span>
                  <span className="epv-desc">
                    Multi-day residential camps where students build confidence, communication
                    and lifelong friendships.
                  </span>
                  <span className="epv-link">Visit TinkerChamps &rarr;</span>
                </div>
                <div className="eco-preview" data-v="makerchamps">
                  <span className="epv-media"><img src="/assets/stock/mc-1.webp" alt="" /></span>
                  <span className="epv-name">MakerChamps</span>
                  <span className="epv-desc">
                    A two-day innovation bootcamp that puts Class 8&ndash;12 students on the
                    NIT Calicut campus.
                  </span>
                  <span className="epv-link">Explore MakerChamps &rarr;</span>
                </div>
                <div className="eco-preview" data-v="dli-education">
                  <span className="epv-media"><img src="/assets/stock/dli-1.webp" alt="" /></span>
                  <span className="epv-name">DLI Education</span>
                  <span className="epv-desc">
                    Hands-on courses in robotics, AI, coding and future skills &mdash; online
                    or in person.
                  </span>
                  <span className="epv-link">Explore DLI Education &rarr;</span>
                </div>
                <div className="eco-preview" data-v="goalfinder">
                  <span className="epv-media epv-media--logo"><img src="/assets/logos-verticals/goalfinder-logo.png" alt="" /></span>
                  <span className="epv-name">Goal Finder</span>
                  <span className="epv-desc">
                    An AI career and personality assessment that maps students to the path
                    that fits them.
                  </span>
                  <span className="epv-link">Visit Goal Finder &rarr;</span>
                </div>
                <div className="eco-preview" data-v="walk2lead">
                  <span className="epv-media"><img src="/assets/stock/w2l-1.webp" alt="" /></span>
                  <span className="epv-name">DLI Foundation &middot; Walk2Lead</span>
                  <span className="epv-desc">
                    CSR robotics and coding brought to government and tribal schools, funded
                    by Walkaroo Foundation.
                  </span>
                  <span className="epv-link">Visit Walk2Lead &rarr;</span>
                </div>
              </div>
            </div>
          </div>
          <a href={h("#press")}>Press</a>
          <a href={h("#voices")}>Voices</a>
          <a href={h("#gallery")}>Gallery</a>
          <a href={h("#contact")}>Contact</a>
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary" href={h("#contact")}>
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
