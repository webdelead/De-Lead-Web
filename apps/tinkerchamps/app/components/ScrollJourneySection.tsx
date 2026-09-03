"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  // useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect } from "react";

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
      // Open lock (breaking hesitation)
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <rect x="16" y="28" width="32" height="24" rx="4" fill="#F5C842" />
        <path
          d="M24 28v-6a8 8 0 1116 0"
          stroke="#F5C842"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M40 20v8"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
        />
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
      // Lightning bolt (energy / activation)
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
      // Magnifying glass (discovery)
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <circle cx="28" cy="28" r="14" stroke="#F5C842" strokeWidth="4" />
        <line
          x1="38"
          y1="38"
          x2="52"
          y2="52"
          stroke="#F5C842"
          strokeWidth="4"
          strokeLinecap="round"
        />
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
      // Gear (building skills)
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
      // Upward arrow (growth / transformation)
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <path
          d="M12 44l16-16 12 12 12-20"
          stroke="#F5C842"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 20h12v12"
          stroke="#F5C842"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// ── Single Step Icon (right side) ──────────────────────────────────────────
function StepIcon({ step }: { step: (typeof steps)[number] }) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col items-center gap-5"
    >
      {/* Large glowing circle */}
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 160,
          height: 160,
          background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)",
          boxShadow:
            "0 0 60px rgba(245,200,66,0.25), 0 0 120px rgba(109,40,217,0.4)",
        }}
      >
        {/* Dashed outer ring */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          viewBox="0 0 160 160"
          style={{ width: 160, height: 160 }}
        >
          <circle
            cx="80"
            cy="80"
            r="74"
            fill="none"
            stroke="#F5C842"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.4"
          />
        </motion.svg>
        {/* Icon */}
        <div style={{ transform: "scale(1.6)" }}>{step.icon}</div>
      </div>

      {/* Label pill */}
      <div
        className="px-6 py-2 rounded-full border text-xl font-bold font-covered tracking-wide shadow-lg"
        style={{
          background: "#2D1B69",
          borderColor: "#6D28D9",
          color: "#F5C842",
        }}
      >
        {step.label}
      </div>
    </motion.div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ step }: { step: (typeof steps)[number] }) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-2xl px-6 py-5 border border-purple-600/40 w-full"
      style={{
        background: "rgba(109, 40, 217, 0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <span
        className="block text-6xl md:text-7xl font-bold font-covered leading-none mb-2"
        style={{ color: "#F5C842" }}
      >
        {step.stat}
      </span>
      <p className="text-purple-100 text-sm leading-relaxed">
        {step.statDetail}
      </p>
      <p className="text-purple-400 text-xs mt-2 italic">{step.citation}</p>
    </motion.div>
  );
}

// ── Progress dots ──────────────────────────────────────────────────────────
function ProgressDots({
  total,
  active,
  onChange,
}: {
  total: number;
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="transition-all duration-300 hover:scale-125"
          style={{
            width: active === i ? 12 : 8,
            height: active === i ? 12 : 8,
            borderRadius: "50%",
            background: active === i ? "#F5C842" : "#6D28D980",
            cursor: "pointer",
            border: "none",
            padding: 0,
            boxShadow: active === i ? "0 0 10px rgba(245,200,66,0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────
export default function NumbersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to step index
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const index = Math.min(steps.length - 1, Math.floor(v * steps.length));
      setActiveStep(index);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="-mt-[60vh] relative z-10"
      // Each step gets 100vh of scroll room → total = steps.length * 100vh
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden py-20">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── LEFT ── */}
          <div className="flex flex-col gap-8">
            {/* Heading — always visible */}
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-secondary leading-tight tracking-tight ">
                The Numbers
              </h2>
              <h2 className="text-6xl md:text-8xl font-bold font-covered text-secondary-yellow leading-tight">
                Don&apos;t Lie
              </h2>
              <p className="text-purple-200 text-sm sm:text-base mt-4 leading-relaxed max-w-sm">
                Peer-reviewed studies across 5 continents on the impact of
                structured outdoor experiential learning on youth development.
              </p>
            </div>

            {/* Stat card — changes per step */}
            <div className="min-h-50">
              <AnimatePresence mode="wait">
                <StatCard key={activeStep} step={steps[activeStep]} />
              </AnimatePresence>
            </div>

            {/* Step indicator */}
            <div className="hidden md:flex items-center gap-3 mt-2">
              <span className="text-purple-400 text-xs font-medium">
                {String(activeStep + 1).padStart(2, "0")} /{" "}
                {String(steps.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: i === activeStep ? 28 : 8,
                      background: i === activeStep ? "#F5C842" : "#6D28D980",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: single icon ── */}
          <div className="flex items-center justify-center lg:justify-end gap-6">
            {/* Progress dots */}
            <ProgressDots
              total={steps.length}
              active={activeStep}
              onChange={(i) => {
                // scroll to that step
                if (containerRef.current) {
                  const el = containerRef.current;
                  const top =
                    el.offsetTop + (i / steps.length) * el.offsetHeight + 10;
                  
                  // @ts-ignore
                  if (window.lenis) {
                    // @ts-ignore
                    window.lenis.scrollTo(top, { duration: 1 });
                  } else {
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }
              }}
            />

            <AnimatePresence mode="wait">
              <StepIcon key={activeStep} step={steps[activeStep]} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
