"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaBookOpen,
  FaLeaf,
  FaHandshake,
  FaRocket,
} from "react-icons/fa";

import { FaTicket } from "react-icons/fa6";
import { PiBirdFill } from "react-icons/pi";

import Tag from "./Tag";
import StatCard from "./StatCard";
import EventCard from "./EventCard";

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

export default function EventSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* inject CSS once */
    if (!document.getElementById("__event-anim-styles")) {
      const style = document.createElement("style");
      style.id = "__event-anim-styles";
      style.textContent = ANIMATION_CSS;
      document.head.appendChild(style);
    }

    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>("[data-anim]");

    const observer = new IntersectionObserver(
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

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 px-6 flex justify-center">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        {/* ── FEATURED EVENT ─────────────────────────────────────────────── */}
        <div
          data-anim="up"
          className="bg-[#562190] rounded-3xl p-4 md:p-10 flex flex-col gap-10"
        >
          {/* badge */}
          <div
            data-anim="scale"
            data-anim-delay="120"
            className="w-fit bg-[#FBC333] text-black text-sm px-3 py-1 rounded-full font-semibold"
          >
            Featured
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT */}
            <div
              data-anim="left"
              data-anim-delay="200"
              className="flex-1 flex flex-col gap-6"
            >
              <Image
                src="/assets/TCLogoS22.svg"
                alt="TinkerChamps"
                width={300}
                height={200}
              />

              <p className="text-white/80 text-base leading-relaxed max-w-md">
                In a world where AI and automation redefine every career,
                memorisation is no longer enough. Students must learn to explore
                boldly, question deeply, and innovate confidently.
              </p>

              <div className="flex flex-wrap gap-3 text-sm">
                <Tag>
                  <FaCalendarAlt /> Dec 26–30, 2026
                </Tag>
                <Tag>
                  <FaMapMarkerAlt /> Palakkad, Kerala
                </Tag>
                <Tag>
                  <FaUsers /> Class 6–12
                </Tag>
                <Tag>5 Days Residential</Tag>
                <Tag>Early Bird Offer</Tag>
              </div>

              <div className="flex gap-4 pt-2 md:flex-row flex-col">
                <button className="flex items-center item-center justify-center gap-2 bg-[#FBC333] text-black px-6 py-3 rounded-full font-semibold border border-white/30 hover:bg-transparent hover:text-white  transition">
                  <FaTicket />
                  Book Now
                </button>

                <button className="px-6 py-3 rounded-full border border-white/30 font-semibold text-white hover:bg-[#FBC333] hover:text-black  transition">
                  See Activities →
                </button>
              </div>
            </div>

            {/* RIGHT — stat cards staggered */}
            <div className="flex-1 flex flex-col gap-4">
              {[
                {
                  icon: <FaCalendarAlt />,
                  title: "5",
                  text: "Action-packed Days",
                  delay: 250,
                },
                {
                  icon: <FaBookOpen />,
                  title: "22+",
                  text: "Training Sessions",
                  delay: 350,
                },
                {
                  icon: <FaStar />,
                  title: "Season 22",
                  text: "Years Of Impact",
                  delay: 450,
                },
                {
                  icon: <PiBirdFill />,
                  title: "3 Offers",
                  text: "Early-bird | Sibling | Referrals",
                  delay: 550,
                },
              ].map(({ icon, title, text, delay }) => (
                <div
                  key={title}
                  data-anim="right"
                  data-anim-delay={String(delay)}
                >
                  <StatCard icon={icon} title={title} text={text} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── UPCOMING EVENTS ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              badge: "COMING SOON",
              icon: <FaLeaf />,
              title: "LEAD CAMP",
              subtitle: "LEADERSHIP RESIDENTIAL · 2024",
              description:
                "Residential leadership camp for college students. Public speaking, strategic thinking, and career clarity through experiential modules guided by De' Lead's expert facilitators.",
              meta1: "Q1 2024",
              meta2: "Kerala",
              meta3: "College",
              button: "Notify Me",
              delay: 100,
            },
            {
              badge: "ANNOUNCING SOON",
              icon: <FaHandshake />,
              title: "CORP OBT",
              subtitle: "CORPORATE OUTBOUND TRAINING",
              description:
                "Transformative team-building designed for corporate teams. Build cohesion, break hierarchy, and unlock collective potential in Kerala's natural landscapes.",
              meta1: "TBA 2024",
              meta2: "Kerala / UAE",
              meta3: "Corporate",
              button: "Enquire Now",
              delay: 230,
            },
            {
              badge: "ANNOUNCING SOON",
              icon: <FaRocket />,
              title: "TINKER UAE",
              subtitle: "DUBAI EDITION · 2024",
              description:
                "TinkerChamps arrives in the UAE — the same transformative 5-day program, now designed for NRI students across Dubai and the Emirates.",
              meta1: "2024",
              meta2: "Dubai, UAE",
              meta3: "NRI Students",
              button: "Express Interest",
              delay: 360,
            },
          ].map(({ delay, ...props }) => (
            <div
              key={props.title}
              data-anim="up"
              data-anim-delay={String(delay)}
            >
              <EventCard {...props} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
