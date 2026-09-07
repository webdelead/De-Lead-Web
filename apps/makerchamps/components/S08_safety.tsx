const shieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
  </svg>
);
const houseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </svg>
);
const chatIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const forkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2v20M6 2a4 4 0 000 8M18 2v20M18 8a4 4 0 000-6" />
  </svg>
);

const CARDS = [
  {
    icon: shieldIcon,
    h: "Supervised, always",
    p: "Mentors and faculty monitor every session. Your child never goes unsupervised on campus.",
  },
  {
    icon: houseIcon,
    h: "Safe overnight stay",
    p: "Supervised on-campus accommodation, with separate arrangements for boys and girls, and mentors close by through the night.",
  },
  {
    icon: chatIcon,
    h: "Staying in touch, the right way",
    p: "Every group has its own assigned mentor who shares updates at set times, so the days stay focused and phone-free. One message away if you ever need to reach your child.",
  },
  {
    icon: forkIcon,
    h: "Meals and rest, built in",
    p: "Veg and non-veg options for every meal, with dedicated prayer, freshen-up and rest time each day.",
  },
];

const card =
  "stagger-item relative rounded-[var(--radius-md)] bg-white p-5 shadow-[var(--shadow-card)] transition-transform duration-200 odd:[--tilt:1deg] even:[--tilt:-1deg]";

export function S08_safety() {
  return (
    <>
      <section className="section [background:var(--color-mc-cream-warm)]" id="safety">
        <div className="pattern-bg on-light"></div>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Your peace of mind</span>
            <h2>
              Your child is <span className="mc-accent">safe with us</span>
            </h2>
            <p className="lede">
              We know what it means to send your child away overnight. So we&apos;ve thought through
              every detail.
            </p>
          </div>
          <div className="reveal-stagger grid grid-cols-1 gap-4 md:grid-cols-2">
            {CARDS.map((c) => (
              <div key={c.h} className={card}>
                <span className="torn-triangle !-top-2 !left-5 !h-[26px] !w-[26px] !rotate-[-20deg] [background:var(--color-mc-lime)]"></span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl [background:var(--color-mc-navy)] [color:var(--color-mc-lime)] [&_svg]:h-[22px] [&_svg]:w-[22px]">
                  {c.icon}
                </div>
                <h3 className="mt-3.5 text-[1.3rem] [color:var(--color-mc-navy)]">{c.h}</h3>
                <p className="mt-2 text-[0.88rem] leading-[1.5] opacity-75">{c.p}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-[22px] flex flex-wrap gap-2.5">
            {["Laptops welcome", "Max 60 students", "Completion certificate", "Class 8 to 12"].map(
              (t, i) => (
                <span
                  key={t}
                  className={`inline-block rounded-full [padding:8px_14px] text-[0.78rem] font-semibold [background:var(--color-mc-navy)] [color:var(--color-mc-cream)] ${
                    i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"
                  }`}
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
