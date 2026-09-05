import Link from "next/link";

/** Fallback 404 for unmatched top-level URLs (outside the app shell — e.g. a
 *  stray link before auth). Branded so it doesn't look broken. Most 404s inside
 *  the app hit app/(app)/not-found.tsx instead and keep the sidebar. */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <div className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/delead-mark.svg" alt="" className="h-7 w-7" />
        <span>
          De&apos; Lead <span className="text-muted-foreground">Admin</span>
        </span>
      </div>
      <p className="text-6xl font-semibold leading-none tracking-tight text-muted-foreground/25">
        404
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">This page could not be found.</p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Open the dashboard &rarr;
      </Link>
    </div>
  );
}
