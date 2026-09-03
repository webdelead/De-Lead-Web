import test from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../utils.ts";

test("keeps same-origin relative paths", () => {
  assert.equal(safeNext("/leads"), "/leads");
  assert.equal(safeNext("/c/walk2lead/testimonials?x=1"), "/c/walk2lead/testimonials?x=1");
  assert.equal(safeNext("/a#frag"), "/a#frag");
});

test("rejects absolute / protocol-relative / backslash targets", () => {
  assert.equal(safeNext("https://evil.example"), "/");
  assert.equal(safeNext("//evil.example"), "/");
  assert.equal(safeNext("/\\evil.example"), "/");
  assert.equal(safeNext("http://evil"), "/");
  assert.equal(safeNext("javascript:alert(1)"), "/");
});

test("empty / nullish falls back", () => {
  assert.equal(safeNext(undefined), "/");
  assert.equal(safeNext(null), "/");
  assert.equal(safeNext(""), "/");
  assert.equal(safeNext("", "/reset-password"), "/reset-password");
});
