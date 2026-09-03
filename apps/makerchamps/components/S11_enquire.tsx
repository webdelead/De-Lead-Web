export function S11_enquire() {
  return (
    <>
      <section className="section cta" id="enquire">
        <div className="container cta-inner">
          <div className="reveal">
            <span className="eyebrow" style={{ color: "var(--mc-lime)" }}>Only 60 seats per season</span>
            <h2 className="section-head" style={{ marginBottom: "0" }}>Give them two days that <span className="italic">change how they see themselves</span></h2>
            <p className="lede" style={{ marginTop: "14px", maxWidth: "48ch" }}>Reach out directly, or leave your details and our team will call you back.</p>
            <div className="cta-quick" style={{ marginTop: "28px" }}>
              <a href="https://wa.me/918075566081?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20MakerChamps" className="btn btn-whatsapp" target="_blank" rel="noopener">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A7.85 7.85 0 0012.05 4a7.94 7.94 0 00-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 003.85 1h.01a7.94 7.94 0 007.94-7.94 7.9 7.9 0 00-2.4-5.64zm-5.55 12.2a6.6 6.6 0 01-3.36-.92l-.24-.14-2.5.65.67-2.44-.16-.25a6.6 6.6 0 1112.28-3.5 6.6 6.6 0 01-6.69 6.6zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.45.1-.53.64-.65.77-.24.15-.44.05a5.4 5.4 0 01-1.6-.99 6 6 0 01-1.1-1.37c-.12-.2 0-.3.09-.4.09-.1.2-.24.3-.36.1-.12.13-.2.2-.34.07-.14.03-.26-.02-.36s-.45-1.08-.62-1.48c-.16-.39-.33-.34-.45-.34h-.38a.73.73 0 00-.53.25c-.18.2-.7.68-.7 1.66s.72 1.93.82 2.06c.1.14 1.4 2.14 3.4 3 .48.2.85.33 1.14.42.48.15.92.13 1.26.08.39-.06 1.17-.48 1.34-.94.16-.46.16-.86.11-.94-.05-.08-.18-.13-.38-.23z" /></svg>
                WhatsApp Us
              </a>
              <a href="mailto:info@deleadint.com?subject=MakerChamps%20Enquiry" className="btn btn-light">Email Us</a>
            </div>
            <p style={{ marginTop: "24px", fontSize: "0.85rem", opacity: "0.7" }}>
              Or call India <strong>+91 807 556 6081</strong>
            </p>
          </div>
      
          <form data-lead-source="makerchamps" className="cta-form reveal" id="enquiryForm">
            <h3>Enquire about the next season</h3>
            <div className="form-row">
              <div className="field">
                <label htmlFor="parentName">Parent's Name</label>
                <input type="text" id="parentName" name="parentName" required />
              </div>
              <div className="field">
                <label htmlFor="childClass">Child's Class</label>
                <select id="childClass" name="childClass" required defaultValue="">
                  <option value="" disabled>Select class</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className="field">
                <label htmlFor="message">Message (optional)</label>
                <textarea id="message" name="message" rows={3}></textarea>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Send Enquiry</button>
            <p className="form-note">We'll get back to you within 24 hours. No spam, ever.</p>
            <div className="form-success" id="formSuccess">Thanks! We've got your details and will call you back within 24 hours.</div>
          </form>
        </div>
      </section>
    </>
  );
}
