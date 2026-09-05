import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;

const DESC =
  "Field notes from across the De' Lead ecosystem: program updates, case studies and lessons from the field.";

export const metadata: Metadata = {
  title: "The Journal | De' Lead International",
  description: DESC,
  alternates: { canonical: "/journal" },
  openGraph: { title: "The Journal | De' Lead International", description: DESC, type: "website" },
};

const FALLBACK: Record<string, string> = {
  "DLI Foundation": "/assets/images/card-walk2lead.jpg",
  TinkerChamps: "/assets/stock/tc-4.webp",
  MakerChamps: "/assets/stock/mc-1.webp",
  "DLI Education": "/assets/stock/dli-2.webp",
  "Corporate Training": "/assets/stock/corp-2.webp",
};

function fmtDate(d: unknown) {
  if (!d) return "";
  return new Date(d as string).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JournalIndex() {
  const posts = await getAllPosts();

  return (
    <>
      <Nav home={false} />

      <header className="jr-hero">
        <div className="container">
          <span className="eyebrow on-dark">The Journal</span>
          <h1>Field notes</h1>
          <p>
            A running record of dispatches from across the De&rsquo; Lead ecosystem &mdash;
            program updates, case studies and lessons from the field.
          </p>
        </div>
      </header>

      <main className="jr-index container">
        {posts.length === 0 ? (
          <p className="jr-empty">No posts published yet. Check back soon.</p>
        ) : (
          <div className="jr-grid">
            {posts.map((p) => (
              <a key={p.id} href={`/journal/${p.slug}`} className="jr-card">
                <span className="jr-card-media">
                  <img
                    src={p._url || FALLBACK[p.tag] || "/assets/stock/tc-4.webp"}
                    alt=""
                    loading="lazy"
                  />
                </span>
                <span className="jr-card-tag">{p.tag}</span>
                <span className="jr-card-title">{p.title}</span>
                <span className="jr-card-meta">
                  {p.authorName}
                  {p.publishedAt ? ` · ${fmtDate(p.publishedAt)}` : ""}
                </span>
                <span className="jr-card-excerpt">{p.excerpt}</span>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
