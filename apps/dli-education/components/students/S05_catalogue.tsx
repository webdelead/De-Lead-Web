import { getCourses } from "@/lib/content";

// card colour + icon per course, matching the approved layout; new courses
// fall back to a cycling colour + a generic icon.
const STYLE: Record<string, { color: string; icon: string }> = {
  "Gen AI for Smart Learning": { color: "lime", icon: "i-sparkles" },
  "Artificial Intelligence for All": { color: "rose", icon: "i-sparkles" },
  "Python for Data Analytics": { color: "peach", icon: "i-chart" },
  "Data & Analytics": { color: "teal", icon: "i-chart" },
  "Python Programming": { color: "lime", icon: "i-code" },
  "Web Development": { color: "rose", icon: "i-globe" },
  "Internet of Things": { color: "peach", icon: "i-wifi" },
  "3D Design & Modeling": { color: "lav", icon: "i-box" },
  "UI/UX Designing": { color: "teal", icon: "i-palette" },
  Robotics: { color: "lime", icon: "i-bot" },
  "Block Based Coding for Kids": { color: "rose", icon: "i-grid" },
};
const CYCLE = ["lime", "rose", "peach", "teal", "lav"];

export async function S05_catalogue() {
  const rows = await getCourses("students");
  const tracks = [...new Set(rows.map((r) => r.track))];

  return (
    <>
      <section className="section" id="catalogue">
        <div className="wrap">
          <div className="shead simple reveal">
            <h2 className="h2">Eleven tracks, four families</h2>
            <p className="sh-note">Durations shown where fixed. Most tracks run group or 1-to-1, online or offline, and adapt to a camp or a school.</p>
          </div>
          <div className="filters reveal">
            <span className="filter active">All</span>
            {tracks.map((t) => (
              <span className="filter" key={t}>{t}</span>
            ))}
          </div>
          <div className="cgrid reveal">
            {rows.map((c, i) => {
              const st = STYLE[c.title] ?? { color: CYCLE[i % CYCLE.length]!, icon: "i-sparkles" };
              return (
                <article className="ccard" key={c.id}>
                  <div className={`cc-top ${st.color}`}>
                    <svg className="ic"><use href={`#${st.icon}`} /></svg>
                  </div>
                  <div className="cc-rate">{c.track}</div>
                  <h4>{c.title}</h4>
                  <p className="cc-desc">{c.description}</p>
                  <p className="cc-meta">
                    {c.ageLabel} • {c.format}
                  </p>
                  <div className="cc-foot">
                    <span className="cc-price">{c.durationLabel}</span>
                    <a href="#contact" className="btn btn-outline btn-sm">Enquire</a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DELIVERY ============ */}
    </>
  );
}
