const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231c1417' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

const fieldWrap = "flex flex-col gap-[7px]";
const labelC = "text-[0.8rem] font-semibold text-ink-soft";
const inputC =
  "rounded-xl [padding:13px_15px] text-[0.95rem] text-ink [font-family:inherit] [background:var(--color-paper)] [border:1px_solid_var(--line)] transition-[border-color] duration-200 focus:outline-none focus:[border-color:var(--color-magenta)]";
const selectC = `${inputC} appearance-none cursor-pointer pr-10 bg-no-repeat [background-image:${CHEVRON}] [background-position:right_13px_center] [background-size:16px]`;

export function S14_contact() {
  return (
    <>
      <section className="section relative" id="contact">
        <div className="wrap grid grid-cols-[0.9fr_1.1fr] items-start gap-[60px] max-[1000px]:grid-cols-1 max-[1000px]:gap-[38px]">
          <div className="reveal sticky top-[120px] max-[1000px]:static">
            <span className="eyebrow mb-5">
              <i className="mk"></i>Get in touch
            </span>
            <h2 className="mb-3 [font-size:clamp(1.9rem,3.4vw,2.6rem)]">Start a conversation</h2>
            <p className="max-w-[32ch] text-base text-ink-soft">
              One of the directors replies within a couple of working days.
            </p>
            <ul className="mt-6 flex flex-col gap-[9px] text-[0.92rem] text-ink-soft">
              <li>
                <a
                  href="mailto:info@deleadint.com"
                  className="font-semibold text-ink [border-bottom:1px_solid_var(--line)] hover:[border-color:var(--color-magenta)]"
                >
                  info@deleadint.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918075566081"
                  className="font-semibold text-ink [border-bottom:1px_solid_var(--line)] hover:[border-color:var(--color-magenta)]"
                >
                  +91 807 556 6081
                </a>
                , India
              </li>
              <li>
                <a
                  href="tel:+971506814538"
                  className="font-semibold text-ink [border-bottom:1px_solid_var(--line)] hover:[border-color:var(--color-magenta)]"
                >
                  +971 50 681 4538
                </a>
                , UAE
              </li>
            </ul>
          </div>
          <form data-lead-source="corporate" className="reveal max-w-[620px]" id="enquiryForm" noValidate>
            <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
              <div className={fieldWrap}>
                <label htmlFor="f-name" className={labelC}>
                  Name
                </label>
                <input type="text" id="f-name" name="name" required className={inputC} />
              </div>
              <div className={fieldWrap}>
                <label htmlFor="f-email" className={labelC}>
                  Work email
                </label>
                <input type="email" id="f-email" name="email" required className={inputC} />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
              <div className={fieldWrap}>
                <label htmlFor="f-company" className={labelC}>
                  Company
                </label>
                <input type="text" id="f-company" name="company" className={inputC} />
              </div>
              <div className={fieldWrap}>
                <label htmlFor="f-size" className={labelC}>
                  Team size
                </label>
                <select id="f-size" name="team_size" className={selectC}>
                  <option>Under 20</option>
                  <option>20&ndash;50</option>
                  <option>50&ndash;100</option>
                  <option>100+</option>
                </select>
              </div>
            </div>
            <div className={`${fieldWrap} mb-4`}>
              <label htmlFor="f-interest" className={labelC}>
                What you&rsquo;re looking for
              </label>
              <select id="f-interest" name="interest" className={selectC}>
                <option>Leadership Development</option>
                <option>Team Building</option>
                <option>Strategic Thinking &amp; Execution</option>
                <option>Outbound Training</option>
                <option>Not sure yet, let&rsquo;s talk</option>
              </select>
            </div>
            <div className={`${fieldWrap} mb-4`}>
              <label htmlFor="f-message" className={labelC}>
                Message
              </label>
              <textarea
                id="f-message"
                name="message"
                rows={4}
                required
                className={`${inputC} min-h-[100px] resize-y`}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
            <p
              className="mt-3.5 text-[0.92rem] font-semibold [color:var(--color-magenta-deep)]"
              id="formSuccess"
              hidden
            >
              Thanks, your message is in. We&rsquo;ll be in touch within a couple of working days.
            </p>
          </form>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
    </>
  );
}
