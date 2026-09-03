"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaBookOpen,
} from "react-icons/fa";

import { FaTicket } from "react-icons/fa6";
import { PiBirdFill } from "react-icons/pi";
import { useBookingModal } from "../context/ModalContext";

import Tag from "./Tag";
import StatCard from "./StatCard";

export type TcEvent = {
  _id: string;
  title: string;
  logo: string;
  description: string;
  date: string;
  location: string;
  audience?: string;
  duration?: string;
  inclusion?: string;
  isFeatured?: boolean;
  stats?: { icon: string; title: string; text: string }[];
};

/* ─── animation styles injected once ─────────────────────────────────────── */
const ANIMATION_CSS = `
  .anim-hidden {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s cubic-bezier(.22,.68,0,1.2),
                transform 0.65s cubic-bezier(.22,.68,0,1.2);
  }
  .anim-hidden.anim-left {
    transform: translateX(-28px) translateY(0);
  }
  .anim-hidden.anim-right {
    transform: translateX(28px) translateY(0);
  }
  .anim-hidden.anim-scale {
    transform: scale(0.88);
  }
  .anim-visible {
    opacity: 1 !important;
    transform: none !important;
  }
`;

export default function EventSection({ events = [] }: { events?: TcEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    if (!document.getElementById("__event-anim-styles")) {
      const style = document.createElement("style");
      style.id = "__event-anim-styles";
      style.textContent = ANIMATION_CSS;
      document.head.appendChild(style);
    }

    const section = sectionRef.current;
    if (!section) return;

    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      const targets = section.querySelectorAll<HTMLElement>("[data-anim]");

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const delay = el.dataset.animDelay ?? "0";
              setTimeout(() => el.classList.add("anim-visible"), Number(delay));
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.12 },
      );

      targets.forEach((el) => {
        el.classList.add("anim-hidden");
        if (el.dataset.anim === "left") el.classList.add("anim-left");
        if (el.dataset.anim === "right") el.classList.add("anim-right");
        if (el.dataset.anim === "scale") el.classList.add("anim-scale");
        observer.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [events]);

  if (events.length === 0) {
    return null; // Don't show the events section if there are no events
  }

  return (
    <section
      id="events"
      ref={sectionRef}
      className="w-full py-20 px-6 flex justify-center"
    >
      <div className="max-w-6xl w-full flex flex-col gap-12">
        {events.map((event, eventIdx) => (
          <div
            key={event._id || eventIdx}
            data-anim="up"
            className="bg-[#562190] rounded-3xl p-4 md:p-10 flex flex-col gap-10"
          >
            {event.isFeatured && (
              <div
                data-anim="scale"
                data-anim-delay="120"
                className="w-fit bg-[#FBC333] text-black text-sm px-3 py-1 rounded-full font-semibold"
              >
                Featured
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
              <div
                data-anim="left"
                data-anim-delay="200"
                className="flex-1 flex flex-col gap-6"
              >
                {event.logo ? (
                  <Image
                    src={event.logo}
                    alt={event.title}
                    width={450}
                    height={300}
                    className="object-contain max-h-[140px] md:max-h-[180px] w-auto align-left self-start"
                  />
                ) : (
                  <Image
                    src="/assets/TCLogo.webp"
                    alt={event.title}
                    width={450}
                    height={300}
                    className="object-contain max-h-[140px] md:max-h-[180px] w-auto align-left self-start"
                  />
                )}

                <p className="text-white/80 text-base leading-relaxed max-w-md">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <Tag>
                    <FaCalendarAlt /> {event.date}
                  </Tag>
                  <Tag>
                    <FaMapMarkerAlt /> {event.location}
                  </Tag>
                  {event.audience && (
                    <Tag>
                      <FaUsers /> {event.audience}
                    </Tag>
                  )}
                  {event.duration && <Tag>{event.duration}</Tag>}
                  {event.inclusion && <Tag>{event.inclusion}</Tag>}
                </div>

                <div className="flex gap-4 pt-2 md:flex-row flex-col">
                  <button
                    onClick={openBookingModal}
                    className="flex items-center justify-center gap-2 bg-[#FBC333] text-black px-6 py-3 rounded-full font-semibold border border-white/30 hover:bg-transparent hover:text-white transition"
                  >
                    <FaTicket />
                    Book Now
                  </button>

                  <Link
                    href="#learning"
                    scroll={true}
                    className="flex items-center justify-center px-6 py-3 rounded-full border border-white/30 font-semibold text-white hover:bg-[#FBC333] hover:text-black transition"
                  >
                    See Activities →
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                {event.stats?.map((stat: any, statIdx: number) => {
                  let iconEl = <FaCalendarAlt />;
                  if (stat.icon === "book") iconEl = <FaBookOpen />;
                  if (stat.icon === "star") iconEl = <FaStar />;
                  if (stat.icon === "bird") iconEl = <PiBirdFill />;
                  
                  const delay = 250 + statIdx * 100;
                  return (
                    <div
                      key={statIdx}
                      data-anim="right"
                      data-anim-delay={String(delay)}
                    >
                      <StatCard icon={iconEl} title={stat.title} text={stat.text} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
