// no dedicated DLI Education social account yet — follow the parent brand
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

export function S13_footergrid() {
  return (
    <>
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <b>DLI Education</b>
            <p>The technology and future-skills learning arm of De' Lead International. Hands-on programmes for students and professionals across India and the UAE.</p>
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
            <h4>DLI Education</h4>
            <ul>
              <li><a href="/students">Students</a></li>
              <li><a href="/professionals">Professionals</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#outcomes">Outcomes</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>De' Lead</h4>
            <ul>
              <li><a href="https://deleadint.com" target="_blank" rel="noopener">De' Lead International</a></li>
              <li><a href="https://tinkerchamps.deleadint.com" target="_blank" rel="noopener">TinkerChamps</a></li>
              <li><a href="https://goalfinder.org/" target="_blank" rel="noopener">Goal Finder</a></li>
              <li><a href="https://w2l.deleadint.com" target="_blank" rel="noopener">Walk2Lead</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <address>2nd Floor, Maharaja Complex,<br />Ramanattukara, Kozhikode, Kerala, India</address>
            <address>PO Box 121560, SPC FZC,<br />Sharjah, UAE</address>
            <ul>
              <li><a href="tel:+918075566081">+91 807 556 6081</a></li>
              <li><a href="tel:+971506814538">+971 50 681 4538</a></li>
              <li><a href="mailto:info@deleadint.com">info@deleadint.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; <span id="year"></span> De' Lead International.</span>
          <span>www.deleadint.com</span>
        </div>
      </footer>    </>
  );
}
