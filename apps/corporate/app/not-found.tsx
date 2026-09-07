import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found · Corporate Training" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-5 [background:var(--color-cream)] px-6 py-16 text-center text-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo/logo-delead-dark.png"
        alt="De' Lead International"
        className="mb-2 h-[30px] w-auto"
      />
      <p className="m-0 [font-family:var(--font-instrument)] font-semibold tracking-[-0.03em] leading-none text-magenta [font-size:clamp(92px,18vw,190px)]">
        404
      </p>
      <h1 className="m-0 [font-family:var(--font-instrument)] font-semibold tracking-[-0.025em] [font-size:clamp(22px,4vw,34px)]">
        This page is off the agenda
      </h1>
      <p className="m-0 max-w-[46ch] text-[1.02rem] leading-[1.65] text-ink-soft">
        The page you&rsquo;re after doesn&rsquo;t exist. Head back to see how we run leadership and
        team-building for organisations across India and the UAE.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link className="btn btn-primary" href="/">
          Back to home
        </Link>
        <Link className="btn btn-ghost" href="/#contact">
          Book a session
        </Link>
      </div>
    </main>
  );
}
