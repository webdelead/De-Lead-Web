const globeIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const layersIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const crosshairIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);
const usersIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FACTS = [
  {
    icon: globeIcon,
    title: <>India &amp; UAE</>,
    body: "Multi-domain training and education solutions company, operating experiential learning programmes across both geographies.",
  },
  {
    icon: layersIcon,
    title: "Beyond robotics",
    body: "Also runs TinkerChamps and MakerChamps Innovation Camps, teacher-development programmes, and a consulting wing building custom AI-integrated learning platforms.",
  },
  {
    icon: crosshairIcon,
    title: "Full-stack execution",
    body: "Curriculum design, trainer recruitment, kit procurement, government liaison, monitoring portal, expos: one accountable team, not a chain of vendors.",
  },
  {
    icon: usersIcon,
    title: "Funded again, every phase",
    body: "Four consecutive phases, funded by Walkaroo Foundation and run entirely by our own team.",
  },
];

const PEOPLE = [
  {
    photo: "/assets/people/sabarinath-k.png",
    name: "Sabarinath K",
    role: "CMO, De' Lead International",
    quote:
      '"Walk 2 Lead – Robotics Tech Quest is a powerful futuristic platform that opens a world of technology, design thinking, and innovation for children under the age of 13. The remarkable teamwork between Walkaroo, DIET, the participating schools, and De\' Lead International is what makes this mission meaningful and impactful."',
  },
  {
    photo: "/assets/people/arjun-cp.png",
    name: "Arjun C P",
    role: "CTO, De' Lead International",
    quote:
      '"I have seen firsthand how Walk2Lead is reshaping young minds. The transformation across government schools in different districts has been truly remarkable. It has uplifted students, empowered staff, and positively influenced entire communities."',
  },
];

export function S13_delead() {
  return (
    <>
      <section
        id="delead"
        className="relative overflow-hidden bg-ink text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[url('/assets/pattern.svg')] before:bg-[length:820px] before:opacity-[0.28] before:[filter:invert(1)] before:content-['']"
      >
        <div className="wrap relative">
          <div className="eyebrow reveal text-[#f2b8b8]">About De&apos; Lead International</div>
          <h2 className="h2 reveal">Meet the team behind Walk2Lead.</h2>
          <div className="mt-12 grid grid-cols-2 items-start gap-14 max-[900px]:grid-cols-1">
            <div className="reveal flex flex-col">
              <p className="lead mb-8 text-white/72">
                De&apos; Lead International is a prominent, experienced CSR implementation team:
                designing the curriculum, training the trainers, selecting the students, monitoring
                every session, and standing on stage at every expo, with Walkaroo Foundation funding
                Walk2Lead and DIET endorsing it. This page exists because we want the next CSR
                partner to know exactly who would be implementing their programme.
              </p>
              <div className="grid gap-[18px]">
                {FACTS.map((f, i) => (
                  <div key={i} className="flex gap-3.5">
                    <div className="grid h-10 flex-[0_0_40px] place-items-center rounded-[10px] bg-white/[0.08] text-w2l-bright">
                      {f.icon}
                    </div>
                    <div>
                      <b className="block text-[0.96rem]">{f.title}</b>
                      <p className="text-[0.87rem] text-white/65">{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal grid gap-5">
              {PEOPLE.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center overflow-hidden rounded-[18px] bg-cream max-[640px]:flex-col max-[640px]:items-stretch"
                >
                  <div className="aspect-square flex-[0_0_170px] bg-cream-2 max-[640px]:aspect-[16/10] max-[640px]:flex-[0_0_auto]">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={p.photo}
                      alt={p.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-[1_1_auto] px-6 py-[22px]">
                    <p className="mb-3.5 text-[0.9rem] italic text-ink-soft">{p.quote}</p>
                    <b className="text-[0.92rem] text-ink">{p.name}</b>
                    <span className="block text-[0.8rem] text-ink-soft">{p.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal mt-11 text-center font-serif text-[1.3rem] italic text-[#f2b8b8]">
            &quot;Learn, Develop &amp; Lead.&quot;
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
    </>
  );
}
