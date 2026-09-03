export function ContactForm() {
  return (
    <section className="contact-form" id="contact">
      <div className="container cf-layout">
        <div className="section-head reveal">
          <span className="eyebrow">Get In Touch</span>
          <h2>Tell us what you&apos;re building</h2>
          <p>
            A school, a CSR budget, a team offsite, or a career decision: tell us the vertical and
            we&apos;ll get back to you within a couple of working days.
          </p>
        </div>
        <form
          data-lead-source="deleadint"
          className="cf-form reveal"
          action="mailto:info@deleadint.com"
          method="post"
          encType="text/plain"
        >
          <div className="cf-row">
            <div className="cf-field">
              <label htmlFor="cf-name">Name</label>
              <input type="text" id="cf-name" name="Name" required />
            </div>
            <div className="cf-field">
              <label htmlFor="cf-email">Email</label>
              <input type="email" id="cf-email" name="Email" required />
            </div>
          </div>
          <div className="cf-row">
            <div className="cf-field">
              <label htmlFor="cf-phone">Phone</label>
              <input type="tel" id="cf-phone" name="Phone" />
            </div>
            <div className="cf-field">
              <label htmlFor="cf-vertical">I&apos;m interested in</label>
              <select id="cf-vertical" name="Interested in">
                <option>Corporate Training</option>
                <option>TinkerChamps</option>
                <option>MakerChamps</option>
                <option>DLI Education</option>
                <option>Goal Finder</option>
                <option>DLI Foundation &middot; Walk2Lead</option>
                <option>Something else</option>
              </select>
            </div>
          </div>
          <div className="cf-field cf-field-full">
            <label htmlFor="cf-message">Message</label>
            <textarea id="cf-message" name="Message" rows={4} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Send message
            <span className="btn-ring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
