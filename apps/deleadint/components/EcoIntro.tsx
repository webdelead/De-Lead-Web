export function EcoIntro() {
  return (
    <section className="eco-intro">
      <span className="eco-arc" aria-hidden="true">
        <svg viewBox="0 0 220 480" fill="none">
          <path
            d="M210 10C120 60 40 160 40 260s70 180 150 210"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 10"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <div className="container eco-intro-inner reveal">
        <span className="eco-script">Six verticals, one idea</span>
        <h2 className="eco-h2">
          Climb the ecosystem
          <br />
          with us!
        </h2>
        <p>
          Each vertical wears its own name, its own logo, its own colours. All of them exist because
          we think people learn by doing, not by being told.
        </p>
        <a href="#corporate" className="circle-cta eco-glow">
          <span>START</span>
          <span>EXPLORING</span>
        </a>
      </div>
    </section>
  );
}
