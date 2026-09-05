// no dedicated Corporate Training social account yet — follow the parent brand
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

export function S15_wrap() {
  return (
    <>
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/assets/logo/logo-delead-white.png" alt="De' Lead International" />
              <p>The corporate training practice of De&rsquo; Lead International. Leadership, team building and outbound programmes across India and the UAE.</p>
              <span className="footer-tag">Learn, Develop &amp; Lead</span>
              <div className="footer-social">
                <a href="https://www.instagram.com/deleadint/?hl=en" target="_blank" rel="noopener" aria-label="De' Lead International on Instagram">
                  {instagramIcon}
                </a>
                <a href="https://www.youtube.com/@Deleadinternational" target="_blank" rel="noopener" aria-label="De' Lead International on YouTube">
                  {youtubeIcon}
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Page</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#programmes">Programmes</a></li>
                <li><a href="#approach">Approach</a></li>
                <li><a href="#track-record">Track record</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>De' Lead</h4>
              <ul>
                <li><a href="https://deleadint.com" target="_blank" rel="noopener">De' Lead International</a></li>
                <li><a href="https://tinkerchamps.deleadint.com" target="_blank" rel="noopener">TinkerChamps</a></li>
                <li><a href="https://w2l.deleadint.com" target="_blank" rel="noopener">Walk2Lead</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><a href="tel:+918075566081">+91 807 556 6081</a></li>
                <li><a href="tel:+971506814538">+971 50 681 4538</a></li>
                <li><a href="mailto:info@deleadint.com">info@deleadint.com</a></li>
              </ul>
              <address>Ramanattukara, Kozhikode, India<br />Sharjah, UAE</address>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; <span id="year"></span> De&rsquo; Lead International.</span>
            <span>www.deleadint.com</span>
          </div>
        </div>
      </footer>    </>
  );
}
