export function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-panel reveal">
          <div className="about-copy about-copy-top">
            <span className="eyebrow">About Us</span>
            <h2>An education segment, reforming itself</h2>
            <p>
              Founded in 2022, De&rsquo; Lead International is a trailblazer in reshaping education,
              moving beyond traditional classrooms with technology-driven programmes, career
              mentoring, leadership development and corporate training.
            </p>
            <p>
              We understand the concerns of students, parents and professionals in a rapidly
              changing world. With experienced mentors and a hands-on philosophy, we deliver quality
              education across both online and offline modes, empowering learners to become agents of
              social impact, not just exam-takers.
            </p>
            <a href="#ecosystem" className="link-arrow about-cta">
              See how our verticals work together
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </a>
          </div>

          <div className="method-rows">
            <div className="method-row mr-1">
              <span className="mr-num">01</span>
              <div className="mr-copy">
                <h4>Our Mission</h4>
                <p>
                  To make learning experiential and future-ready, equipping students and
                  professionals with the technology, leadership and life skills a rapidly changing
                  world actually asks for, not just a syllabus.
                </p>
              </div>
            </div>
            <div className="method-row mr-2">
              <span className="mr-num">02</span>
              <div className="mr-copy">
                <h4>Our Vision</h4>
                <p>
                  To be the region&apos;s most trusted education-innovation partner, carrying that
                  same hands-on philosophy from one classroom in Kozhikode to camps, CSR programmes
                  and corporate tracks across India and the UAE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
