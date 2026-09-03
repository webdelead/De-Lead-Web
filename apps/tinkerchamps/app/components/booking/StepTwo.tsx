"use client";

import { motion } from "framer-motion";
import { InputField, SelectField, stepVariants } from "./BookingUI";

export default function StepTwo({
  direction,
  selectedProgram,
  formData,
  errors,
  onChange,
  onBack,
  onNext,
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
            Student Details
            {selectedProgram && (
              <span className="text-secondary-yellow normal-case font-medium opacity-100 tracking-normal">
                — {selectedProgram}
              </span>
            )}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InputField
            label="Student Name"
            placeholder="Eg:- Arjun Pillai"
            value={formData.studentName}
            onChange={(val: string) => onChange("studentName", val)}
            error={errors.studentName}
          />
          <InputField
            label="Student Age"
            placeholder="Max 18"
            type="number"
            value={formData.studentAge}
            onChange={(val: string) => onChange("studentAge", val)}
            error={errors.studentAge}
          />
          <SelectField
            label="Class/Grade"
            placeholder="Select class"
            options={["6th", "7th", "8th", "9th", "10th", "11th", "12th"]}
            value={formData.classGrade}
            onChange={(val: string) => onChange("classGrade", val)}
            error={errors.classGrade}
          />
          <SelectField
            label="Gender"
            placeholder="Select"
            options={["Male", "Female", "Other"]}
            value={formData.gender}
            onChange={(val: string) => onChange("gender", val)}
            error={errors.gender}
          />
        </div>
        <InputField
          label="School/Institution Name"
          placeholder="Eg: Delhi Public School, Kochi (Optional)"
          value={formData.school}
          onChange={(val: string) => onChange("school", val)}
        />
      </div>
    </motion.div>
  );
}
