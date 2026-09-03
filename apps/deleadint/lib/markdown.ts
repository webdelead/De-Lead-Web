import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Render journal Markdown to sanitised HTML.
 *
 * `marked` does not strip raw HTML, and `body_md` is authored in the dashboard,
 * so the output is passed through `sanitize-html` with a conservative allow-list
 * before it reaches `dangerouslySetInnerHTML`: no `<script>`, `<iframe>`,
 * `<style>`, event handlers, `javascript:` URLs, inline styles, etc.
 *
 * NOTE: interim measure. The decided end-state is a block / rich-text editor
 * (structured content, not free HTML) — see the audit's Phase 4.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr",
    "h2", "h3", "h4",
    "strong", "em", "del", "code", "pre", "blockquote",
    "ul", "ol", "li",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "nofollow noopener noreferrer",
    }),
  },
};

export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md ?? "", { async: false }) as string;
  return sanitizeHtml(rawHtml, OPTIONS);
}
