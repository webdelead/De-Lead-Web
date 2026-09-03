"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoChevronBack } from "react-icons/io5";

// Internal Components
import { Backdrop, Decorations, ProgressBar } from "./booking/BookingUI";
import StepOne from "./booking/StepOne";
import StepTwo from "./booking/StepTwo";
import StepThree from "./booking/StepThree";
import SuccessStep from "./booking/SuccessStep";
import { client } from "../../sanity/lib/client";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countryCode, setCountryCode] = useState("+91");
  const [activePrograms, setActivePrograms] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    studentName: "",
    studentAge: "",
    classGrade: "",
    gender: "",
    school: "",
    district: "",
    place: "",
    parentName: "",
    email: "",
    phone: "",
  });

  // Fetch active programs from Sanity
  useEffect(() => {
    if (isOpen) {
      client
        .fetch(
          `*[_type == "event" && isActive == true] | order(order asc, date desc) {
            _id,
            title,
            location,
            date
          }`
        )
        .then((data) => {
          setActivePrograms(data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch active programs for booking:", err);
        });
    }
  }, [isOpen]);

  // Lock body scroll and handle browser back button
  useEffect(() => {
    if (isOpen) {
      // Lock standard scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Lock Lenis (Smooth Scroll)
      // @ts-ignore
      if (window.lenis) {
        // @ts-ignore
        window.lenis.stop();
      }

      // History trap for back button
      // Push a new state so back button closes modal instead of navigating
      window.history.pushState({ modalOpen: true }, "");

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";

        // @ts-ignore
        if (window.lenis) {
          // @ts-ignore
          window.lenis.start();
        }

        window.removeEventListener("popstate", handlePopState);

        // If we are still on the modal's state, go back to clean it up
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      };
    }
  }, [isOpen, onClose]);

  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!formData.studentName.trim())
        newErrors.studentName = "Name is required";
      const age = parseInt(formData.studentAge);
      if (!formData.studentAge) {
        newErrors.studentAge = "Age is required";
      } else if (isNaN(age) || age < 1 || age > 18) {
        newErrors.studentAge = "Age must be 1-18";
      }
      if (!formData.classGrade) newErrors.classGrade = "Grade is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (currentStep === 3) {
      if (!formData.district.trim()) newErrors.district = "District is required";
      if (!formData.place.trim()) newErrors.place = "Place is required";
      if (!formData.parentName.trim())
        newErrors.parentName = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      const cleanPhone = formData.phone.replace(/\D/g, "");
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (countryCode === "+91" && cleanPhone.length !== 10) {
        newErrors.phone = "Enter a 10-digit number";
      } else if (
        countryCode === "+971" &&
        (cleanPhone.length < 7 || cleanPhone.length > 9)
      ) {
        newErrors.phone = "Enter a valid UAE number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && !validateStep(step)) return;
    const nextStepVal = step + newDirection;
    if (nextStepVal >= 1 && nextStepVal <= totalSteps) {
      setDirection(newDirection);
      setStep(nextStepVal);
    }
  };

  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program);
    setTimeout(() => paginate(1), 300);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setDirection(0);
      setIsSubmitted(false);
      setFormData({
        studentName: "",
        studentAge: "",
        classGrade: "",
        gender: "",
        school: "",
        district: "",
        place: "",
        parentName: "",
        email: "",
        phone: "",
      });
      setSelectedProgram(null);
      setErrors({});
    }, 500);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload: any = {
      ...formData,
      phone: `${countryCode} ${formData.phone}`,
      selectedProgram: selectedProgram || "",
    };

    // Fire and forget (Optimistic UI)
    // We do not await this because the server-side Google Sheets Apps Script call is slow
    fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("Booking API background submission error:", err));

    // Show success state after a very short "processing" delay to feel natural
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Backdrop onClick={handleClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl h-[80vh] max-h-[750px] overflow-hidden rounded-2xl bg-[#562190] shadow-[0_0_80px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col"
      >
        <Decorations isSubmitted={isSubmitted} />

        {/* Step Background Images */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Step 1: Full Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 && !isSubmitted ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/assets/images/step1bg.webp")' }}
          />

          {/* Step 2: Top Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 && !isSubmitted ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-top"
            style={{ backgroundImage: 'url("/assets/images/step2bg.webp")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#562190]/20 to-[#562190]" />
          </motion.div>

          {/* Step 3: Top Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 && !isSubmitted ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-top"
            style={{ backgroundImage: 'url("/assets/images/step3bg.webp")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#562190]/20 to-[#562190]" />
          </motion.div>
        </div>

        <div className="relative z-1 flex flex-col h-full">
          {/* Header */}
          <div className="px-4 md:px-8 py-4 flex justify-end items-center">
            <button
              onClick={handleClose}
              className="md:p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all group"
            >
              <IoClose
                size={28}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 md:px-16 pt-4 pb-8 md:pb-12 scrollbar-hide"
            data-lenis-prevent
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {isSubmitted ? (
                <SuccessStep
                  key="success"
                  selectedProgram={selectedProgram}
                  onDone={handleClose}
                />
              ) : step === 1 ? (
                <StepOne
                  key="step1"
                  direction={direction}
                  selectedProgram={selectedProgram}
                  programs={activePrograms}
                  onSelect={handleProgramSelect}
                />
              ) : step === 2 ? (
                <StepTwo
                  key="step2"
                  direction={direction}
                  selectedProgram={selectedProgram}
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onBack={() => paginate(-1)}
                  onNext={() => paginate(1)}
                />
              ) : (
                <StepThree
                  key="step3"
                  direction={direction}
                  selectedProgram={selectedProgram}
                  formData={formData}
                  errors={errors}
                  countryCode={countryCode}
                  isSubmitting={isSubmitting}
                  onChange={handleInputChange}
                  onCountryChange={setCountryCode}
                  onBack={() => paginate(-1)}
                  onSubmit={handleSubmit}
                />
              )}
            </AnimatePresence>
          </div>

          {!isSubmitted && step > 1 && (
            <div className="px-6 md:px-16 py-6 md:pt-2 flex justify-between items-center">
              <button
                onClick={() => paginate(-1)}
                className="text-white/50 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-xs"
              >
                <IoChevronBack size={16} /> Back
              </button>

              <div className="flex items-center gap-6">
                {step < totalSteps ? (
                  <button
                    onClick={() => paginate(1)}
                    className="px-7 py-2.5 bg-secondary-yellow text-primary-purple hover:bg-white rounded-2xl transition-all flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-sm shadow-xl"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-secondary-yellow text-primary-purple border border-white/20 rounded-2xl hover:bg-white shadow-[0_10px_30px_rgba(253,198,56,0.3)] transition-all flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-sm disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-primary-purple"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          <ProgressBar
            step={step}
            isSubmitted={isSubmitted}
            totalSteps={totalSteps}
          />
        </div>
      </motion.div>
    </div>
  );
}
