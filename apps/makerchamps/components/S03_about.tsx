export function S03_about() {
  return (
    <>
      <section className="section about" id="about">
        <div className="pattern-bg on-light"></div>
        <div className="wrap md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10">
          <div className="section-head reveal !mb-0 md:!max-w-none">
            <span className="eyebrow">What is MakerChamps</span>
            <h2>
              Exposure that <span className="mc-accent">widens how they think.</span>
            </h2>
            <p className="lede">
              Before it&apos;s about building anything, MakerChamps is about your child stepping onto
              a top-ranked engineering campus and realising what&apos;s possible. They sit in NIT
              Calicut&apos;s classrooms, walk its labs, and meet the people who research there — an
              exposure that widens their sense of what they could become. The making, the pitching,
              the prototypes — that&apos;s how they prove it to themselves.
            </p>
          </div>
          <div className="reveal relative mx-auto mt-12 aspect-[4/5] w-full max-w-[170px] md:m-0 md:ml-auto md:mt-0 md:max-w-[320px]">
            <div className="torn absolute left-0 top-0 z-[1] h-[82%] w-[80%] rotate-[-2.5deg]">
              <img
                className="h-full w-full object-cover"
                src="/assets/photos/isro-exhibit-tour.webp"
                alt="Students on a space-research exhibit tour at NIT Calicut"
              />
            </div>
            <div className="torn absolute bottom-0 right-0 z-[2] h-[50%] w-[54%] rotate-[5deg]">
              <img
                className="h-full w-full object-cover"
                src="/assets/photos/chemistry-lab-handson.webp"
                alt="Hands-on chemistry session at MakerChamps"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
