// no dedicated MakerChamps social account yet — follow the parent brand
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
  "flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full opacity-85 transition-[opacity,border-color,color,transform] duration-200 [border:1px_solid_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:opacity-100 hover:[border-color:var(--color-mc-lime)] hover:[color:var(--color-mc-lime)]";
const colHead =
  "[font-family:var(--font-bricolage)] text-[0.8rem] uppercase tracking-[0.06em] [color:var(--color-mc-cream)]";
const colList = "mt-3 flex flex-col gap-2 text-[0.85rem]";

export function S12_footer() {
  return (
    <>
      <footer className="[padding:44px_0_26px] [background:var(--color-mc-navy-deep)] [color:rgba(247,247,247,0.7)]">
        <div className="wrap">
          <div className="flex flex-col gap-7 lg:flex-row lg:justify-between">
            <div>
              <img src="/assets/brand/dli-logo-white.png" alt="De' Lead International" className="h-[30px]" />
              <p className="mt-3 max-w-[40ch] text-[0.85rem] leading-[1.6]">
                MakerChamps is a De&apos; Lead International program, run in partnership with
                Nlightened ZenSolutions on the NIT Calicut campus.
              </p>
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
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:min-w-[460px]">
              <div>
                <h5 className={colHead}>Program</h5>
                <ul className={colList}>
                  <li>
                    <a href="#modules">7 Modules</a>
                  </li>
                  <li>
                    <a href="#backers">Why NIT Calicut</a>
                  </li>
                  <li>
                    <a href="#safety">Safety</a>
                  </li>
                  <li>
                    <a href="#gallery">Gallery</a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className={colHead}>Contact</h5>
                <ul className={colList}>
                  <li>
                    <a href="mailto:info@deleadint.com">info@deleadint.com</a>
                  </li>
                  <li>
                    <a href="tel:+918075566081">+91 807 556 6081</a>
                  </li>
                  <li>Ramanattukara, Kozhikode</li>
                </ul>
              </div>
              <div>
                <h5 className={colHead}>De&apos; Lead Ecosystem</h5>
                <ul className={colList}>
                  <li>
                    <a href="https://deleadint.com" target="_blank" rel="noopener">
                      De&apos; Lead International
                    </a>
                  </li>
                  <li>
                    <a href="https://w2l.deleadint.com" target="_blank" rel="noopener">
                      Walk2Lead
                    </a>
                  </li>
                  <li>
                    <a href="https://tc.deleadint.com" target="_blank" rel="noopener">
                      TinkerChamps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-[34px] flex flex-col gap-2.5 pt-5 text-[0.78rem] [border-top:1px_solid_rgba(247,247,247,0.1)]">
            <span>
              &copy; 2026 De&apos; Lead International. MakerChamps — Think · Make · Transform.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
