const squiggle = (
  <svg viewBox="0 0 64 16" fill="none">
    <path
      d="M1 8c6-8 12 8 18 0s12 8 18 0 12 8 18 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-polaroids">
        <figure className="polaroid p1">
          <img src="/assets/gallery/mc-2.webp" alt="" />
          <figcaption>MakerChamps</figcaption>
          <a className="polaroid-link" href="#makerchamps" aria-label="Explore MakerChamps"></a>
        </figure>
        <figure className="polaroid p2">
          <img src="/assets/gallery/w2l-2.webp" alt="" />
          <figcaption>Walk2Lead</figcaption>
          <a
            className="polaroid-link"
            href="https://w2l.deleadint.com"
            target="_blank"
            rel="noopener"
            aria-label="Visit the Walk2Lead website"
          ></a>
        </figure>
        <figure className="polaroid p3">
          <img src="/assets/gallery/corp-2.webp" alt="" />
          <figcaption>Corporate Training</figcaption>
          <a className="polaroid-link" href="#corporate" aria-label="Explore Corporate Training"></a>
        </figure>
        <figure className="polaroid p4">
          <img src="/assets/gallery/tc-1.webp" alt="" />
          <figcaption>TinkerChamps</figcaption>
          <a
            className="polaroid-link"
            href="https://tinkerchamps.deleadint.com"
            target="_blank"
            rel="noopener"
            aria-label="Visit the TinkerChamps website"
          ></a>
        </figure>
      </div>

      <div className="hero-inner container">
        <div className="hero-top">
          <span className="hero-accent" aria-hidden="true">
            {squiggle}
          </span>
          <span className="eyebrow on-dark">Education &middot; Technology &middot; Leadership</span>
          <span className="hero-accent" aria-hidden="true">
            {squiggle}
          </span>
        </div>
        <h1 className="reveal in">
          Where learning is <em>lived</em>, not lectured.
        </h1>
        <div className="hero-actions reveal in">
          <a href="#ecosystem" className="btn btn-cream">
            See the ecosystem
            <span className="btn-ring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </a>
          <a href="#contact" className="btn btn-ghost on-dark">
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
}
