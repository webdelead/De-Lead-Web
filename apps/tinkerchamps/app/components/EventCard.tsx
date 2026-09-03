"use client";

import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

interface EventCardProps {
  badge: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  meta1: string;
  meta2: string;
  meta3: string;
  button: string;
}

export default function EventCard({
  badge,
  icon,
  title,
  subtitle,
  description,
  meta1,
  meta2,
  meta3,
  button,
}: EventCardProps) {
  return (
    <div className="h-full bg-[#5a1e96] rounded-3xl p-8 flex flex-col justify-between border border-white/10">
      <div className="flex flex-col gap-4">
        <div className="w-fit text-xs bg-[#4b1384] text-[#FBC333] px-4 py-1 rounded-full tracking-widest">
          • {badge}
        </div>

        <div className="text-4xl text-white/80">{icon}</div>

        <h3 className="text-white text-2xl font-bold">{title}</h3>

        <p className="text-purple-200 text-base tracking-widest">{subtitle}</p>

        <p className="text-white/70 text-base leading-relaxed">{description}</p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex text-sm text-white/60 gap-4">
          <span className="flex items-center gap-1">
            <FaCalendarAlt /> {meta1}
          </span>

          <span className="flex items-center gap-1">
            <FaMapMarkerAlt /> {meta2}
          </span>

          <span className="flex items-center gap-1">
            <FaUsers /> {meta3}
          </span>
        </div>

        <button className="flex items-center justify-center gap-2 border border-white/20 font-semibold hover:bg-transparent rounded-full py-3 hover:text-white bg-[#FBC333] text-black transition">
          {icon}
          {button}
        </button>
      </div>
    </div>
  );
}

/* ── UPCOMING EVENTS ────────────────────────────────────────────── */
{
  /* <div className="grid md:grid-cols-3 gap-8">
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
    <div key={props.title} data-anim="up" data-anim-delay={String(delay)}>
      <EventCard {...props} />
    </div>
  ))}
</div>; */
}
