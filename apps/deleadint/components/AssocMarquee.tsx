const logos = [
  ["/assets/logos/institutions/pulliyil.webp", "Partner institution crest"],
  ["/assets/logos/institutions/veembour.webp", "Partner institution crest"],
  ["/assets/logos/institutions/mundothuparamba.webp", "Partner institution crest"],
  ["/assets/logos/institutions/thavanur.webp", "Partner institution crest"],
  ["/assets/logos/institutions/thirkkulam.webp", "Partner institution crest"],
  ["/assets/logos/institutions/aura.png", "Aura Global Schools"],
] as const;
const badges = ["DP World", "Kayzan Group", "RAG Business Hub", "Al Ahalia Group"];

export function AssocMarquee() {
  return (
    <section className="assoc">
      <div className="container">
        <p className="assoc-label">Schools, foundations and companies we&apos;ve worked with</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {logos.map(([src, alt]) => (
            <img key={src} src={src} alt={alt} loading="lazy" />
          ))}
          {badges.map((b) => (
            <span key={b} className="marquee-badge">
              {b}
            </span>
          ))}
          {/* duplicate for seamless loop */}
          {logos.map(([src]) => (
            <img key={`d-${src}`} src={src} alt="" aria-hidden="true" loading="lazy" />
          ))}
          {badges.map((b) => (
            <span key={`d-${b}`} className="marquee-badge" aria-hidden="true">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
