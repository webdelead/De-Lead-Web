const xIcon = (
  <svg className="mt-0.5 h-4 w-4 flex-none text-[rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const checkIcon = (
  <svg className="mt-0.5 h-4 w-4 flex-none text-[#7fd88f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const WRONG = [
  "Intermittent power and internet across rural school labs",
  "Laptops shared 1-to-3 in several schools",
  "Wi-Fi access windows limiting simulation time",
  "Driver and hardware-compatibility issues on ageing school systems",
  "Learning pace variation needing repetition for mastery",
];
const FIXES = [
  "Mobile hotspots and extended Wi-Fi windows on standby",
  "Extension boards and systematic driver checks before every session",
  "Team laptop-sharing protocols and seat reorganisation",
  "Structured buffer sessions and micro-projects to consolidate concepts",
  "Points-based systems to sustain discipline and peer learning",
];

export function S09_reality() {
  return (
    <>
      <section id="reality" className="bg-ink text-white">
        <div className="wrap">
          <div className="eyebrow reveal text-[#f2b8b8]">How We Actually Deliver</div>
          <h2 className="h2 reveal">It wasn&apos;t smooth. Here&apos;s the log.</h2>
          <p className="lead reveal text-[rgba(255,255,255,0.72)]">
            Anyone can promise delivery. We can show you the outage log and what we did about it,
            because we tracked it, phase over phase, in the same reports we hand Walkaroo Foundation.
          </p>
          <div className="reveal mt-12 grid grid-cols-2 gap-0 overflow-hidden rounded-[20px] [border:1px_solid_rgba(255,255,255,0.14)] max-[800px]:grid-cols-1">
            <div className="bg-[rgba(200,28,28,0.1)] px-8 py-[34px] [border-right:1px_solid_rgba(255,255,255,0.14)] max-[800px]:[border-bottom:1px_solid_rgba(255,255,255,0.14)] max-[800px]:[border-right:none]">
              <h3 className="mb-[18px] flex items-center gap-2.5 text-[1.05rem]">What went wrong</h3>
              <ul className="grid list-none gap-3.5">
                {WRONG.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-[0.92rem] text-[rgba(255,255,255,0.8)]"
                  >
                    {xIcon}
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 py-[34px]">
              <h3 className="mb-[18px] flex items-center gap-2.5 text-[1.05rem]">
                What we did about it
              </h3>
              <ul className="grid list-none gap-3.5">
                {FIXES.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-[0.92rem] text-[rgba(255,255,255,0.8)]"
                  >
                    {checkIcon}
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p style={{ marginTop: "24px", color: "rgba(255,255,255,.55)", fontSize: ".85rem" }}>
            Source: internal session &amp; coordinator reports, tracked school-by-school every phase:
            the same documents we share with Walkaroo Foundation.
          </p>
        </div>
      </section>

      {/* STUDENT PROJECTS */}
    </>
  );
}
