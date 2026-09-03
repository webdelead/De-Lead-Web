import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitise a `?next=` redirect target. Only same-origin relative paths are
 * allowed — anything absolute (`https://…`), protocol-relative (`//evil`),
 * back-slashed, or otherwise off-origin falls back to `fallback`.
 */
export function safeNext(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  // must be a single leading slash, not "//" or "/\"
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  try {
    // resolve against an arbitrary origin; reject if it escapes the path or host
    const u = new URL(value, "https://x.invalid");
    if (u.origin !== "https://x.invalid") return fallback;
    return u.pathname + u.search + u.hash;
  } catch {
    return fallback;
  }
}
