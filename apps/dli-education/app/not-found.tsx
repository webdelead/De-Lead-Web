import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found: DLI Education" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-5 [padding:64px_24px] text-center [background:var(--color-dli-bg)] [color:var(--color-dli-ink)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/logo-delead-dark.png"
        alt="De' Lead International"
        className="mb-2 h-[30px] w-auto"
      />
      <p className="m-0 [font-family:var(--font-poppins)] font-extrabold tracking-[-0.03em] leading-none [font-size:clamp(92px,18vw,190px)] [color:var(--color-dli-coral)]">
        404
      </p>
      <h1 className="m-0 [font-family:var(--font-poppins)] font-bold [font-size:clamp(22px,4vw,32px)]">
        This lesson doesn&rsquo;t exist
      </h1>
      <p className="m-0 max-w-[46ch] text-[1.02rem] leading-[1.65] [color:var(--color-dli-ink-soft)]">
        The page you&rsquo;re after isn&rsquo;t here. Head back to the DLI Education catalogue for
        students and working professionals.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link className="btn btn-magenta" href="/">
          Back to home
        </Link>
        <Link className="btn btn-outline" href="/students">
          Browse courses
        </Link>
      </div>
    </main>
  );
}
