import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getReadDb, blogPosts, eq } from "@delead/db";
import { getPost, getAllPosts } from "@/lib/content";
import { renderBlogBody } from "@/lib/blog-render";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;

// used for cover / thumbnails when a post has no image set in the dashboard
const IMG_FALLBACK: Record<string, string> = {
  "DLI Foundation": "/assets/images/card-walk2lead.jpg",
  TinkerChamps: "/assets/stock/tc-4.webp",
  MakerChamps: "/assets/stock/mc-1.webp",
  "DLI Education": "/assets/stock/dli-2.webp",
  "Corporate Training": "/assets/stock/corp-2.webp",
};
const imgFor = (p: { _url?: string | null; tag: string }) =>
  p._url || IMG_FALLBACK[p.tag] || "/assets/stock/tc-4.webp";

const fmtDate = (d: unknown) =>
  d
    ? new Date(d as string).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

export async function generateStaticParams() {
  try {
    const db = getReadDb();
    const rows = await db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    // no DB at build time (CI / preview) — pages render on-demand via ISR
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | De' Lead Journal`,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post._url ? [post._url] : undefined,
    },
  };
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getAllPosts()]);
  if (!post) notFound();

  const html = renderBlogBody(post);
  const date = fmtDate(post.publishedAt);
  const cover = imgFor(post);
  const recent = all.filter((p) => p.slug !== slug).slice(0, 5);

  return (
    <>
      <Nav home={false} />

      <header
        className="jr-post-hero"
        style={{ "--cover": `url("${cover}")` } as CSSProperties}
      >
        <div className="container jr-post-hero-inner">
          <a href="/journal" className="jr-back">
            &larr; The Journal
          </a>
          <span className="jr-post-tag">{post.tag}</span>
          <h1>{post.title}</h1>
          <p className="jr-post-meta">
            {post.authorName}
            {date && ` · ${date}`}
          </p>
        </div>
      </header>

      <div className="container jr-post-layout">
        <main className="jr-post-body" dangerouslySetInnerHTML={{ __html: html }} />

        <aside className="jr-post-aside">
          <div className="jr-aside-inner">
            <h2 className="jr-aside-title">More field notes</h2>
            {recent.length === 0 ? (
              <p className="jr-aside-empty">Nothing else yet.</p>
            ) : (
              <ul className="jr-aside-list">
                {recent.map((p) => (
                  <li key={p.id}>
                    <a href={`/journal/${p.slug}`} className="jr-aside-item">
                      <span className="jr-aside-thumb">
                        <img src={imgFor(p)} alt="" loading="lazy" />
                      </span>
                      <span className="jr-aside-body">
                        <span className="jr-aside-tag">{p.tag}</span>
                        <span className="jr-aside-name">{p.title}</span>
                        <span className="jr-aside-date">{fmtDate(p.publishedAt)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <a href="/journal" className="jr-aside-all">
              All field notes &rarr;
            </a>
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}
