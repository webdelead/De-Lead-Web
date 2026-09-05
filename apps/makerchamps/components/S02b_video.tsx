const YOUTUBE_ID = "Q3OEp6WZn3U";

// No heading, on purpose — same bare-video treatment as TinkerChamps'
// VideoSection, just without its scroll-scale zoom animation (this site's
// animation budget is CSS + main.js only, see CLAUDE.md).
export function S02b_video() {
  return (
    <section className="section video-feature">
      <div className="container">
        <div className="video-feature-frame reveal">
          <iframe
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
