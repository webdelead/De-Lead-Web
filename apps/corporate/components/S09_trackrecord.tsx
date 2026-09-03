import { getTrackRecord } from "@/lib/content";

export async function S09_trackrecord() {
  const rows = await getTrackRecord();
  const card = (r: (typeof rows)[number], clone: boolean) => (
    <article className="tcard" key={(clone ? "b" : "a") + r.id} {...(clone ? { "aria-hidden": "true" } : {})}>
      <span className="tcard-when">{r.whenLabel}</span>
      <h4>{r.client}</h4>
      <p>{r.blurb}</p>
      <span className="tcard-badge">{r.badge}</span>
    </article>
  );

  return (
    <>
      <section className="section track" id="track-record">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow"><i className="mk"></i>Proof</span>
            <h2>Engagements, dated and named</h2>
            <p>Corporate programmes delivered since 2023.</p>
          </div>
        </div>
        <div className="track-scroll">
          <div className="track-row">
            {rows.map((r) => card(r, false))}
            {rows.map((r) => card(r, true))}
          </div>
        </div>
        <div className="wrap"><p className="track-note">Dates and details per De&rsquo; Lead International&rsquo;s programme records.</p></div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
    </>
  );
}
