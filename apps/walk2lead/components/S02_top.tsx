// `.hero` class kept — the nav (S01) reads `.hero` offsetHeight to decide when
// to go fixed. `.b-photo-group` / `.hero-slides` / `.hero-slide` kept — main.js
// runs the crossfade slideshow. Both migrate in the Phase B behaviour swap.

const heroPrimary =
  "btn btn-primary !bg-white !text-w2l hover:!bg-cream hover:!text-w2l-deep";
const heroGhost =
  "btn btn-ghost !bg-white/[0.12] !text-white [backdrop-filter:blur(12px)] [-webkit-backdrop-filter:blur(12px)] ![border-color:rgba(255,255,255,0.4)] hover:!bg-white/20 hover:![border-color:#fff] hover:!text-white";
const tabletGrid =
  "min-[561px]:max-[900px]:grid min-[561px]:max-[900px]:grid-cols-[auto_1fr_auto] min-[561px]:max-[900px]:[grid-template-areas:'logo_text_btn'] min-[561px]:max-[900px]:items-center min-[561px]:max-[900px]:gap-[22px]";

export function S02_top() {
  return (
    <>
      <header
        id="top"
        className="hero relative overflow-hidden bg-w2l pt-32 before:pointer-events-none before:absolute before:inset-0 before:bg-[url('/assets/pattern.svg')] before:bg-[length:900px] before:opacity-45 before:[filter:invert(1)_brightness(1.7)] before:content-[''] max-[900px]:pt-28 max-[560px]:pt-32"
      >
        <div className="wrap relative z-[1] grid grid-cols-6 gap-3.5 max-[900px]:grid-cols-1 max-[560px]:flex max-[560px]:flex-col max-[560px]:gap-4">
          <div className="reveal relative flex flex-col justify-center overflow-visible rounded-[20px] [grid-column:1/5] [grid-row:1] max-[900px]:pt-1.5 max-[900px]:[grid-column:1] max-[900px]:[grid-row:1]">
            <svg className="pointer-events-none absolute right-[14%] top-[-38px] z-0 w-16 rotate-[-8deg] opacity-55 [&_path]:!stroke-white [&_path]:opacity-80" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <path d="M30 4 C33 20 40 27 56 30 C40 33 33 40 30 56 C27 40 20 33 4 30 C20 27 27 20 30 4 Z" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <svg className="pointer-events-none absolute bottom-[22px] left-[-6px] z-0 w-[46px] rotate-[14deg] opacity-55 [&_path]:!stroke-white [&_path]:opacity-60" viewBox="0 0 60 24" fill="none" aria-hidden="true">
              <path d="M2 12 C10 3 16 3 22 12 C28 21 34 21 40 12 C46 3 52 3 58 12" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="reveal mb-4 inline-flex items-center gap-2.5 text-[0.78rem] font-semibold tracking-[0.03em] text-white max-[560px]:text-[0.74rem]">
              <span className="h-2 w-2 flex-none rounded-full bg-white [animation:pulse_1.8s_infinite]" />{" "}
              Phase 4 running now in Kozhikode, Malappuram &amp; Wayanad
            </div>
            <h1 className="mb-[18px] text-[clamp(2.1rem,3.9vw,3.3rem)] text-white max-[560px]:text-[clamp(1.9rem,8vw,2.4rem)]">
              44 government schools.{" "}
              <span className="relative inline-block">
                <mark className="relative whitespace-nowrap !bg-transparent !text-cream">1,300+</mark>
                <svg className="pointer-events-none absolute left-[-14%] top-[-32%] z-[-1] h-[190%] w-[128%] [&_path]:!stroke-white" viewBox="0 0 200 90" fill="none" aria-hidden="true">
                  <path d="M14,42 C10,14 58,2 101,4 C152,6 197,17 191,47 C186,76 129,87 89,84 C38,81 19,73 14,42 Z" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              children. Robots that actually worked.
            </h1>
            <p className="lead mb-7 text-white/[0.82]">
              Walk2Lead Robotics Tech Quest brings hands-on robotics, coding and AI into rural
              government schools across Kerala, funded by Walkaroo Foundation and implemented
              end-to-end by <strong>De&apos; Lead International</strong>, a prominent CSR
              implementation team. In association with the District Institutes of Education and
              Training (DIET) and the General Education Department, Government of Kerala. Four phases.
              Scaling every time.
            </p>
            <div className="mb-2 flex flex-wrap items-start gap-3.5 max-[560px]:flex-nowrap max-[560px]:[&>.btn]:flex-1 max-[560px]:[&>.btn]:justify-center max-[560px]:[&>.btn]:gap-1.5 max-[560px]:[&>.btn]:whitespace-normal max-[560px]:[&>.btn]:px-2.5 max-[560px]:[&>.btn]:py-3 max-[560px]:[&>.btn]:text-center max-[560px]:[&>.btn]:text-[0.78rem]">
              <a className={heroPrimary} href="#partner">
                Start a CSR project →
              </a>
              <a className={heroGhost} href="#reality">
                See how we deliver
              </a>
            </div>
          </div>

          <div className="b-photo-group reveal relative aspect-[2.4/1] overflow-hidden rounded-[20px] shadow-card [grid-column:1/7] [grid-row:2] max-[900px]:aspect-video max-[900px]:[grid-column:1] max-[900px]:[grid-row:2] max-[560px]:aspect-[16/10] max-[560px]:rounded-[18px]">
            <div className="hero-slides relative h-full w-full">
              {/* ADD MORE GROUP PHOTOS HERE — duplicate a <div className="hero-slide"> block */}
              <div className="hero-slide absolute inset-0">
                <img src="/assets/big-group.jpg" alt="Walk2Lead cohort group photo" className="pointer-events-none h-full w-full select-none object-cover" />
              </div>
              <div className="hero-slide absolute inset-0">
                <img src="/assets/group-hall-wyd.jpg" alt="Walk2Lead Wayanad cohort group photo" style={{ objectPosition: "center bottom" }} className="pointer-events-none h-full w-full select-none object-cover" />
              </div>
            </div>
          </div>

          <div
            className={`reveal relative flex flex-col gap-1.5 self-end overflow-hidden rounded-[20px] bg-white p-[26px] text-ink shadow-card [grid-column:5/7] [grid-row:1] max-[900px]:self-auto max-[900px]:bg-cream-2 max-[900px]:p-[22px] max-[900px]:shadow-none max-[900px]:[grid-column:1] max-[900px]:[grid-row:3] max-[560px]:rounded-[18px] ${tabletGrid}`}
          >
            <img
              loading="lazy"
              decoding="async"
              src="/assets/logo-delead-dark.png"
              alt="De' Lead International"
              style={{ width: "auto", objectFit: "contain" }}
              className="mb-2 h-10 min-[561px]:max-[900px]:mb-0 min-[561px]:max-[900px]:h-auto min-[561px]:max-[900px]:max-h-12 min-[561px]:max-[900px]:self-center min-[561px]:max-[900px]:justify-self-start min-[561px]:max-[900px]:[grid-area:logo]"
            />
            <div className="min-[561px]:max-[900px]:text-center min-[561px]:max-[900px]:[grid-area:text]">
              <div className="text-[0.94rem] font-semibold">Implemented by De&apos; Lead International</div>
              <p className="mb-1.5 text-[0.83rem] text-ink-soft min-[561px]:max-[900px]:mb-0">
                India &amp; UAE · &quot;Learn, Develop &amp; Lead&quot;
              </p>
            </div>
            <a
              className="btn btn-ghost !mt-1 !w-full !justify-center !bg-transparent !text-ink ![border-color:var(--color-line)] hover:!text-w2l hover:![border-color:var(--color-w2l)] min-[561px]:max-[900px]:!mt-0 min-[561px]:max-[900px]:!w-auto min-[561px]:max-[900px]:whitespace-nowrap min-[561px]:max-[900px]:[grid-area:btn]"
              href="#delead"
            >
              Why us →
            </a>
          </div>
        </div>
        <svg
          className="relative z-[1] mt-14 block h-16 w-full max-[560px]:mt-9 max-[560px]:h-10"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,32 C240,80 480,0 720,28 C960,56 1200,88 1440,40 L1440,90 L0,90 Z" fill="var(--ink)" />
        </svg>
      </header>
    </>
  );
}
