"use client";

import { motion } from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function SuccessStep({ selectedProgram, onDone }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-full flex flex-col items-center justify-center text-center space-y-8 py-10"
    >
      <div className="text-secondary-yellow mb-2">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <IoCheckmarkCircle size={80} />
        </motion.div>
      </div>

      <div className="space-y-4 max-w-lg px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-white font-covered">
          Registration{" "}
          <span className="text-secondary-yellow">Successful!</span>
        </h2>
        <div className="space-y-2">
          <p className="text-white/80 text-lg font-medium">
            We've received your enrollment for
            <span className="block text-secondary-yellow font-bold mt-1">
              {selectedProgram}
            </span>
          </p>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Our team will contact you within 24 hours with the next steps.
          </p>
        </div>
      </div>

      <button
        onClick={onDone}
        className="px-12 py-3.5 bg-white/5 hover:bg-white text-white hover:text-primary-purple border border-white/10 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300"
      >
        Close
      </button>
    </motion.div>
  );
}
