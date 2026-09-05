const logos = [
  ["/assets/logos/institutions/pulliyil.webp", "Partner institution crest"],
  ["/assets/logos/institutions/veembour.webp", "Partner institution crest"],
  ["/assets/logos/institutions/mundothuparamba.webp", "Partner institution crest"],
  ["/assets/logos/institutions/thavanur.webp", "Partner institution crest"],
  ["/assets/logos/institutions/thirkkulam.webp", "Partner institution crest"],
  ["/assets/logos/institutions/aura.png", "Aura Global Schools"],
] as const;
const badges = ["DP World", "Kayzan Group", "RAG Business Hub", "Al Ahalia Group"];

// keep a roughly constant scroll speed regardless of how many items are listed
const DURATION = `${Math.max(24, (logos.length + badges.length) * 3.4)}s`;

function MarqueeSet({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="marquee-track"
      aria-hidden={hidden || undefined}
      style={{ animationDuration: DURATION }}
    >
      {logos.map(([src, alt]) => (
        <img key={src} src={src} alt={hidden ? "" : alt} loading="lazy" />
      ))}
      {badges.map((b) => (
        <span key={b} className="marquee-badge">
          {b}
        </span>
      ))}
    </div>
  );
}

export function AssocMarquee() {
  return (
    <section className="assoc">
      <div className="container">
        <p className="assoc-label">Schools, foundations and companies we&apos;ve worked with</p>
      </div>
      {/* two identical tracks, each scrolls left by exactly its own width
          (-100%) so the loop has no gap-sized jump */}
      <div className="marquee">
        <MarqueeSet />
        <MarqueeSet hidden />
      </div>
    </section>
  );
}
