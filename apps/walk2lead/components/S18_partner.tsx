const waIcon = (
  <svg className="ico-svg" viewBox="0 0 32 32" style={{ width: "20px", height: "20px" }} aria-hidden="true">
    <path fill="#fff" d="M16.004 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.353.615 4.56 1.69 6.475L2.667 29.333l7.045-1.848a13.27 13.27 0 0 0 6.292 1.6h.006c7.363 0 13.333-5.97 13.333-13.333S23.367 2.667 16.004 2.667Zm0 24.222a11.07 11.07 0 0 1-5.65-1.548l-.406-.24-4.184 1.098 1.117-4.078-.264-.418a11.08 11.08 0 0 1-1.703-5.905c0-6.133 4.99-11.122 11.096-11.122 2.965 0 5.752 1.155 7.847 3.253a11.03 11.03 0 0 1 3.246 7.855c0 6.133-4.99 11.105-11.099 11.105Zm6.088-8.315c-.334-.167-1.973-.973-2.279-1.084-.306-.111-.529-.167-.751.167-.223.334-.862 1.084-1.057 1.307-.195.223-.39.25-.723.084-.334-.167-1.41-.52-2.686-1.657-.993-.886-1.663-1.98-1.858-2.313-.195-.334-.02-.514.146-.68.15-.15.334-.39.501-.585.167-.195.223-.334.334-.557.111-.223.056-.418-.028-.585-.084-.167-.751-1.81-1.029-2.479-.271-.65-.546-.563-.751-.573l-.64-.011c-.223 0-.585.084-.891.418-.306.334-1.168 1.14-1.168 2.784s1.196 3.23 1.363 3.453c.167.223 2.354 3.594 5.703 5.041.797.344 1.418.55 1.902.704.799.254 1.526.218 2.101.132.641-.096 1.973-.807 2.251-1.586.278-.78.278-1.447.195-1.586-.084-.14-.306-.223-.64-.39Z" />
  </svg>
);
const mailIcon = (
  <svg className="ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const phoneIcon = (
  <svg className="ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const contact =
  "flex items-center gap-3.5 rounded-[14px] bg-white/[0.06] px-5 py-4 text-[0.95rem] no-underline transition-colors [border:1px_solid_rgba(255,255,255,0.14)] hover:bg-white/[0.12]";
const labelC = "mb-1.5 block text-[0.78rem] font-semibold text-ink-soft";
const fieldC =
  "w-full rounded-[10px] bg-cream px-3.5 py-3 text-[0.92rem] leading-[1.6] [font-family:inherit] [border:1.5px_solid_var(--color-line)] focus:outline-none focus:[border-color:var(--color-w2l)]";
const ic =
  "grid h-[38px] w-[38px] flex-[0_0_38px] place-items-center rounded-[10px] bg-w2l text-base";

export function S18_partner() {
  return (
    <>
      <section
        id="partner"
        className="relative overflow-hidden bg-ink text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[url('/assets/pattern.svg')] before:bg-[length:820px] before:opacity-35 before:[filter:invert(1)] before:content-['']"
      >
        <div className="wrap relative grid grid-cols-2 gap-[70px] max-[900px]:grid-cols-1">
          <div>
            <div className="eyebrow text-[#f2b8b8]">Partner With Us</div>
            <h2 className="mb-5 text-[clamp(2rem,3.6vw,3rem)]">
              Let&apos;s plan your CSR programme together.
            </h2>
            <p className="lead mb-[34px] text-white/75">
              De&apos; Lead International designs and executes complete CSR programmes, from school
              selection and government liaison to training, expos and board-ready impact reports.
              Phase 5 is already being planned; there&apos;s room for a new partner to fund it.
            </p>
            <div className="mt-2 grid gap-3.5">
              <a
                className={`${contact} [&_.ic]:!bg-[#25d366]`}
                href="https://wa.me/918075566081?text=Hi%20De%27%20Lead%20International%2C%20I%27d%20like%20to%20discuss%20a%20CSR%20partnership."
                target="_blank"
                rel="noopener"
              >
                <span className={`ic ${ic}`}>{waIcon}</span>
                <span>
                  <b>Chat on WhatsApp</b>
                </span>
              </a>
              <a className={contact} href="mailto:info@deleadint.com">
                <span className={ic}>{mailIcon}</span>
                <span>
                  <b>info@deleadint.com</b>
                </span>
              </a>
              <a className={contact} href="tel:+918075566081">
                <span className={ic}>{phoneIcon}</span>
                <span>
                  <b>+91 80755 66081</b>
                </span>
              </a>
            </div>
          </div>
          {/* SiteScripts toggles .is-loading / .is-success on #csr-form; the
              state-driven show/hide is the [.is-loading_&] / [.is-success_&]
              arbitrary variants below. */}
          <form
            id="csr-form"
            data-lead-source="walk2lead"
            className="relative rounded-[20px] bg-white px-[34px] py-[38px] text-ink shadow-card"
          >
            <div className="form-inner [.is-loading_&]:hidden [.is-success_&]:hidden">
              <h3 className="mb-1.5 text-[1.3rem]">Start the conversation</h3>
              <p className="mb-6 text-[0.88rem] text-ink-soft">
                We typically respond within one business day.
              </p>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  ["Your name", "name", "Full name", "text", true],
                  ["Company", "company", "Company / Foundation", "text", true],
                ].map(([label, name, ph, type, req]) => (
                  <div className="mb-3.5" key={name as string}>
                    <label className={labelC}>{label}</label>
                    <input className={fieldC} name={name as string} type={type as string} required={!!req} placeholder={ph as string} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="mb-3.5">
                  <label className={labelC}>Email</label>
                  <input className={fieldC} name="email" type="email" required placeholder="you@company.com" />
                </div>
                <div className="mb-3.5">
                  <label className={labelC}>Phone</label>
                  <input className={fieldC} name="phone" placeholder="+91" />
                </div>
              </div>
              <div className="mb-3.5">
                <label className={labelC}>What are you exploring?</label>
                <textarea
                  className={`${fieldC} min-h-[120px] resize-y`}
                  name="message"
                  rows={4}
                  placeholder="e.g. We want to run a STEM CSR programme in Tamil Nadu for ~500 students…"
                />
              </div>
              <button className="btn btn-primary !mt-1.5 !w-full !justify-center" type="submit">
                Send enquiry →
              </button>
            </div>
            <div
              className="hidden min-h-[320px] flex-col items-center justify-center gap-[18px] px-6 py-12 text-center [.is-loading_&]:flex [&_p]:m-0 [&_p]:text-[0.95rem] [&_p]:text-ink-soft"
              aria-hidden="true"
            >
              <div className="h-12 w-12 rounded-full [animation:spin_0.8s_linear_infinite] [border:3px_solid_rgba(0,0,0,0.1)] [border-top-color:var(--color-w2l)]" />
              <p>Sending your message…</p>
            </div>
            <div
              className="hidden min-h-[320px] flex-col items-center justify-center gap-[18px] px-6 py-12 text-center [.is-success_&]:flex [&_p]:m-0 [&_p]:text-[0.95rem] [&_p]:text-ink-soft"
              aria-hidden="true"
            >
              <div className="[&_circle]:[animation:draw-circle_0.6s_ease_forwards] [&_circle]:[stroke-dasharray:157] [&_circle]:[stroke-dashoffset:157] [&_path]:[animation:draw-check_0.4s_0.5s_ease_forwards] [&_path]:[stroke-dasharray:40] [&_path]:[stroke-dashoffset:40] [&_svg]:h-16 [&_svg]:w-16">
                <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="26" r="25" stroke="var(--red)" strokeWidth="2" /><path d="M14 26.5l8 8 16-16" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="m-0 text-[1.5rem] text-ink">Message sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within one business day.</p>
              <p className="!text-[0.85rem] [&_a:hover]:underline [&_a]:text-w2l [&_a]:no-underline">
                In the meantime, feel free to reach us on{" "}
                <a href="https://wa.me/918075566081" target="_blank" rel="noopener">WhatsApp</a> or at{" "}
                <a href="mailto:info@deleadint.com">info@deleadint.com</a>.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
