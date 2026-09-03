import type { ResourceDef } from "@/lib/resources";

/**
 * True iff `resource` legitimately belongs to `verticalDbKey`.
 *
 * This is the boundary the content server actions enforce: a caller with `edit`
 * on one vertical must not be able to mutate another vertical's rows (or a
 * fixed-vertical resource like `blog_posts`) by passing a different `vertical`
 * slug to the action. Kept pure and separate from the `"use server"` module so
 * it can be unit-tested.
 */
export function resourceAllowedInVertical(def: ResourceDef, verticalDbKey: string): boolean {
  return def.verticals.includes(verticalDbKey) || def.fixedVertical === verticalDbKey;
}
