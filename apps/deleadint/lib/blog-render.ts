import "server-only";
import { renderTiptapHtml } from "@delead/shared/tiptap";
import { renderMarkdown } from "@/lib/markdown";

/**
 * Render a journal post body to sanitised HTML.
 * Prefers `body_json` (block editor); falls back to `body_md` for posts written
 * before the editor migration.
 */
export function renderBlogBody(post: { bodyJson?: unknown; bodyMd?: string | null }): string {
  if (post.bodyJson && typeof post.bodyJson === "object") {
    const html = renderTiptapHtml(post.bodyJson);
    if (html) return html;
  }
  return renderMarkdown(post.bodyMd ?? "");
}
