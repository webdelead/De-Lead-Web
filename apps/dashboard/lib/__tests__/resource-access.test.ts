import test from "node:test";
import assert from "node:assert/strict";
import { resourceAllowedInVertical } from "../resource-access.ts";

// Uses Node's built-in test runner (no extra deps): `pnpm --filter @delead/dashboard test`.
// Fixtures are minimal — the function only reads `verticals` + `fixedVertical`.
type Def = Parameters<typeof resourceAllowedInVertical>[0];
const def = (verticals: string[], fixedVertical?: string) =>
  ({ verticals, fixedVertical }) as unknown as Def;

const ALL = ["deleadint", "walk2lead", "makerchamps", "corporate", "dli_education", "tinkerchamps"];

test("shared resource is allowed only in its listed verticals", () => {
  const d = def(["deleadint", "walk2lead"]);
  assert.equal(resourceAllowedInVertical(d, "deleadint"), true);
  assert.equal(resourceAllowedInVertical(d, "walk2lead"), true);
  assert.equal(resourceAllowedInVertical(d, "makerchamps"), false);
  assert.equal(resourceAllowedInVertical(d, "tinkerchamps"), false);
});

test("fixed-vertical resource (e.g. blog_posts) is that one vertical only", () => {
  const blog = def(["deleadint"], "deleadint");
  assert.equal(resourceAllowedInVertical(blog, "deleadint"), true);
  for (const v of ALL.filter((v) => v !== "deleadint")) {
    assert.equal(resourceAllowedInVertical(blog, v), false, `must reject ${v}`);
  }
});

test("fixedVertical alone (no verticals list) still gates correctly", () => {
  const courses = def([], "dli_education");
  assert.equal(resourceAllowedInVertical(courses, "dli_education"), true);
  assert.equal(resourceAllowedInVertical(courses, "walk2lead"), false);
});

test("a resource with no verticals is never writable", () => {
  const orphan = def([]);
  for (const v of ALL) assert.equal(resourceAllowedInVertical(orphan, v), false);
});
