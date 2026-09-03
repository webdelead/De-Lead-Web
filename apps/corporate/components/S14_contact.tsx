export function S14_contact() {
  return (
    <>
      <section className="section contact" id="contact">
        <div className="wrap contact-wrap">
          <div className="contact-head reveal">
            <span className="eyebrow"><i className="mk"></i>Get in touch</span>
            <h2>Start a conversation</h2>
            <p>One of the directors replies within a couple of working days.</p>
            <ul className="contact-lines">
              <li><a href="mailto:info@deleadint.com">info@deleadint.com</a></li>
              <li><a href="tel:+918075566081">+91 807 556 6081</a>, India</li>
              <li><a href="tel:+971506814538">+971 50 681 4538</a>, UAE</li>
            </ul>
          </div>
          <form data-lead-source="corporate" className="form reveal" id="enquiryForm" noValidate>
            <div className="f-row">
              <div className="f-field"><label htmlFor="f-name">Name</label><input type="text" id="f-name" name="name" required /></div>
              <div className="f-field"><label htmlFor="f-email">Work email</label><input type="email" id="f-email" name="email" required /></div>
            </div>
            <div className="f-row">
              <div className="f-field"><label htmlFor="f-company">Company</label><input type="text" id="f-company" name="company" /></div>
              <div className="f-field"><label htmlFor="f-size">Team size</label>
                <select id="f-size" name="team_size"><option>Under 20</option><option>20&ndash;50</option><option>50&ndash;100</option><option>100+</option></select>
              </div>
            </div>
            <div className="f-field f-full"><label htmlFor="f-interest">What you&rsquo;re looking for</label>
              <select id="f-interest" name="interest">
                <option>Leadership Development</option><option>Team Building</option>
                <option>Strategic Thinking &amp; Execution</option><option>Outbound Training</option>
                <option>Not sure yet, let&rsquo;s talk</option>
              </select>
            </div>
            <div className="f-field f-full"><label htmlFor="f-message">Message</label><textarea id="f-message" name="message" rows={4} required></textarea></div>
            <button type="submit" className="btn btn-primary">Send message</button>
            <p className="form-success" id="formSuccess" hidden>Thanks, your message is in. We&rsquo;ll be in touch within a couple of working days.</p>
          </form>
        </div>
      </section>
      
      {/* ============ FOOTER ============ */}
    </>
  );
}
