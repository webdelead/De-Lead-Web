export function S10_contact() {
  return (
    <>
      <section className="section" id="contact">
        <div className="contact-inner">
          <div className="shead simple reveal">
            <span className="kicker">Get in touch</span>
            <h2 className="h2" style={{ marginTop: "10px" }}>Start a conversation</h2>
            <p className="sh-note">We reply within a couple of working days.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card reveal">
              <h3 className="h3">Talk to us</h3>
              <ul className="c-lines">
                <li><a href="mailto:info@deleadint.com">info@deleadint.com</a></li>
                <li><a href="tel:+918075566081">+91 807 556 6081</a>, India</li>
                <li><a href="tel:+971506814538">+971 50 681 4538</a>, UAE</li>
              </ul>
            </div>
            <form data-lead-source="dli_education" className="contact-card cf reveal" id="enquiryForm" noValidate>
              <div className="cf-row">
                <div className="cf-field"><label htmlFor="f-name">Name</label><input type="text" id="f-name" name="name" required /></div>
                <div className="cf-field"><label htmlFor="f-email">Email</label><input type="email" id="f-email" name="email" required /></div>
              </div>
              <div className="cf-row">
                <div className="cf-field"><label htmlFor="f-phone">Phone</label><input type="tel" id="f-phone" name="phone" /></div>
                <div className="cf-field"><label htmlFor="f-course">Course of interest</label>
                  <select id="f-course" name="course">
                    <option>Python Programming</option>
                    <option>Python for Data Analytics</option>
                    <option>Web Development</option>
                    <option>Robotics</option>
                    <option>3D Design &amp; Modeling</option>
                    <option>UI/UX Designing</option>
                    <option>Internet of Things</option>
                    <option>Gen AI for Smart Learning</option>
                    <option>Artificial Intelligence for All</option>
                    <option>Data &amp; Analytics</option>
                    <option>Block Based Coding for Kids</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
              </div>
              <div className="cf-field full"><label htmlFor="f-message">Message</label><textarea id="f-message" name="message" rows={4} required></textarea></div>
              <button type="submit" className="btn">Send message</button>
              <p className="form-success" id="formSuccess" hidden>Thanks, your message is in. We will be in touch within a couple of working days.</p>
            </form>
          </div>
        </div>
      </section>
      
      {/* ============ FOOTER ============ */}
    </>
  );
}
