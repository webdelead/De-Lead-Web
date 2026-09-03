import { getPosts } from "@/lib/content";

const FALLBACK: Record<string, string> = {
  "DLI Foundation": "/assets/images/card-walk2lead.jpg",
  TinkerChamps: "/assets/gallery/tc-4.webp",
  MakerChamps: "/assets/gallery/mc-1.webp",
  "DLI Education": "/assets/gallery/dli-2.webp",
  "Corporate Training": "/assets/gallery/corp-2.webp",
};

export async function Journal() {
  const posts = await getPosts();

  return (
    <section className="blog" id="blog">
      <div className="container">
        <div className="blog-head reveal">
          <div>
            <span className="eyebrow">The Journal</span>
            <h2>Field notes</h2>
            <p>
              A running record of dispatches from each vertical: program updates, case studies and
              lessons from the field.
            </p>
          </div>
        </div>

        <div className="blog-row-wrap reveal">
          <div className="blog-index">
            <span className="blog-index-num">{String(posts.length).padStart(3, "0")}</span>
            <div className="blog-dots">
              {posts.map((_, i) => (
                <span key={i} className={i === 0 ? "active" : undefined}></span>
              ))}
            </div>
          </div>
          <div className="blog-row">
            {posts.map((p) => (
              <a key={p.id} href={`/journal/${p.slug}`} className="blog-card2">
                <div className="bc-media">
                  <img src={p._url || FALLBACK[p.tag] || "/assets/gallery/tc-4.webp"} alt={p.title} loading="lazy" />
                </div>
                <span className="bc-tag">{p.tag}</span>
                <h4>{p.title}</h4>
                <span className="bc-meta">
                  {p.publishedAt
                    ? new Date(p.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
                <p>{p.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
