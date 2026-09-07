const gearIcon = (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const targetIcon = (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const awardIcon = (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
const barsIcon = (
  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const POINTS = [
  {
    icon: gearIcon,
    title: "30 sessions per school: 26 hands-on, 4 presentation",
    body: "Electronics, Arduino, sensors, coding fundamentals and AI-assisted building across 26 hands-on sessions, plus 4 dedicated presentation sessions, with every student prototyping on real kits, not slides.",
  },
  {
    icon: targetIcon,
    title: "Two-stage merit selection",
    body: "An orientation ideathon, then a school-conducted written aptitude test, selects ~30 students per school from cohorts of 300–400 applicants.",
  },
  {
    icon: awardIcon,
    title: "School expos → District Innovators Expo",
    body: "Every phase ends with students pitching working prototypes to an external jury of technologists and educators.",
  },
  {
    icon: barsIcon,
    title: "Real-time transparency portal",
    body: "De' Lead tracks session progress, attendance and school-wise detail live on the Walk2Lead portal, giving Walkaroo Foundation full visibility and board-ready reporting.",
  },
];

const iconWrap =
  "grid h-[42px] flex-[0_0_42px] place-items-center rounded-[12px] bg-cream-2 text-w2l";

export function S05_program() {
  return (
    <>
      <section id="program">
        <div className="wrap grid grid-cols-2 items-center gap-16 max-[900px]:grid-cols-1">
          <div className="reveal">
            <div className="eyebrow">The Programme</div>
            <h2 className="h2">A 3-month journey from curiosity to a working robot</h2>
            <p className="lead">
              Walk2Lead Robotics Tech Quest is a three-month, activity-based programme for Classes 6
              &amp; 7 in government schools, reaching children in rural and coastal communities who
              rarely get access to STEM education of this quality.
            </p>
            <div className="mt-7 grid gap-4">
              {POINTS.map((p) => (
                <div key={p.title} className="flex items-start gap-3.5">
                  <div className={iconWrap}>{p.icon}</div>
                  <div>
                    <b className="block text-[0.98rem]">{p.title}</b>
                    <p className="text-[0.9rem] text-ink-soft">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal relative">
            <img
              loading="lazy"
              decoding="async"
              src="/assets/kids-building.jpg"
              alt="Students building their robotics project together"
              className="rounded-[20px] shadow-card"
            />
          </div>
        </div>
        <div className="wrap">
          <div className="reveal mt-16 grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
            <div className="rounded-[20px] bg-cream-2 px-[30px] py-8">
              <h3 className="mb-2.5 text-[1.15rem]">Development in STEM Learning</h3>
              <p className="mb-[18px] text-[0.92rem] text-ink-soft">
                Electronics, Arduino, sensors, coding fundamentals and AI-assisted building, taken
                from first principles to a working prototype every student can demo.
              </p>
            </div>
            <div className="rounded-[20px] bg-cream-2 px-[30px] py-8">
              <h3 className="mb-2.5 text-[1.15rem]">Soft Skill Enrichment</h3>
              <p className="mb-[18px] text-[0.92rem] text-ink-soft">
                Built into the curriculum, not bolted on: every cohort practices these on stage, at
                the school and district expos.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["Presentation", "Leadership", "Team Building", "Problem Solving"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-solid border-line bg-white px-3.5 py-[7px] text-[0.8rem] font-semibold text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
    </>
  );
}
