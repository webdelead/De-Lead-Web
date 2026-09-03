"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useBookingModal } from "../context/ModalContext";

export default function Hero() {
  const { openBookingModal } = useBookingModal();
  const { scrollY } = useScroll();

  const yText = useTransform(scrollY, [0, 600], [0, -180]);
  const yCard = useTransform(scrollY, [0, 600], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/assets/images/herobanner.webp"
        alt="Tinker Champs"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* HERO CONTENT */}
      <div className="relative z-10 flex items-end h-full pb-20">
        <div className="w-full px-6 sm:px-8 md:px-12 flex flex-col lg:flex-row items-end justify-between">
          {" "}
          {/* LEFT TEXT */}
          <motion.div style={{ y: yText, opacity }} className="text-white">
            <h1 className="text-4xl  md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
              REWIRING YOUNG MINDS <br />
              <span className="block lg:inline">
                FOR A LIMITLESS{" "}
                <span className="font-covered text-secondary-yellow text-6xl md:text-6xl lg:text-7xl font-bold">
                  Future
                </span>
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-200 max-w-2xl">
              A 3-day premium experiential learning camp that helps students
              from 6th–12th grade think sharper, lead better, and design their
              own future.
            </p>
          </motion.div>
          {/* RIGHT SEASON CARD */}
          <motion.div
            style={{ y: yCard, opacity }}
            className="flex justify-center lg:justify-end mt-10 lg:mt-0 w-full lg:w-auto"
          >
            <button
              onClick={openBookingModal}
              className="w-full lg:w-auto text-left"
            >
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 w-full max-w-md mx-auto lg:mx-0 shadow-md cursor-pointer hover:scale-[1.02] transition">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Logo */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#A313EB] shrink-0 flex items-center justify-center">
                    <Image
                      src="/assets/TCLogo.webp"
                      alt="Tinker Champs"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div className="text-white min-w-0">
                    <p className="text text-white/70 mb-1">New Season</p>

                    <h3 className="text-2xl md:text-3xl font-semibold tracking-wide leading-tight">
                      TINKERCHAMPS
                    </h3>

                    <p className="text-white/80 md:text-lg">INDIA</p>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
