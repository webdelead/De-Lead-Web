import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/html";
import sanitizeHtml from "sanitize-html";
import type { Extensions, JSONContent } from "@tiptap/core";

/**
 * The one TipTap extension set — used by the dashboard editor (client) AND the
 * marketing-site renderer (server). Keeping it here means the JSON the editor
 * writes and the HTML the site produces can't drift.
 *
 * StarterKit: headings, bold/italic/strike, bullet & ordered lists, blockquote,
 * inline code + code blocks, horizontal rule, hard break, undo/redo. No raw
 * HTML, no images/embeds — injection is impossible by construction.
 */
export const tiptapExtensions: Extensions = [StarterKit.configure({ heading: { levels: [2, 3, 4] } })];

export type { JSONContent };

/** An empty TipTap document (what a new post starts from). */
export const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr",
    "h2", "h3", "h4",
    "strong", "em", "s", "del", "code", "pre", "blockquote",
    "ul", "ol", "li",
    "a", "img",
  ],
  allowedAttributes: { a: ["href", "title", "rel", "target"], img: ["src", "alt", "title"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }),
  },
};

/**
 * TipTap/ProseMirror JSON → sanitised HTML string. The editor can't emit raw
 * HTML, so the sanitiser here is defence-in-depth. Returns "" on bad input.
 */
export function renderTiptapHtml(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  try {
    return sanitizeHtml(generateHTML(json as JSONContent, tiptapExtensions), SANITIZE);
  } catch {
    return "";
  }
}
