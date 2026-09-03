import test from "node:test";
import assert from "node:assert/strict";
import { renderTiptapHtml, EMPTY_DOC } from "@delead/shared/tiptap";

const doc = (content: unknown[]) => ({ type: "doc", content });

test("renders headings, marks and lists", () => {
  const html = renderTiptapHtml(
    doc([
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Title" }] },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "bold ", marks: [{ type: "bold" }] },
          { type: "text", text: "plain" },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [{ type: "paragraph", content: [{ type: "text", text: "one" }] }],
          },
        ],
      },
    ]),
  );
  assert.match(html, /<h2>Title<\/h2>/);
  assert.match(html, /<strong>bold <\/strong>/);
  assert.match(html, /<ul><li><p>one<\/p><\/li><\/ul>/);
});

test("links get rel/target and only safe schemes survive", () => {
  const html = renderTiptapHtml(
    doc([
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "ok",
            marks: [{ type: "link", attrs: { href: "https://x.test" } }],
          },
          {
            type: "text",
            text: "bad",
            marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
          },
        ],
      },
    ]),
  );
  assert.match(html, /<a [^>]*href="https:\/\/x\.test"[^>]*>ok<\/a>/);
  assert.match(html, /<a [^>]*rel="nofollow noopener noreferrer"[^>]*>ok<\/a>/);
  assert.doesNotMatch(html, /javascript:/);
});

test("empty / bad input renders empty string", () => {
  assert.equal(renderTiptapHtml(null), "");
  assert.equal(renderTiptapHtml("not a doc"), "");
  assert.equal(renderTiptapHtml({}), "");
});

test("an empty doc renders to an empty paragraph", () => {
  assert.equal(renderTiptapHtml(EMPTY_DOC), "<p></p>");
});
