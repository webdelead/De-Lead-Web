import test from "node:test";
import assert from "node:assert/strict";
import { toCsv } from "../csv.ts";

test("empty rows still emit the header", () => {
  assert.equal(toCsv([], ["a", "b"]), "a,b");
  assert.equal(toCsv([]), "");
});

test("plain values pass through unquoted", () => {
  assert.equal(toCsv([{ a: "x", b: "1" }], ["a", "b"]), "a,b\nx,1");
});

test("quotes / commas / newlines are quoted and escaped", () => {
  assert.equal(toCsv([{ a: 'he said "hi"' }], ["a"]), 'a\n"he said ""hi"""');
  assert.equal(toCsv([{ a: "a,b" }], ["a"]), 'a\n"a,b"');
  assert.equal(toCsv([{ a: "line1\nline2" }], ["a"]), 'a\n"line1\nline2"');
});

test("formula-injection cells are neutralised with a leading quote", () => {
  for (const bad of ["=1+1", "+1", "-1", "@x", "=HYPERLINK(1,2)"]) {
    const out = toCsv([{ a: bad }], ["a"]);
    assert.equal(out, `a\n"'${bad}"`, `should neutralise ${bad}`);
  }
});

test("Date values serialise to ISO", () => {
  const d = new Date("2026-09-03T00:00:00.000Z");
  assert.equal(toCsv([{ a: d }], ["a"]), "a\n2026-09-03T00:00:00.000Z");
});
