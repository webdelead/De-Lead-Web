export function S18_partner() {
  return (
    <>
      <section className="cta" id="partner">
        <div className="wrap">
          <div>
            <div className="eyebrow">Partner With Us</div>
            <h2>Let's plan your CSR programme together.</h2>
            <p className="lead">De' Lead International designs and executes complete CSR programmes, from school selection and government liaison to training, expos and board-ready impact reports. Phase 5 is already being planned; there's room for a new partner to fund it.</p>
            <div className="cta-contacts">
              <a className="wa" href="https://wa.me/918075566081?text=Hi%20De%27%20Lead%20International%2C%20I%27d%20like%20to%20discuss%20a%20CSR%20partnership." target="_blank" rel="noopener"><span className="ic"><svg className="ico-svg" viewBox="0 0 32 32" style={{ width: "20px", height: "20px" }} aria-hidden="true"><path fill="#fff" d="M16.004 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.353.615 4.56 1.69 6.475L2.667 29.333l7.045-1.848a13.27 13.27 0 0 0 6.292 1.6h.006c7.363 0 13.333-5.97 13.333-13.333S23.367 2.667 16.004 2.667Zm0 24.222a11.07 11.07 0 0 1-5.65-1.548l-.406-.24-4.184 1.098 1.117-4.078-.264-.418a11.08 11.08 0 0 1-1.703-5.905c0-6.133 4.99-11.122 11.096-11.122 2.965 0 5.752 1.155 7.847 3.253a11.03 11.03 0 0 1 3.246 7.855c0 6.133-4.99 11.105-11.099 11.105Zm6.088-8.315c-.334-.167-1.973-.973-2.279-1.084-.306-.111-.529-.167-.751.167-.223.334-.862 1.084-1.057 1.307-.195.223-.39.25-.723.084-.334-.167-1.41-.52-2.686-1.657-.993-.886-1.663-1.98-1.858-2.313-.195-.334-.02-.514.146-.68.15-.15.334-.39.501-.585.167-.195.223-.334.334-.557.111-.223.056-.418-.028-.585-.084-.167-.751-1.81-1.029-2.479-.271-.65-.546-.563-.751-.573l-.64-.011c-.223 0-.585.084-.891.418-.306.334-1.168 1.14-1.168 2.784s1.196 3.23 1.363 3.453c.167.223 2.354 3.594 5.703 5.041.797.344 1.418.55 1.902.704.799.254 1.526.218 2.101.132.641-.096 1.973-.807 2.251-1.586.278-.78.278-1.447.195-1.586-.084-.14-.306-.223-.64-.39Z" /></svg></span><span><b>Chat on WhatsApp</b></span></a>
              <a href="mailto:info@deleadint.com"><span className="ic"><svg className="ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></span><span><b>info@deleadint.com</b></span></a>
              <a href="tel:+918075566081"><span className="ic"><svg className="ico-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span><span><b>+91 80755 66081</b></span></a>
            </div>
          </div>
          <form id="csr-form" data-lead-source="walk2lead">
            <div className="form-inner">
              <h3>Start the conversation</h3>
              <p className="sub">We typically respond within one business day.</p>
              <div className="frow">
                <div className="field"><label>Your name</label><input name="name" required placeholder="Full name" /></div>
                <div className="field"><label>Company</label><input name="company" required placeholder="Company / Foundation" /></div>
              </div>
              <div className="frow">
                <div className="field"><label>Email</label><input name="email" type="email" required placeholder="you@company.com" /></div>
                <div className="field"><label>Phone</label><input name="phone" placeholder="+91" /></div>
              </div>
              <div className="field"><label>What are you exploring?</label><textarea name="message" rows={4} placeholder="e.g. We want to run a STEM CSR programme in Tamil Nadu for ~500 students…"></textarea></div>
              <button className="btn btn-primary" type="submit">Send enquiry →</button>
            </div>
            {/* loading state */}
            <div className="form-loading" aria-hidden="true">
              <div className="form-spinner"></div>
              <p>Sending your message…</p>
            </div>
            {/* success state */}
            <div className="form-success" aria-hidden="true">
              <div className="form-success-icon">
                <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="26" r="25" stroke="var(--red)" strokeWidth="2" /><path d="M14 26.5l8 8 16-16" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within one business day.</p>
              <p className="form-success-contact">In the meantime, feel free to reach us on <a href="https://wa.me/918075566081" target="_blank" rel="noopener">WhatsApp</a> or at <a href="mailto:info@deleadint.com">info@deleadint.com</a>.</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
