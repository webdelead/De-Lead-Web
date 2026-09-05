"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";

export interface Testimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatar: string;
}

export default function TestimonialSection({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.4 });

  const count = testimonials.length;

  const next = () => {
    if (count) setActive((prev) => (prev + 1) % count);
  };

  const prev = () => {
    if (count) setActive((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  /* AUTO SLIDE (PAUSE ON HOVER & OFFSCREEN) */
  useEffect(() => {
    if (isPaused || !isInView || !count) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isInView, count]);

  /* VIDEO PLAY / PAUSE WHEN VISIBLE */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isInView) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isInView]);

  /* TOGGLE MUTE */
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !muted;
    setMuted(!muted);
  };

  if (!count) return null;
  const t = testimonials[active]!;

  return (
    <section id="testimonials" className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <div className="md:hidden text-center mb-16">
          <h2 className="text-white text-4xl md:text-5xl font-semibold">
            Hear what parents say about
          </h2>

          <h2 className="text-6xl md:text-8xl font-bold font-covered text-[#FBC333]">
            TINKERCHAMPS
          </h2>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-stretch">
          {/* VIDEO */}
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden shadow-xl bg-black"
          >
            <Link
              href="https://www.instagram.com/tinker_champs/"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full"
            >
              <div className="relative w-full aspect-9/16">
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="/assets/videos/testimonialvid1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur text-white hover:bg-black/80 transition"
            >
              {muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>
          </div>

          {/* TESTIMONIAL CARD */}
          <div
            className="flex flex-col bg-[#3E136D] backdrop-blur-lg border border-white/10 p-6 md:p-10 rounded-2xl shadow-xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* HEADING INSIDE CARD */}
            <div className="hidden md:block text-center mb-6">
              <h2 className="text-white text-3xl md:text-4xl font-semibold leading-snug">
                Hear what parents say about
              </h2>

              <h2 className="text-5xl md:text-7xl font-bold font-covered text-[#FBC333]">
                TINKERCHAMPS
              </h2>
            </div>

            {/* SMOOTH TRANSITION AREA */}
            <div className="flex-1 relative overflow-hidden min-h-[460px] md:min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <p className="text-3xl text-[#FBC333] mb-2">“</p>

                  <p className="text-2xl font-semibold text-white leading-snug max-w-xl mb-8">
                    {t.quote}
                  </p>

                  <p className="text-3xl text-[#FBC333] mb-2">”</p>

                  <div className="flex items-center gap-4">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.authorName}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                        {t.authorName.trim().charAt(0) || "?"}
                      </span>
                    )}

                    <div className="text-left">
                      <p className="font-semibold text-white">{t.authorName}</p>
                      {t.authorRole && <p className="text-sm text-gray-200">{t.authorRole}</p>}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-[#3E136D] hover:bg-yellow-300 transition"
              >
                <FaArrowLeft size={14} />
              </button>

              <button
                onClick={next}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-[#3E136D] hover:bg-yellow-300 transition"
              >
                <FaArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
