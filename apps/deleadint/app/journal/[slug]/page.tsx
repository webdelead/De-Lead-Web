import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReadDb, blogPosts, eq } from "@delead/db";
import { getPost } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;

export async function generateStaticParams() {
  const db = getReadDb();
  const rows = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));
  return rows.map((r) => ({ slug: r.slug }));
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
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.bodyMd || "");
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <Nav />
      <article className="journal-article container">
        <a href="/#blog" className="journal-back">
          &larr; The Journal
        </a>
        <span className="bc-tag">{post.tag}</span>
        <h1>{post.title}</h1>
        <p className="journal-meta">
          {post.authorName}
          {date && ` · ${date}`}
        </p>
        {post._url && <img className="journal-cover" src={post._url} alt="" />}
        <div className="journal-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <Footer />

      <style>{`
        .journal-article{max-width:720px;margin:0 auto;padding:140px 28px 100px;}
        .journal-back{display:inline-block;margin-bottom:24px;font-weight:600;font-size:.9rem;color:var(--magenta);}
        .journal-article .bc-tag{font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--magenta);display:block;margin-bottom:8px;}
        .journal-article h1{font-family:'Instrument Sans',system-ui,sans-serif;font-weight:600;font-size:clamp(2rem,4vw,3rem);line-height:1.12;letter-spacing:-.01em;}
        .journal-meta{margin-top:12px;color:var(--ink-soft);font-size:.9rem;}
        .journal-cover{width:100%;border-radius:22px;margin:32px 0;}
        .journal-body{margin-top:24px;}
        .journal-body p{margin:1rem 0;line-height:1.75;color:var(--ink-soft);}
        .journal-body h2{font-family:'Instrument Sans',system-ui,sans-serif;font-size:1.6rem;margin:2rem 0 .5rem;color:var(--ink);}
        .journal-body strong{color:var(--ink);}
        .journal-body a{color:var(--magenta);text-decoration:underline;}
      `}</style>
    </>
  );
}
