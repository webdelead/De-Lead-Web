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

const social =
  "flex h-9 w-9 flex-none items-center justify-center rounded-full border border-solid border-white/[0.18] text-white/70 transition-colors hover:border-white/50 hover:bg-white/[0.06] hover:text-white [&_svg]:h-4 [&_svg]:w-4";
const colHead = "mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/50";
const colLink = "text-[0.9rem] text-white/65 transition-colors hover:text-white";

const EXPLORE: [string, string][] = [
  ["#story", "Story"],
  ["#impact", "Impact"],
  ["#reality", "How We Deliver"],
  ["#voices", "Voices"],
  ["#gallery", "Gallery"],
  ["#partner", "Partner With Us"],
];
const ECOSYSTEM: [string, string][] = [
  ["https://deleadint.com", "De' Lead International"],
  ["https://tc.deleadint.com", "TinkerChamps"],
  ["https://mc.deleadint.com", "MakerChamps"],
  ["https://corporate.deleadint.com", "Corporate Training"],
  ["https://edu.deleadint.com", "DLI Education"],
];

export function S19_wrap() {
  return (
    <footer className="bg-[#17131a] pb-9 pt-[68px] text-white/65">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1.3fr] md:gap-10">
          <div>
            <img
              loading="lazy"
              decoding="async"
              src="/assets/walk2lead-logo-white.svg"
              alt="Walk2Lead"
              className="h-6 opacity-90"
            />
            <p className="mt-4 max-w-[38ch] text-[0.88rem] leading-relaxed text-white/60">
              Walk2Lead Robotics Tech Quest, funded by Walkaroo Foundation and implemented
              end-to-end by De&apos; Lead International, a prominent CSR implementation team, with the
              District Institutes of Education and Training (DIET) and the General Education
              Department, Government of Kerala.
            </p>
            <div className="mt-5 flex gap-2.5">
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
            <h4 className={colHead}>Explore</h4>
            <ul className="flex flex-col gap-2.5">
              {EXPLORE.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className={colLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={colHead}>De&apos; Lead</h4>
            <ul className="flex flex-col gap-2.5">
              {ECOSYSTEM.map(([href, label]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener" className={colLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={colHead}>Contact</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="tel:+918075566081" className={colLink}>
                  +91 807 556 6081
                </a>
              </li>
              <li>
                <a href="tel:+971506814538" className={colLink}>
                  +971 50 681 4538
                </a>
              </li>
              <li>
                <a href="mailto:info@deleadint.com" className={colLink}>
                  info@deleadint.com
                </a>
              </li>
            </ul>
            <address className="mt-3.5 text-[0.85rem] not-italic leading-relaxed text-white/50">
              Ramanattukara, Kozhikode, India
              <br />
              Sharjah, UAE
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-0 border-t border-solid border-white/10 pt-6 text-[0.8rem] text-white/45">
          <span>
            © <span id="yr">{new Date().getFullYear()}</span> De&apos; Lead International · Funded by
            Walkaroo Foundation
          </span>
          <span>w2l.deleadint.com</span>
        </div>
      </div>
    </footer>
  );
}
