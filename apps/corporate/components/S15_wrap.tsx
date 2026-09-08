// no dedicated Corporate Training social account yet — follow the parent brand
const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);
const youtubeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
  </svg>
);

const social =
  "flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full transition-[color,border-color,background,transform] duration-200 [border:1px_solid_rgba(255,255,255,0.18)] [color:#d9c6d0] hover:text-white hover:-translate-y-0.5 hover:[border-color:rgba(255,255,255,0.5)] hover:[background:rgba(255,255,255,0.06)]";
const colHead =
  "mb-3.5 text-[0.74rem] uppercase tracking-[0.08em] [font-family:var(--font-inter)] [color:#a9738f]";
const colLink = "text-[0.9rem] [color:#d9c6d0] hover:text-white";

export function S15_wrap() {
  return (
    <>
      <footer className="[background:#150a10] [color:#e9dbe2] [padding:76px_0_28px]">
        <div className="wrap">
          <div className="mb-12 grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-11 max-[1000px]:grid-cols-2 max-[1000px]:gap-x-[26px] max-[1000px]:gap-y-[34px] max-[520px]:grid-cols-1 max-[520px]:gap-7">
            <div>
              <img
                src="/assets/logo/logo-delead-white.png"
                alt="De' Lead International"
                className="mb-3.5 h-[34px]"
              />
              <p className="mb-3.5 max-w-[34ch] text-[0.9rem] [color:#b79aa8]">
                The corporate training practice of De&rsquo; Lead International. Leadership, team
                building and outbound programmes across India and the UAE.
              </p>
              <span className="text-[0.74rem] uppercase tracking-[0.08em] [color:#a9738f]">
                Learn, Develop &amp; Lead
              </span>
              <div className="mt-[18px] flex gap-2.5">
                <a
                  href="https://www.instagram.com/deleadint/?hl=en"
                  target="_blank"
                  rel="noopener"
                  aria-label="De' Lead International on Instagram"
                  className={social}
                >
                  {instagramIcon}
                </a>
                <a
                  href="https://www.youtube.com/@Deleadinternational"
                  target="_blank"
                  rel="noopener"
                  aria-label="De' Lead International on YouTube"
                  className={social}
                >
                  {youtubeIcon}
                </a>
              </div>
            </div>
            <div>
              <h4 className={colHead}>Page</h4>
              <ul>
                {[
                  ["#about", "About"],
                  ["#programmes", "Programmes"],
                  ["#approach", "Approach"],
                  ["#track-record", "Track record"],
                  ["#contact", "Contact"],
                ].map(([href, label]) => (
                  <li className="mb-2.5" key={href}>
                    <a href={href} className={colLink}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={colHead}>De&apos; Lead</h4>
              <ul>
                {[
                  ["https://deleadint.com", "De' Lead International"],
                  ["https://tc.deleadint.com", "TinkerChamps"],
                  ["https://w2l.deleadint.com", "Walk2Lead"],
                ].map(([href, label]) => (
                  <li className="mb-2.5" key={href}>
                    <a href={href} target="_blank" rel="noopener" className={colLink}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={colHead}>Contact</h4>
              <ul>
                <li className="mb-2.5">
                  <a href="tel:+918075566081" className={colLink}>
                    +91 807 556 6081
                  </a>
                </li>
                <li className="mb-2.5">
                  <a href="tel:+971506814538" className={colLink}>
                    +971 50 681 4538
                  </a>
                </li>
                <li className="mb-2.5">
                  <a href="mailto:info@deleadint.com" className={colLink}>
                    info@deleadint.com
                  </a>
                </li>
              </ul>
              <address className="mt-3 text-[0.84rem] not-italic leading-[1.6] [color:#a98fa0]">
                Ramanattukara, Kozhikode, India
                <br />
                Sharjah, UAE
              </address>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-3 pt-[22px] text-[0.8rem] [border-top:1px_solid_rgba(255,255,255,0.1)] [color:#9a7d8a]">
            <span>
              &copy; <span id="year">{new Date().getFullYear()}</span> De&rsquo; Lead International.
            </span>
            <span>www.deleadint.com</span>
          </div>
        </div>
      </footer>
    </>
  );
}
