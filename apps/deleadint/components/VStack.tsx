import type { CSSProperties, ReactNode } from "react";

interface VCard {
  id: string;
  style: CSSProperties;
  brandSplit?: boolean;
  logo: { src: string; alt: string; style?: CSSProperties };
  brandSub?: string;
  eyebrow: ReactNode;
  desc: ReactNode;
  stats: [string, ReactNode][];
  numeral: string;
  tornTriangle?: boolean;
  media: { src: string; alt: string };
  /** a second photo peeking behind the front one — click it to bring it
   *  forward (js/main.js). Omit for verticals with no second photo on hand
   *  (Goal Finder — it's a product, not a photographed programme). */
  mediaBack?: { src: string; alt: string };
  badge: { href: string; external?: boolean; label: string };
}

const cards: VCard[] = [
  {
    id: "corporate",
    style: { "--v-bg": "#4a0330", "--v-fg": "#fff" } as CSSProperties,
    brandSplit: true,
    logo: { src: "/assets/logo/logo-delead-white.png", alt: "De' Lead International" },
    brandSub: "Corporate Training",
    eyebrow: <>Leadership &middot; Team Building &middot; Outbound</>,
    desc: (
      <>
        Directed by Arjun C P and Sabarinath K, our corporate arm runs leadership development, team
        building and outbound training for organisations across India and the UAE. Strategy sessions
        in boardrooms, confidence-building on horseback.
      </>
    ),
    stats: [
      ["4+", "Corporate clients"],
      ["7", "Programmes since 2023"],
      ["2", <>Countries, India &amp; UAE</>],
    ],
    numeral: "01",
    media: {
      src: "/assets/stock/corp-suit.webp",
      alt: "A client leadership team after a De' Lead corporate session",
    },
    mediaBack: { src: "/assets/stock/corp-2.webp", alt: "Corporate Training session in progress" },
    badge: { href: "#contact", label: "Know more" },
  },
  {
    id: "dli-foundation",
    style: {
      "--v-bg": "#c81c1c",
      "--v-fg": "#fff",
      "--v-font": "'Lora',serif",
      "--v-fw": "700",
      "--v-fstyle": "italic",
    } as CSSProperties,
    logo: {
      src: "/assets/logos-verticals/walk2lead-logo-white.svg",
      alt: "Walk2Lead",
      style: { width: "100%", maxWidth: "520px", height: "auto", filter: "brightness(0) invert(1)" },
    },
    eyebrow: <>Walk2Lead &middot; CSR</>,
    desc: (
      <>
        Our CSR arm&apos;s flagship programme, <b>Walk2Lead</b>, brings hands-on robotics, coding and
        AI into rural government schools across Kerala. Funded by Walkaroo Foundation, implemented
        end-to-end by De&rsquo; Lead.
      </>
    ),
    stats: [
      ["44", "Schools implemented"],
      ["1,300+", "Students reached"],
      ["4", "Districts in Kerala"],
    ],
    numeral: "02",
    media: { src: "/assets/images/card-walk2lead.jpg", alt: "Walk2Lead CSR robotics programme" },
    mediaBack: { src: "/assets/stock/w2l-1.webp", alt: "Walk2Lead students at a robotics session" },
    badge: { href: "https://w2l.deleadint.com", external: true, label: "Visit site" },
  },
  {
    id: "tinkerchamps",
    style: {
      "--v-bg": "#5021b0",
      "--v-fg": "var(--tc-yellow)",
      "--v-font": "'Covered By Your Grace',cursive",
      "--v-fw": "400",
    } as CSSProperties,
    logo: {
      src: "/assets/logos-verticals/tinkerchamps-logo.webp",
      alt: "TinkerChamps",
      style: { width: "100%", maxWidth: "520px", height: "auto" },
    },
    eyebrow: "Residential Experiential Camps",
    desc: (
      <>
        A 3-day premium experiential learning camp, plus a 2-day @School format, that helps students
        from grades 6&ndash;12 think sharper, lead better and design their own future. High ropes,
        team challenges, robotics &amp; AI.
      </>
    ),
    stats: [
      ["20+", "Seasons completed"],
      ["500+", "Students attended"],
      ["50+", "Hands-on activities"],
    ],
    numeral: "03",
    media: {
      src: "/assets/images/card-tinkerchamps.jpg",
      alt: "TinkerChamps residential camp activity",
    },
    mediaBack: { src: "/assets/stock/tc-4.webp", alt: "TinkerChamps students at camp" },
    badge: { href: "https://tinkerchamps.deleadint.com", external: true, label: "Visit site" },
  },
  {
    id: "makerchamps",
    style: {
      "--v-bg": "#021e5d",
      "--v-fg": "#fff",
      "--v-font": "'Bricolage Grotesque',sans-serif",
      "--v-fw": "700",
    } as CSSProperties,
    logo: {
      src: "/assets/logos-verticals/makerchamps-logo-white.svg",
      alt: "MakerChamps",
      style: { width: "100%", maxWidth: "440px", height: "auto" },
    },
    eyebrow: <>Think &middot; Make &middot; Transform</>,
    desc: (
      <>
        A 2-day residential innovation bootcamp on the NIT Calicut campus, run with Nlightened
        ZenSolutions (incubated inside NIT Calicut&apos;s own Technology Business Incubator). Seven
        hands-on modules, real labs, real engineers.
      </>
    ),
    stats: [
      ["60", "Seats per season, max"],
      ["7", "Modules, 2 days"],
      ["#1", "NIT in Kerala, NIRF top"],
    ],
    numeral: "04",
    tornTriangle: true,
    media: { src: "/assets/stock/mc-1.webp", alt: "MakerChamps innovation bootcamp" },
    mediaBack: { src: "/assets/stock/mc-hero.webp", alt: "MakerChamps students on the NIT Calicut campus" },
    badge: { href: "#contact", label: "Know more" },
  },
  {
    id: "dli-education",
    style: {
      "--v-bg": "#142653",
      "--v-fg": "#fff",
      "--v-accent": "#29bac1",
      "--v-font": "'Space Grotesk',sans-serif",
      "--v-fw": "700",
    } as CSSProperties,
    brandSplit: true,
    logo: { src: "/assets/logo/logo-delead-white.png", alt: "De' Lead International" },
    brandSub: "DLI Education",
    eyebrow: <>DLI Students &middot; DLI Professionals</>,
    desc: (
      <>
        <b>Students</b>: Python, Web Dev, Robotics, 3D Design, Block Coding &amp; Gen AI.{" "}
        <b>Professionals</b>: Gen AI for Educators &amp; HR, design thinking, leadership. Online,
        offline, camps or corporate workshops.
      </>
    ),
    stats: [
      ["2000+", "Students trained"],
      ["8+", "Course tracks"],
      ["4", "Delivery modes"],
    ],
    numeral: "05",
    media: { src: "/assets/stock/dli-2.webp", alt: "DLI Education classroom session" },
    mediaBack: { src: "/assets/stock/dli-1.webp", alt: "DLI Education students at a session" },
    badge: { href: "#contact", label: "Know more" },
  },
  {
    id: "goal-finder",
    style: {
      "--v-bg": "#0145d5",
      "--v-fg": "#fff",
      "--v-accent": "#72c045",
      "--v-font": "'Manrope',sans-serif",
      "--v-fw": "800",
    } as CSSProperties,
    logo: {
      src: "/assets/logos-verticals/goalfinder-logo-white.png",
      alt: "Goal Finder",
      style: { height: "132px" },
    },
    eyebrow: "AI Career-Profiling Platform",
    desc: (
      <>
        A psychometric personality assessment, powered by AI, for students and professionals alike.
        Career matches, a career library, top colleges in India and abroad, entrance-exam timelines
        and scholarships.
      </>
    ),
    stats: [
      ["AI", "+ psychometric testing"],
      ["Global", <>College matches, India &amp; abroad</>],
      ["2", <>Students &amp; pros</>],
    ],
    numeral: "06",
    media: { src: "/assets/images/about-story.jpg", alt: "Student career guidance session" },
    badge: { href: "https://goalfinder.org/", external: true, label: "Visit site" },
  },
];

function VCardEl({ c }: { c: VCard }) {
  return (
    <section className="v-card" id={c.id} style={c.style}>
      <div className="v-card-inner container">
        <div className={c.brandSplit ? "vc-brand vc-brand-split" : "vc-brand"}>
          <img className="vc-logo" src={c.logo.src} alt={c.logo.alt} style={c.logo.style} />
          {c.brandSub && <span className="vc-brand-sub">{c.brandSub}</span>}
        </div>
        <p className="vc-eyebrow">{c.eyebrow}</p>
        <p className="vc-desc">{c.desc}</p>
        <div className="v-stats">
          {c.stats.map(([v, label], i) => (
            <div key={i}>
              <b>{v}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="vc-numeral">{c.numeral}</span>
      <div className="vc-right">
        {c.tornTriangle && <span className="torn-triangle" aria-hidden="true"></span>}
        <div className="vc-media">
          {c.mediaBack && <img className="is-back" src={c.mediaBack.src} alt={c.mediaBack.alt} />}
          <img className="is-front" src={c.media.src} alt={c.media.alt} />
        </div>
        <a
          href={c.badge.href}
          className="vc-badge"
          {...(c.badge.external ? { target: "_blank", rel: "noopener" } : {})}
        >
          {c.badge.label}
        </a>
      </div>
    </section>
  );
}

export function VStack() {
  return (
    <div id="ecosystem" className="v-stack">
      {cards.map((c) => (
        <VCardEl key={c.id} c={c} />
      ))}
    </div>
  );
}
