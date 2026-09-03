export function S11_footergrid() {
  return (
    <>
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <b>DLI Students</b>
            <p>The technology education catalogue of DLI Education, part of De' Lead International.</p>
            <span className="footer-tag">#anyonecancode</span>
          </div>
          <div className="footer-col">
            <h4>DLI Education</h4>
            <ul>
              <li><a href="/">Overview</a></li>
              <li><a href="#catalogue">Catalogue</a></li>
              <li><a href="#heroes">Outcomes</a></li>
              <li><a href="/professionals">Professionals</a></li>
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
