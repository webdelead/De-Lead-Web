// no dedicated Walk2Lead social account yet — follow the parent brand
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

export function S19_wrap() {
  return (
    <>
      <footer>
        <div className="wrap">
          <img loading="lazy" decoding="async" src="/assets/walk2lead-logo-white.svg" alt="Walk2Lead" />
          <div>Walk2Lead Robotics Tech Quest · Funded by Walkaroo Foundation · Implemented by De' Lead International</div>
          <div className="footer-social">
            <a href="https://www.instagram.com/deleadint/?hl=en" target="_blank" rel="noopener" aria-label="De' Lead International on Instagram">
              {instagramIcon}
            </a>
            <a href="https://www.youtube.com/@Deleadinternational" target="_blank" rel="noopener" aria-label="De' Lead International on YouTube">
              {youtubeIcon}
            </a>
          </div>
          <div>© <span id="yr"></span> De' Lead International</div>
        </div>
      </footer>
    </>
  );
}
