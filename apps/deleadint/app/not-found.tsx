import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | De' Lead International" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-[22px] [padding:64px_24px] text-center [background:var(--color-cream)] [color:var(--color-ink)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/logo-delead-dark.png"
        alt="De' Lead International"
        className="mb-2 h-[34px] w-auto"
      />
      <p className="m-0 [font-family:var(--font-lora),Georgia,serif] font-bold tracking-[-0.02em] leading-none [font-size:clamp(88px,18vw,180px)] [color:var(--color-magenta)]">
        404
      </p>
      <h1 className="m-0 [font-family:var(--font-lora),Georgia,serif] font-semibold [font-size:clamp(22px,4vw,32px)]">
        This page wandered off
      </h1>
      <p className="m-0 max-w-[44ch] text-[1.02rem] leading-[1.65] [color:var(--color-ink-soft)]">
        The page you&rsquo;re after doesn&rsquo;t exist or has moved. Let&rsquo;s get you back to the
        De&rsquo; Lead ecosystem.
      </p>
      <div className="mt-1.5 flex flex-wrap justify-center gap-3">
        <Link className="btn btn-primary" href="/">
          Back to home
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
        <Link className="btn btn-ghost" href="/#ecosystem">
          Explore the ecosystem
        </Link>
      </div>
    </main>
  );
}
