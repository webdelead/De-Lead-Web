// no dedicated Walk2Lead social account yet — follow the parent brand
const socialLink =
  "flex h-8 w-8 flex-none items-center justify-center rounded-full border border-solid border-white/[0.18] text-white/75 transition-colors hover:border-white/50 hover:bg-white/[0.06] hover:text-white [&_svg]:h-4 [&_svg]:w-4";

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
    <footer className="bg-[#17131a] py-[52px] text-[0.85rem] text-white/65">
      <div className="wrap flex flex-wrap items-center justify-between gap-6">
        <img
          loading="lazy"
          decoding="async"
          src="/assets/walk2lead-logo-white.svg"
          alt="Walk2Lead"
          className="h-[22px] opacity-90"
        />
        <div>
          Walk2Lead Robotics Tech Quest · Funded by Walkaroo Foundation · Implemented by De&apos; Lead
          International
        </div>
        <div className="flex gap-2.5">
          <a
            href="https://www.instagram.com/deleadint/?hl=en"
            target="_blank"
            rel="noopener"
            aria-label="De' Lead International on Instagram"
            className={socialLink}
          >
            {instagramIcon}
          </a>
          <a
            href="https://www.youtube.com/@Deleadinternational"
            target="_blank"
            rel="noopener"
            aria-label="De' Lead International on YouTube"
            className={socialLink}
          >
            {youtubeIcon}
          </a>
        </div>
        <div>
          © <span id="yr">{new Date().getFullYear()}</span> De&apos; Lead International
        </div>
      </div>
    </footer>
  );
}
