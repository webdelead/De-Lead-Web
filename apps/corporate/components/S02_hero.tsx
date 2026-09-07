const CHECK_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E\") center/12px no-repeat";

const HERO_AFTER =
  "linear-gradient(115deg,rgba(74,3,48,0.94)_0%,rgba(58,4,40,0.82)_38%,rgba(28,20,23,0.72)_72%,rgba(28,20,23,0.6)_100%),linear-gradient(0deg,rgba(20,8,14,0.92)_0%,rgba(20,8,14,0.28)_42%,transparent_62%)";

const chip =
  "flex items-center gap-[9px] rounded-full [padding:9px_18px_9px_14px] text-[0.84rem] font-semibold text-white [background:rgba(255,255,255,0.1)] [border:1px_solid_rgba(255,255,255,0.18)] [backdrop-filter:blur(6px)] before:content-[''] before:h-4 before:w-4 before:flex-none before:rounded-full before:bg-white before:[-webkit-mask:var(--chk)] before:[mask:var(--chk)]";

export function S02_hero() {
  return (
    <>
      <section
        className="relative flex min-h-[94vh] items-end overflow-hidden [background:var(--color-magenta-deep)] max-[520px]:min-h-0"
        style={{ ["--chk" as string]: CHECK_MASK }}
      >
        <img
          className="absolute inset-0 h-full w-full object-cover [object-position:65%_50%] [filter:grayscale(0.7)_brightness(0.62)_contrast(1.08)]"
          src="/assets/photos/facilitator-mic.webp"
          alt="A De' Lead facilitator leading a corporate training session"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: HERO_AFTER.replace(/_/g, " ") }}
          aria-hidden="true"
        />
        <div className="relative z-[2] mx-auto w-full max-w-[var(--maxw)] [padding:150px_var(--pad)_128px] max-[820px]:!pt-32 max-[820px]:!pb-24">
          <span className="eyebrow on-dark mb-[26px]">
            <i className="mk"></i>Corporate Training &middot; India &amp; UAE
          </span>
          <h1 className="max-w-[15ch] text-white [font-size:clamp(2.7rem,6.6vw,5.4rem)] tracking-[-0.035em] max-[520px]:[font-size:clamp(2.1rem,10vw,2.9rem)]">
            Leadership that outlasts the offsite.
          </h1>
          <div className="mt-[38px] flex flex-wrap gap-3.5">
            <a href="#contact" className="btn btn-cream btn-dot">
              Book a session
            </a>
            <a href="#programmes" className="btn btn-ghost on-dark">
              See the programmes
            </a>
          </div>
          <ul className="mt-[34px] flex flex-wrap gap-2.5">
            <li className={chip}>Leadership development</li>
            <li className={chip}>Team building</li>
            <li className={chip}>Outbound training</li>
          </ul>
        </div>
      </section>

      {/* ============ FACT MARQUEE ============ */}
    </>
  );
}
