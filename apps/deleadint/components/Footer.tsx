export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/logo/logo-delead-white.png" alt="De' Lead International" />
            <p>
              An education innovation ecosystem empowering students, institutions, professionals and
              organizations across India and the UAE.
            </p>
            <span className="footer-tag">Learn, Develop &amp; Lead</span>
          </div>
          <div className="footer-col">
            <h4>Verticals</h4>
            <ul>
              <li>
                <a href="#corporate">Corporate Training</a>
              </li>
              <li>
                <a href="https://tinkerchamps.deleadint.com" target="_blank" rel="noopener">
                  TinkerChamps
                </a>
              </li>
              <li>
                <a href="#makerchamps">MakerChamps</a> <span className="soon">Soon</span>
              </li>
              <li>
                <a href="#dli-education">DLI Education</a> <span className="soon">Soon</span>
              </li>
              <li>
                <a href="https://goalfinder.org/" target="_blank" rel="noopener">
                  Goal Finder
                </a>
              </li>
              <li>
                <a href="https://w2l.deleadint.com" target="_blank" rel="noopener">
                  DLI Foundation &middot; Walk2Lead
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#ecosystem">Ecosystem</a>
              </li>
              <li>
                <a href="#press">Press</a>
              </li>
              <li>
                <a href="#voices">Voices</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <address>
              2nd Floor, Maharaja Complex,
              <br />
              University Road, Ramanattukara,
              <br />
              Kozhikode, Kerala &ndash; 673633, India
            </address>
            <address>
              PO Box 121560, SPC FZC,
              <br />
              Sharjah, UAE
            </address>
            <ul>
              <li>
                <a href="tel:+971567733442">+971 56 773 3442</a>
              </li>
              <li>
                <a href="tel:+918075566081">+91 807 556 6081</a>
              </li>
              <li>
                <a href="mailto:info@deleadint.com">info@deleadint.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            &copy; <span id="year">{year}</span> De&rsquo; Lead International. All rights reserved.
          </span>
          <span>www.deleadint.com</span>
        </div>
      </div>
    </footer>
  );
}
