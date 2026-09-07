const PBEFORE =
  "linear-gradient(180deg,rgba(16,7,12,0.62)_0%,rgba(16,7,12,0.14)_22%,rgba(16,7,12,0.1)_46%,rgba(30,8,22,0.68)_78%,rgba(45,4,32,0.9)_100%)";

const pcard =
  "relative isolate flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[var(--r-lg)] p-[34px] bg-cover text-white [background-color:#1a0f16] max-[1000px]:min-h-[380px] " +
  `before:content-[''] before:absolute before:inset-0 before:z-[-1] before:[background:${PBEFORE}]`;

const cat = "text-[0.68rem] font-bold uppercase tracking-[0.14em] [color:#f3c8dc]";
const h3 = "mt-3 text-[1.9rem] tracking-[-0.03em] text-white";
const bodyP = "mb-4 max-w-[44ch] text-base leading-[1.5] [color:rgba(255,255,255,0.9)]";
const chips = "flex flex-wrap gap-2";
const chip =
  "rounded-full [padding:6px_13px] text-[0.8rem] font-semibold text-white [background:rgba(255,255,255,0.14)] [border:1px_solid_rgba(255,255,255,0.22)] [backdrop-filter:blur(4px)]";

const CARDS = [
  {
    bg: "bg-[url('/assets/photos/facilitator-mic.webp')] bg-center",
    cat: "Track 01",
    h: "Leadership Development",
    p: "Grow leaders at every level: theory paired with practice, on the floor.",
    tags: ["Communication", "Emotional intelligence", "Strategic thinking", "Conflict resolution", "Decision-making"],
  },
  {
    bg: "bg-[url('/assets/photos/trophy-win.webp')] bg-center",
    cat: "Track 02",
    h: "Team Building",
    p: "Rebuild how a team communicates, trusts and solves problems, through experience.",
    tags: ["Collaboration", "Problem-solving", "Trust", "Productivity", "Adaptability"],
  },
  {
    bg: "bg-[url('/assets/photos/sales-session.webp')] [background-position:center_62%]",
    cat: "Track 03",
    h: "Strategic Thinking & Execution",
    p: "Move the team from firefighting to decisions aligned with where the business is going.",
    tags: ["Decision-making", "Alignment to goals", "Adaptability", "Innovation"],
  },
  {
    bg: "bg-[url('/assets/photos/outbound-horse.webp')] [background-position:center_30%]",
    cat: "Track 04",
    h: "Outbound Training",
    p: "Take the team out of the office into adventure-based challenges that show how they really work together.",
    tags: ["Team cohesion", "Leadership", "Trust", "Culture shift"],
    sub: "Signature activities: Flight Game · Rope Passing · Rope Escape · Tower Building",
  },
];

export function S06_programmes() {
  return (
    <>
      <section className="section relative [background:var(--color-cream)]" id="programmes">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">
              <i className="mk"></i>What we run
            </span>
            <h2>Four tracks, combined into one engagement</h2>
            <p>Most engagements draw on two or more, scaled to the team and the room.</p>
          </div>

          <div className="reveal grid grid-cols-2 gap-5 max-[1000px]:grid-cols-1">
            {CARDS.map((c) => (
              <article className={`${pcard} ${c.bg}`} key={c.cat}>
                <div>
                  <span className={cat}>{c.cat}</span>
                  <h3 className={h3}>{c.h}</h3>
                </div>
                <div>
                  <p className={bodyP}>{c.p}</p>
                  <ul className={chips}>
                    {c.tags.map((t) => (
                      <li className={chip} key={t}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  {c.sub && (
                    <p className="mb-0 mt-3.5 text-[0.82rem] [color:rgba(255,255,255,0.7)]">
                      {c.sub}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BIG NUMBERS ============ */}
    </>
  );
}
