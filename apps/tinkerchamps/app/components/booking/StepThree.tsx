"use client";

import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { InputField, stepVariants } from "./BookingUI";

export default function StepThree({
  direction,
  selectedProgram,
  formData,
  errors,
  countryCode,
  isSubmitting,
  onChange,
  onCountryChange,
  onBack,
  onSubmit,
}: any) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full flex flex-col"
    >
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-secondary-white flex items-center gap-3">
            Location Details
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InputField
            label="District"
            placeholder="Eg:- Ernakulam"
            value={formData.district}
            onChange={(val: string) => onChange("district", val)}
            error={errors.district}
          />
          <InputField
            label="Place"
            placeholder="Eg:- Aluva"
            value={formData.place}
            onChange={(val: string) => onChange("place", val)}
            error={errors.place}
          />
        </div>

        <div className="border-b border-white/10 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-secondary-white flex items-center gap-3">
            Parent Details
            {selectedProgram && (
              <span className="text-secondary-yellow normal-case font-medium opacity-100 tracking-normal">
                — {selectedProgram}
              </span>
            )}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InputField
            label="Parent Name"
            placeholder="Eg:- Arjun Pillai"
            value={formData.parentName}
            onChange={(val: string) => onChange("parentName", val)}
            error={errors.parentName}
          />
          <InputField
            label="Email Address"
            placeholder="eg: parent@example.com"
            value={formData.email}
            onChange={(val: string) => onChange("email", val)}
            error={errors.email}
          />
        </div>
        <div className="max-w-md space-y-3">
          <label className="block text-secondary-white/60 text-[12px] uppercase tracking-widest font-bold">
            Phone / WhatsApp Number
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Country Code */}
            <div className="relative w-fit md:w-32">
              <select
                value={countryCode}
                onChange={(e) => onCountryChange(e.target.value)}
                className="appearance-none w-full md:w-full px-3 py-3.5 pr-7 bg-[#3E136D] border border-white/10 rounded-2xl text-white outline-none focus:border-secondary-yellow/50 transition-all text-sm cursor-pointer"
              >
                <option value="+91">IN +91</option>
                <option value="+971">UAE +971</option>
              </select>

              {/* Chevron */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <IoChevronDown size={14} />
              </div>
            </div>

            {/* Phone Input */}
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Number"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className={`w-full bg-[#3E136D] border ${
                  errors.phone ? "border-red-500/50" : "border-white/10"
                } rounded-2xl px-6 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-secondary-yellow/50 transition-all text-sm`}
              />

              {errors.phone && (
                <span className="text-[10px] text-red-300 ml-2">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
