import test from "node:test";
import assert from "node:assert/strict";
import { canAccess, visibleVerticals, isSuperAdmin, type Session } from "../rbac.ts";

const superAdmin: Session = {
  user: { id: "1", email: "a@x", name: "A", role: "super_admin", grants: [] },
};
const staff = (grants: { vertical: string; level: "view" | "edit" }[]): Session => ({
  user: { id: "2", email: "b@x", name: "B", role: "staff", grants },
});

test("super admin: everything", () => {
  assert.equal(isSuperAdmin(superAdmin), true);
  assert.equal(canAccess(superAdmin, "walk2lead", "edit"), true);
  assert.ok(visibleVerticals(superAdmin, "edit").includes("tinkerchamps"));
});

test("staff: only granted verticals, view vs edit", () => {
  const s = staff([
    { vertical: "walk2lead", level: "edit" },
    { vertical: "makerchamps", level: "view" },
  ]);
  assert.equal(isSuperAdmin(s), false);
  assert.equal(canAccess(s, "walk2lead", "edit"), true);
  assert.equal(canAccess(s, "walk2lead", "view"), true);
  assert.equal(canAccess(s, "makerchamps", "view"), true);
  assert.equal(canAccess(s, "makerchamps", "edit"), false); // view-only grant
  assert.equal(canAccess(s, "deleadint", "view"), false); // no grant
});

test("staff with no grants sees nothing", () => {
  const s = staff([]);
  assert.deepEqual(visibleVerticals(s, "view"), []);
  assert.equal(canAccess(s, "deleadint", "view"), false);
});

test("visibleVerticals(edit) drops view-only grants", () => {
  const s = staff([
    { vertical: "walk2lead", level: "edit" },
    { vertical: "makerchamps", level: "view" },
  ]);
  assert.deepEqual(visibleVerticals(s, "view").sort(), ["makerchamps", "walk2lead"]);
  assert.deepEqual(visibleVerticals(s, "edit"), ["walk2lead"]);
});
