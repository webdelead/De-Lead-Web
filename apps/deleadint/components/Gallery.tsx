const figs: [string, string, string, string][] = [
  ["g-wide", "/assets/gallery/tc-1.webp", "TinkerChamps camp activity", "TinkerChamps"],
  ["g-tall", "/assets/gallery/w2l-1.webp", "Walk2Lead robotics session", "Walk2Lead"],
  ["", "/assets/gallery/mc-1.webp", "MakerChamps bootcamp", "MakerChamps"],
  ["", "/assets/gallery/corp-1.webp", "Corporate training session", "Corporate Training"],
  ["", "/assets/gallery/tc-2.webp", "TinkerChamps camp activity", "TinkerChamps"],
  ["g-tall", "/assets/gallery/dli-1.webp", "DLI Education classroom", "DLI Education"],
  ["", "/assets/gallery/w2l-2.webp", "Walk2Lead school expo", "Walk2Lead"],
  ["g-wide", "/assets/gallery/mc-3.webp", "MakerChamps prototyping", "MakerChamps"],
  ["", "/assets/gallery/uae-1.webp", "TinkerChamps UAE session", "India & UAE"],
  ["", "/assets/gallery/corp-2.webp", "Corporate training team", "Corporate Training"],
];

export function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Gallery</span>
          <h2>Moments from across the ecosystem</h2>
          <p>
            Camps, robotics labs, boardrooms and school expos: a running record of what &quot;learning
            by doing&quot; actually looks like.
          </p>
        </div>
        <div className="gallery-grid reveal-stagger">
          {figs.map(([cls, src, alt, cap], i) => (
            <figure key={i} className={cls || undefined}>
              <img src={src} alt={alt} loading="lazy" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
