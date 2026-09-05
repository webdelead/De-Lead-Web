// no dedicated MakerChamps social account yet — follow the parent brand
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

export function S12_footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/assets/brand/dli-logo-white.png" alt="De' Lead International" />
              <p>MakerChamps is a De' Lead International program, run in partnership with Nlightened ZenSolutions on the NIT Calicut campus.</p>
              <div className="footer-social">
                <a href="https://www.instagram.com/deleadint/?hl=en" target="_blank" rel="noopener" aria-label="De' Lead International on Instagram">
                  {instagramIcon}
                </a>
                <a href="https://www.youtube.com/@Deleadinternational" target="_blank" rel="noopener" aria-label="De' Lead International on YouTube">
                  {youtubeIcon}
                </a>
              </div>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <h5>Program</h5>
                <ul>
                  <li><a href="#modules">7 Modules</a></li>
                  <li><a href="#backers">Why NIT Calicut</a></li>
                  <li><a href="#safety">Safety</a></li>
                  <li><a href="#gallery">Gallery</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Contact</h5>
                <ul>
                  <li><a href="mailto:info@deleadint.com">info@deleadint.com</a></li>
                  <li><a href="tel:+918075566081">+91 807 556 6081</a></li>
                  <li>Ramanattukara, Kozhikode</li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>De' Lead Ecosystem</h5>
                <ul>
                  <li><a href="https://deleadint.com" target="_blank" rel="noopener">De' Lead International</a></li>
                  <li><a href="https://w2l.deleadint.com" target="_blank" rel="noopener">Walk2Lead</a></li>
                  <li><a href="https://tinkerchamps.deleadint.com" target="_blank" rel="noopener">TinkerChamps</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 De' Lead International. MakerChamps — Think · Make · Transform.</span>
          </div>
        </div>
      </footer>    </>
  );
}
