"use client";

import { motion } from "framer-motion";

// ── Step data ──────────────────────────────────────────────────────────────
const steps = [
  {
    id: "unfreeze",
    label: "Unfreeze",
    stat: "78%",
    statDetail:
      "of children overcome hesitation and show improved confidence after camp",
    citation: "American Camp Association (ACA), Youth Outcomes Study",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <rect x="16" y="28" width="32" height="24" rx="4" fill="#F5C842" />
        <path d="M24 28v-6a8 8 0 1116 0" stroke="#F5C842" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 20v8" stroke="#000" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "ignite",
    label: "Ignite",
    stat: "72%",
    statDetail:
      "of participants report reduced social anxiety and increased social confidence",
    citation: "Journal of Adolescent Development, Outdoor Programs Study",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <path d="M36 6L12 36h16l-4 22 28-34H36z" fill="#F5C842" />
      </svg>
    ),
  },
  {
    id: "discover",
    label: "Discover",
    stat: "73%",
    statDetail:
      "of students develop positive behavioral changes like responsibility and independence",
    citation: "American Institutes for Research, 2005",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <circle cx="28" cy="28" r="14" stroke="#F5C842" strokeWidth="4" />
        <line x1="38" y1="38" x2="52" y2="52" stroke="#F5C842" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "build",
    label: "Build",
    stat: "71%",
    statDetail:
      "of youth develop leadership and decision-making skills through group challenges",
    citation: "National Outdoor Leadership School (NOLS) Research",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <circle cx="32" cy="32" r="8" fill="#4ADE80" />
        <path
          d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M18 46l4-4M42 22l4-4"
          stroke="#4ADE80"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "transform",
    label: "Transform",
    stat: "68%",
    statDetail:
      "of participants show long-term growth in resilience and life skills after camp experiences",
    citation: "Outward Bound USA Impact Study",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <path
          d="M12 44l16-16 12 12 12-20"
          stroke="#F5C842"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M40 20h12v12" stroke="#F5C842" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
];

function StepCard({ step, i }: { step: (typeof steps)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 rounded-2xl border border-purple-600/40 px-6 py-8 text-center"
      style={{ background: "rgba(109, 40, 217, 0.25)", backdropFilter: "blur(10px)" }}
    >
      {/* glowing circle + icon */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 128,
          height: 128,
          background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
          boxShadow: "0 0 40px rgba(245,200,66,0.2), 0 0 90px rgba(109,40,217,0.35)",
        }}
      >
        <svg className="absolute inset-0" viewBox="0 0 128 128" style={{ width: 128, height: 128 }}>
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="#F5C842"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.4"
          />
        </svg>
        <div style={{ transform: "scale(1.4)" }}>{step.icon}</div>
      </div>

      {/* label pill */}
      <div
        className="rounded-full border px-6 py-2 font-covered text-xl font-bold tracking-wide shadow-lg"
        style={{ background: "#2D1B69", borderColor: "#6D28D9", color: "#F5C842" }}
      >
        {step.label}
      </div>

      <span
        className="block font-covered text-6xl font-bold leading-none"
        style={{ color: "#F5C842" }}
      >
        {step.stat}
      </span>
      <p className="text-sm leading-relaxed text-purple-100">{step.statDetail}</p>
      <p className="mt-1 text-xs italic text-purple-400">{step.citation}</p>
    </motion.div>
  );
}

export default function NumbersSection() {
  return (
    <section className="relative z-10 w-full px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-xl">
          <h2 className="text-secondary text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            The Numbers
          </h2>
          <h2 className="font-covered text-6xl font-bold leading-tight text-secondary-yellow md:text-8xl">
            Don&apos;t Lie
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-purple-200 sm:text-base">
            Peer-reviewed studies across 5 continents on the impact of structured outdoor
            experiential learning on youth development.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <StepCard key={step.id} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
