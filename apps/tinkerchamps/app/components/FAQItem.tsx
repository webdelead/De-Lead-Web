"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";

interface Props {
  question: string;
  answer: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FAQItem({
  question,
  answer,
  isActive,
  onClick,
}: Props) {
  return (
    <div className="border-b border-gray-300 pb-3">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-semibold text-black text-lg">{question}</span>

        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isActive ? "bg-[#FBC333] text-white" : "text-black"
          }`}
        >
          <FiPlus size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text- text-gray-600 mt-4 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
