"use client";

import { motion } from "framer-motion";
import { ProgramOption, stepVariants } from "./BookingUI";

export default function StepOne({ direction, selectedProgram, programs = [], onSelect }: any) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:h-[450px] items-start">
        <div className="lg:sticky lg:top-0 py-4">
          <p className="text-4xl md:text-5xl font-semibold">Book Your</p>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-covered text-secondary-yellow mb-6">
            Adventure
          </h2>
          <p className="text-secondary-white/60 text-base md:text-lg leading-relaxed max-w-sm">
            Fill in the details below and our team will reach out within 24
            hours to confirm your enrollment and share payment details.
          </p>
        </div>

        <div className="flex flex-col lg:h-[450px] overflow-hidden pt-4 lg:pt-0">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <span className="text-secondary-white/60 uppercase tracking-[0.3em] text-[12px] font-bold">
              Select Program
            </span>
          </div>

          <div
            className="space-y-3 lg:overflow-y-auto pr-0 lg:pr-2 lg:max-h-full custom-scrollbar pb-2"
            data-lenis-prevent
          >
            {programs.map((prog: any) => {
              const value = `${prog.title} - ${prog.location}`;
              return (
                <ProgramOption
                  key={prog._id}
                  title={prog.title}
                  location={prog.location}
                  date={prog.date}
                  selected={selectedProgram === value}
                  onClick={() => onSelect(value)}
                />
              );
            })}

            <ProgramOption
              title="Upcoming Events..."
              location="To be announced"
              date="Revealing Soon"
              isOther
              selected={selectedProgram === "Other Events"}
              onClick={() => onSelect("Other Events")}
            />
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(253, 198, 56, 0.4);
          }
          /* Hide scrollbar for mobile */
          @media (max-width: 1023px) {
            .custom-scrollbar {
              scrollbar-width: none;
              -ms-overflow-style: none;
              overflow-y: visible !important;
              max-height: none !important;
            }
            .custom-scrollbar::-webkit-scrollbar {
              display: none;
            }
          }
        `}</style>
      </div>
    </motion.div>
  );
}
