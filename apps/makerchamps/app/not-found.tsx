import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found — MakerChamps" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-5 [padding:64px_24px] text-center [background:var(--color-mc-navy)] [color:var(--color-mc-white)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/brand/makerchamps-logo-on-dark.webp"
        alt="MakerChamps"
        className="mb-1.5 h-10 w-auto"
      />
      <p className="m-0 [font-family:var(--font-anton)] [font-size:clamp(96px,20vw,200px)] leading-[0.9] tracking-[0.02em] [color:var(--color-mc-lime)]">
        404
      </p>
      <h1 className="m-0 [font-family:var(--font-bricolage)] font-bold [font-size:clamp(22px,4vw,34px)]">
        Nothing to build here
      </h1>
      <p className="m-0 max-w-[46ch] text-[1.02rem] leading-[1.65] [color:rgba(255,255,255,0.72)]">
        This page doesn&rsquo;t exist. Head back and see what two days on the NIT Calicut campus
        actually looks like.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link className="btn btn-primary" href="/">
          Back to home
        </Link>
        <Link
          className="btn [border:1.5px_solid_rgba(255,255,255,0.35)] [color:#fff] [background:transparent]"
          href="/#enquire"
        >
          Enquire about a seat
        </Link>
      </div>
    </main>
  );
}
