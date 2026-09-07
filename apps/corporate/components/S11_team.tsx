const TEAM_AFTER =
  "linear-gradient(110deg,rgba(20,8,14,0.9) 0%,rgba(20,8,14,0.62) 55%,rgba(20,8,14,0.4) 100%)";

const member =
  "m-0 flex items-center gap-[18px] flex-[1_1_320px] rounded-[var(--r)] [padding:22px_24px] [background:rgba(255,255,255,0.07)] [border:1px_solid_rgba(255,255,255,0.16)] [backdrop-filter:blur(8px)]";

export function S11_team() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink p-0" id="team">
        <img
          className="absolute inset-0 h-full w-full object-cover [filter:grayscale(0.4)]"
          src="/assets/photos/client-team.webp"
          alt="A client team at the close of a De' Lead session"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: TEAM_AFTER }}
          aria-hidden="true"
        />
        <div className="relative z-[2] mx-auto max-w-[var(--maxw)] [padding:110px_var(--pad)]">
          <div className="reveal mb-11 max-w-[560px]">
            <span className="eyebrow on-dark mb-5">
              <i className="mk"></i>Who runs it
            </span>
            <h2 className="mb-3.5 text-white [font-size:clamp(2rem,4vw,3rem)]">
              The directors run the room themselves
            </h2>
            <p className="text-[1.02rem] [color:rgba(255,255,255,0.82)]">
              Both directors facilitate sessions in person, backed by specialist facilitators
              including an emotional-selling coach for sales teams.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-[18px] max-[820px]:flex-col">
            {[
              {
                img: "/assets/people/arjun-cp.webp",
                name: "Arjun C P",
                role: "CTO & Director",
                bio: "Leads strategy and outbound sessions.",
              },
              {
                img: "/assets/people/sabarinath-k.webp",
                name: "Sabarinath K",
                role: "CMO & Director",
                bio: "Leads leadership and team-building sessions.",
              },
            ].map((m) => (
              <figure className={member} key={m.name}>
                <div className="h-[78px] w-[78px] flex-none overflow-hidden rounded-2xl [background:rgba(255,255,255,0.1)]">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-full w-full object-cover [object-position:top_center]"
                  />
                </div>
                <figcaption>
                  <b className="block [font-family:'Instrument_Sans',sans-serif] text-[1.15rem] text-white">
                    {m.name}
                  </b>
                  <span className="[margin:3px_0_6px] block text-[0.78rem] font-semibold [color:#f3c8dc]">
                    {m.role}
                  </span>
                  <p className="text-[0.88rem] leading-[1.45] [color:rgba(255,255,255,0.78)]">
                    {m.bio}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
    </>
  );
}
