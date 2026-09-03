import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <Image
        src="/assets/TCLogoS22.svg"
        alt="TinkerChamps"
        width={150}
        height={48}
        className="mb-2 h-10 w-auto"
      />
      <p className="font-covered text-[clamp(96px,22vw,200px)] leading-none text-secondary-yellow">
        404
      </p>
      <h1 className="text-[clamp(22px,4vw,34px)] font-bold">This page went off exploring</h1>
      <p className="max-w-[46ch] text-base leading-relaxed text-secondary-light">
        The page you&rsquo;re looking for doesn&rsquo;t exist. Head back and see what a TinkerChamps
        camp actually looks like.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary-yellow px-7 py-3 font-semibold text-secondary-dark transition-transform hover:-translate-y-0.5"
      >
        Back to home
      </Link>
    </main>
  );
}
