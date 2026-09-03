"use client";

import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import Image from "next/image";
import { IconType } from "react-icons";
import {
  FaBrain,
  FaLightbulb,
  FaRocket,
  FaCogs,
  FaUsers,
} from "react-icons/fa";

interface LearningItem {
  title: string;
  highlight: string;
  description: string;
  image: string;
  color: string;
  insightTitle: string;
  insightText: string;
  icon: IconType;
}

const learnings: LearningItem[] = [
  {
    title: "High Ropes",
    highlight: "Challenge",
    description:
      "Students navigate rope bridges, ziplines, and aerial elements 20–50 feet off the ground. Each element is a calculated confrontation with fear — and a celebration when they push through it.",
    image: "/assets/images/Gallery/5.JPG",
    color: "bg-[#A313EB]",
    insightTitle: "Neuroscience Insights",
    insightText:
      "Conquering height triggers the release of norepinephrine and dopamine — neurochemicals that strengthen long-term memory formation. Students literally remember courage at a biological level.",
    icon: FaBrain,
  },
  {
    title: "Team",
    highlight: "Challenge",
    description:
      "Human knot, blindfolded maze navigation, pipeline challenges — 8–10 sessions where the only way to succeed is to communicate, trust, and lead. Groups are deliberately mixed to break social silos.",
    image: "/assets/images/Gallery/7.jpg",
    color: "bg-[#562190]",
    insightTitle: "Neuroscience Insights",
    insightText:
      "Collaborative physical challenges release oxytocin — the bonding hormone — while building the prefrontal cortex's capacity for social cognition, empathy, and strategic communication.",
    icon: FaLightbulb,
  },
  {
    title: "Obstacle",
    highlight: "Training",
    description:
      "Timed obstacle courses blending physical endurance with logical decision-making. Through crawling, climbing, and balancing, students learn to face discomfort—an essential life skill no classroom teaches.",
    image: "/assets/images/Gallery/10.jpg",
    color: "bg-[#A313EB]",
    insightTitle: "Neuroscience Insights",
    insightText:
      "Controlled physical stress grows the anterior cingulate cortex—the brain region governing resilience, self-regulation, and persistence. The capacity to handle life and academic pressure is built here.",
    icon: FaCogs,
  },
  {
    title: "Robotics",
    highlight: "& AI",
    description:
      "Hands-on robotics building, 3D design workshops, and applied AI sessions. Students don't just learn about technology — they make it do things. This ignites a spark that lasts far beyond the camp.",
    image: "/assets/images/Gallery/11.jpg",
    color: "bg-[#521D8C]",
    insightTitle: "Neuroscience Insights",
    insightText:
      "Project-based technical tasks activate spatial reasoning, logical sequencing, and creative problem-solving pathways—engaging the exact neural networks recruited for advanced mathematics and engineering.",
    icon: FaRocket,
  },
  {
    title: "Nature's",
    highlight: "Whispers",
    description:
      "Kerala's lush campus serves as a living classroom. Through wildlife interaction, trail cycling, and birdwatching, students reconnect with the natural world and rediscover a quality increasingly rare: wonder.",
    image: "/assets/images/Gallery/18.jpg",
    color: "bg-[#A313EB]",
    insightTitle: "Neuroscience Insights",
    insightText:
      "Nature exposure measurably lowers cortisol stress levels and reduces ADD/ADHD symptoms. A greener environment significantly improves a child's overall capacity for managed attention and balanced behaviour.",
    icon: FaUsers,
  },
];

export default function LearningSection() {
  return (
    <section
      id="learning"
      className="w-full pt-25 py-30 min-h-[260vh] px-4 sm:px-6"
    >
      <ScrollStack>
        {learnings.map((item, index) => {
          const Icon = item.icon;

          return (
            <ScrollStackItem key={index} index={index}>
              <div
                className={`flex flex-col justify-between md:grid md:grid-cols-2 md:gap-10 h-full w-full mx-auto ${item.color} rounded-xl p-6  md:p-12 md:items-center text-white shadow-xl`}
              >
                {/* LEFT CONTENT */}
                <div className="flex flex-col gap-4 pt-6 md:pt-0">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-semibold text-secondaryy">
                      {item.title}
                    </h2>

                    <h3 className="text-6xl md:text-7xl font-semibold font-covered text-secondary-yellow leading-tight">
                      {item.highlight}
                    </h3>
                  </div>

                  <p className="text-white/90 max-w-md text-base">
                    {item.description}
                  </p>

                  {/* INSIGHT CARD */}
                  <div className="bg-black/30 backdrop-blur-xl rounded-lg p-3 flex gap-4 items-start max-w-md border border-white/10">
                    <div className="hidden md:block text-secondary-yellow text-6xl mt-1">
                      <Icon />
                    </div>

                    <div>
                      <p className="text-secondary-yellow text-lg font-semibold mb-1">
                        {item.insightTitle}
                      </p>

                      <p className="text-white/80 text-sm leading-relaxed">
                        {item.insightText}
                      </p>
                    </div>
                  </div>
                </div>
                {/* RIGHT IMAGE */}
                <div className="hidden md:block relative w-full mt-4 h-50 md:h-full rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </section>
  );
}
