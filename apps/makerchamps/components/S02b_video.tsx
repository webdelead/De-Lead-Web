const YOUTUBE_ID = "Q3OEp6WZn3U";

// No heading, on purpose — same bare-video treatment as TinkerChamps'
// VideoSection, just without its scroll-scale zoom animation.
export function S02b_video() {
  return (
    <section className="section [background:var(--color-mc-white)]">
      <div className="wrap">
        <div className="reveal relative mx-auto aspect-[16/9] w-full max-w-[860px] overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-card)] [background:var(--color-mc-navy-deep)]">
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
            title="MakerChamps"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
