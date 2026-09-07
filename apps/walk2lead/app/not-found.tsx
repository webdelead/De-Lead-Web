import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found — Walk2Lead" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-[22px] bg-cream px-6 py-16 text-center text-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/walk2lead-logo.svg" alt="Walk2Lead" className="mb-2 h-[30px] w-auto" />
      <p className="m-0 font-serif text-[clamp(88px,18vw,180px)] font-bold leading-none tracking-[-0.02em] text-w2l">
        404
      </p>
      <h1 className="m-0 font-serif text-[clamp(22px,4vw,32px)] font-semibold">
        This page took a wrong turn
      </h1>
      <p className="m-0 max-w-[44ch] text-[1.02rem] leading-[1.65] text-ink-soft">
        The page you&rsquo;re looking for isn&rsquo;t here. Head back to the Walk2Lead story and the
        numbers behind it.
      </p>
      <div className="mt-1.5 flex flex-wrap justify-center gap-3">
        <Link className="btn btn-primary" href="/">
          Back to home
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }} aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
        <Link className="btn btn-ghost" href="/#partner">
          Partner with us
        </Link>
      </div>
    </main>
  );
}
