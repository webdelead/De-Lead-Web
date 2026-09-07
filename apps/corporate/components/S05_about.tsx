export function S05_about() {
  return (
    <>
      <section
        className="section relative [background:var(--color-paper)] [border-top:1px_solid_var(--color-line)]"
        id="about"
      >
        <div className="wrap reveal grid grid-cols-2 items-start gap-16 max-[1000px]:grid-cols-1 max-[1000px]:gap-9">
          <div>
            <span className="eyebrow mb-[22px]">
              <i className="mk"></i>About
            </span>
            <h2 className="mb-5 max-w-[16ch] [font-size:clamp(2rem,3.6vw,2.9rem)]">
              An experiential-first training practice
            </h2>
            <p className="max-w-[52ch] text-[1.08rem] leading-[1.66] text-ink-soft">
              Our corporate practice was built for teams that have outgrown the classroom. Every
              session runs on an activity, not a slide: a real problem, real pressure, and a debrief
              that translates straight back to how the team works day to day. Programmes are
              delivered on the ground in India and the UAE, across sectors from ports and logistics
              to healthcare and business services.
            </p>
          </div>
          <div className="flex flex-col gap-[18px]">
            <article className="rounded-[var(--r)] [padding:30px_32px] [background:var(--color-cream)] [border-bottom:1px_solid_var(--color-line)] [border-left:1px_solid_var(--color-line)] [border-right:1px_solid_var(--color-line)] [border-top:3px_solid_var(--color-magenta)]">
              <span className="eyebrow mb-3.5">
                <i className="mk"></i>Mission
              </span>
              <p className="text-[1.02rem] leading-[1.62] text-ink-soft">
                Empower organisations and individuals with transformative learning experiences: a
                culture of continuous growth and excellence, guided by innovation, integrity and
                inclusivity.
              </p>
            </article>
            <article className="rounded-[var(--r)] [padding:30px_32px] [background:var(--color-cream)] [border-bottom:1px_solid_var(--color-line)] [border-left:1px_solid_var(--color-line)] [border-right:1px_solid_var(--color-line)] [border-top:3px_solid_var(--color-magenta)]">
              <span className="eyebrow mb-3.5">
                <i className="mk"></i>Vision
              </span>
              <p className="text-[1.02rem] leading-[1.62] text-ink-soft">
                Be the catalyst for transformative growth: a premier provider of innovative, tailored
                corporate training that helps businesses and professionals navigate an ever-changing
                world.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ PROGRAMMES ============ */}
    </>
  );
}
