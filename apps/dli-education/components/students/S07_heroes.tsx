import { getStudentOutcomes } from "@/lib/content";

const BADGE_OVERRIDE: Record<string, string> = { "Evana Eliza Vinoj": "EV" };

function badge(name: string) {
  if (BADGE_OVERRIDE[name]) return BADGE_OVERRIDE[name];
  const w = name.split(/\s+/).filter(Boolean);
  return ((w[0]?.[0] ?? "") + (w[1]?.[0] ?? "")).toUpperCase();
}

export async function S07_heroes() {
  const rows = await getStudentOutcomes();
  return (
    <>
      <section className="section" id="heroes">
        <div className="wrap">
          <div className="shead simple reveal">
            <span className="kicker">Our super heroes</span>
            <h2 className="h2" style={{ marginTop: "10px" }}>Students who took it somewhere</h2>
            <p className="sh-note">Real learners from DLI Education classrooms, in India and the UAE.</p>
          </div>
          <div className="ogrid reveal">
            {rows.map((o) => (
              <figure className="ocard" key={o.id}>
                <div className="o-top">
                  <span className="o-badge">{badge(o.name)}</span>
                  <div>
                    <div className="o-name">{o.name}</div>
                    <div className="o-where">{o.place}</div>
                  </div>
                </div>
                <p className="o-win">{o.win}</p>
                <span className="o-tag">{o.tag}</span>
              </figure>
            ))}
          </div>
          <p className="qnote">These are a few of the stories. Every line of code brings another.</p>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
    </>
  );
}
