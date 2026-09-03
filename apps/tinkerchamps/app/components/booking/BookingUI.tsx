"use client";

import { motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoChevronForward,
  IoChevronDown,
} from "react-icons/io5";

/* --- Progress Bar --- */
export function ProgressBar({ step, isSubmitted, totalSteps }: any) {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[6px] bg-black/20 overflow-hidden">
      <motion.div
        className="h-full bg-secondary-yellow shadow-[0_0_15px_rgba(253,198,56,0.5)]"
        initial={{ width: "33.33%" }}
        animate={{
          width: isSubmitted
            ? "100%"
            : step === 1
              ? "33.33%"
              : step === 2
                ? "66.66%"
                : "100%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}

/* --- Backdrop & Decorations --- */
export function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-md cursor-pointer"
    />
  );
}

export function Decorations({ isSubmitted }: { isSubmitted: boolean }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
      <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] bg-white/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] bg-black/20 blur-[120px] rounded-full" />
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0 bg-gradient-to-tr from-secondary-yellow/10 to-transparent pointer-events-none"
        />
      )}
    </div>
  );
}

/* --- Form Fields --- */
export function ProgramOption({
  title,
  location,
  date,
  selected = false,
  isOther = false,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className={`group relative p-3 rounded-[1.25rem] border transition-all duration-300 cursor-pointer ${selected ? "bg-white/10 border-secondary-yellow shadow-lg" : "bg-[#3E136D] border-white/5 hover:border-white/20"}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3.5 rounded-xl transition-colors duration-300 ${selected ? "bg-secondary-yellow text-primary-purple" : "bg-white/5 text-secondary-yellow group-hover:bg-white/10"}`}
        >
          <IoCalendarOutline size={20} />
        </div>
        <div className="space-y-0.5">
          <h4
            className={`font-bold text-lg ${selected ? "text-white" : "text-white/80"}`}
          >
            {title}
          </h4>
          {!isOther && (
            <>
              <p className="text-secondary-white/60 text-[10px] uppercase tracking-wider font-semibold">
                {location}
              </p>
              <p className="text-secondary-yellow text-[12px] font-bold">
                {date}
              </p>
            </>
          )}
        </div>
      </div>
      {selected && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-secondary-yellow">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <IoChevronForward size={22} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export function InputField({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: any) {
  return (
    <div className="flex flex-col gap-2.5 group">
      <label
        className={`text-[12px] uppercase tracking-[0.2em] font-bold transition-colors ${error ? "text-red-300" : "text-secondary-white/60 group-focus-within:text-white"}`}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-[#3E136D] border ${error ? "border-red-500/50" : "border-white/10"} rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-secondary-yellow/50 transition-all text-sm`}
      />
      {error && <span className="text-[12px] text-red-300 ml-2">{error}</span>}
    </div>
  );
}

export function SelectField({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  error,
}: any) {
  return (
    <div className="flex flex-col gap-2.5 group">
      <label
        className={`text-[12px] uppercase tracking-[0.2em] font-bold transition-colors ${error ? "text-red-300" : "text-secondary-white/60 group-focus-within:text-white"}`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-[#3E136D] border ${error ? "border-red-500/50" : "border-white/10"} rounded-2xl px-5 py-3.5 text-white outline-none focus:border-secondary-yellow/50 transition-all text-sm cursor-pointer`}
        >
          <option value="" className="text-white/20">
            {placeholder}
          </option>
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-[#3E136D] text-white">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
          <IoChevronDown size={16} />
        </div>
      </div>
      {error && <span className="text-[12px] text-red-300 ml-2">{error}</span>}
    </div>
  );
}

export const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};
