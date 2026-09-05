const IG_URL = "https://www.instagram.com/deleadint/?hl=en";
const YT_URL = "https://www.youtube.com/@Deleadinternational";

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);
const youtubeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
  </svg>
);

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
            <div className="footer-social">
              <a href={IG_URL} target="_blank" rel="noopener" aria-label="De' Lead International on Instagram">
                {instagramIcon}
              </a>
              <a href={YT_URL} target="_blank" rel="noopener" aria-label="De' Lead International on YouTube">
                {youtubeIcon}
              </a>
            </div>
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
