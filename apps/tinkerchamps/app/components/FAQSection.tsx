"use client";

import { useState, useRef } from "react";
import FAQItem from "./FAQItem";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    question: "Who can participate in TinkerChamps?",
    answer:
      "Students who are curious about technology, creativity, and innovation can participate in TinkerChamps.",
  },
  {
    question: "What will students learn at TinkerChamps?",
    answer:
      "Students develop problem-solving, creativity, teamwork, and hands-on technology skills.",
  },
  {
    question: "Is this a technical or academic camp?",
    answer:
      "It combines experiential learning, creativity, and technology exploration.",
  },
  {
    question: "What makes TinkerChamps different from other camps?",
    answer:
      "Students learn through building, experimenting, and solving real-world challenges.",
  },
  {
    question: "Who organizes TinkerChamps?",
    answer:
      "TinkerChamps is organized by Delead Int, a company dedicated to empowering young minds through innovative learning experiences.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.2"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="w-full bg-[#f4f4f4] py-28 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-20 items-start">
        {/* LEFT CARD */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-linear-to-b from-[#562190] to-[#4B00B3] text-white rounded-xl p-8 shadow-md py-10 h-80 flex flex-col justify-between"
        >
          <div>
            <div className="flex -space-x-3 mb-6">
              {["man1.webp", "man2.webp", "women.webp"].map((img, i) => (
                <div
                  key={i}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
                >
                  <Image
                    src={`/assets/images/${img}`}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <p className="leading-relaxed opacity-90 font-medium">
              Speak with our expert academic counsellors to know more about
              Tinkerchamps
            </p>
          </div>

          <Link
            href="https://wa.me/918075917297?text=I%20want%20to%20know%20more%20about%20Tinkerchamps"
            target="_blank"
          >
            <button className="bg-white text-primary-purple px-6 py-3 rounded-full text-sm font-medium shadow-sm w-fit">
              Book a Free Consultation
            </button>
          </Link>
        </motion.div>

        {/* RIGHT SIDE */}

        <div>
          {/* TITLE MOTION */}

          <motion.div style={{ y: titleY, scale: titleScale }}>
            <h2 className="text-4xl md:text-5xl leading-tight tracking-tight text-black">
              FREQUENTLY ASKED
            </h2>

            <h3 className="text-6xl md:text-8xl font-bold font-covered text-primary-purple mb-10 md:mb-6 -mt-1">
              QUESTIONS
            </h3>
          </motion.div>

          {/* FAQ LIST */}

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isActive={activeIndex === index}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
