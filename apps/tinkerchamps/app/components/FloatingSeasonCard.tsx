"use client";

import Image from "next/image";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useBookingModal } from "../context/ModalContext";

/* Was the hero's own "New Season" card (see HeroSection.tsx history) — moved
 * out to the layout so it can be `position: fixed` to the viewport. A fixed
 * element inside the hero's motion.div wouldn't actually stay put: framer
 * motion sets an inline `transform` on that div, and any CSS transform on an
 * ancestor turns `position: fixed` descendants into `position: absolute`
 * ones instead (a CSS containing-block rule, not a framer-motion quirk).
 *
 * lg+: the full card, now with its own "Register Now" button.
 * Below lg: just a compact "Register Now" pill — no room/need for the card. */
export default function FloatingSeasonCard() {
  const { openBookingModal } = useBookingModal();

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Full card — desktop/tablet */}
      <div className="hidden lg:block w-full max-w-xs backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#A313EB] shrink-0 flex items-center justify-center">
            <Image
              src="/assets/TCLogo.webp"
              alt="Tinker Champs"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="text-white min-w-0">
            <p className="text-sm text-white/70 mb-0.5">New Season</p>
            <h3 className="text-xl font-semibold tracking-wide leading-tight">
              TINKERCHAMPS
            </h3>
            <p className="text-white/80 text-sm">INDIA</p>
          </div>
        </div>
        <button
          onClick={openBookingModal}
          className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary-yellow text-primary-purple font-bold text-sm hover:brightness-95 transition"
        >
          Register Now <IoChevronForwardOutline className="text-lg" />
        </button>
      </div>

      {/* Compact pill — mobile/tablet */}
      <button
        onClick={openBookingModal}
        className="lg:hidden flex items-center gap-2 px-6 py-3 rounded-full bg-secondary-yellow text-primary-purple font-bold text-sm shadow-lg hover:brightness-95 transition"
      >
        Register Now <IoChevronForwardOutline className="text-lg" />
      </button>
    </div>
  );
}
