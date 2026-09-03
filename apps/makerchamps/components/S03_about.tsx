export function S03_about() {
  return (
    <>
      <section className="section about" id="about">
        <div className="pattern-bg on-light"></div>
        <div className="container about-grid">
          <div className="section-head reveal">
            <span className="eyebrow">What is MakerChamps</span>
            <h2>Exposure that <span className="italic">widens how they think.</span></h2>
            <p className="lede">Before it's about building anything, MakerChamps is about your child stepping onto a top-ranked engineering campus and realising what's possible. They sit in NIT Calicut's classrooms, walk its labs, and meet the people who research there — an exposure that widens their sense of what they could become. The making, the pitching, the prototypes — that's how they prove it to themselves.</p>
          </div>
          <div className="about-collage reveal">
            <div className="about-photo-main torn">
              <img src="/assets/photos/isro-exhibit-tour.webp" alt="Students on a space-research exhibit tour at NIT Calicut" />
            </div>
            <div className="about-photo-accent torn">
              <img src="/assets/photos/chemistry-lab-handson.webp" alt="Hands-on chemistry session at MakerChamps" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
