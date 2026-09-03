"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

import { Backdrop, Decorations } from "./booking/BookingUI";
import SuccessStep from "./booking/SuccessStep";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY = { parentName: "", studentName: "", classGrade: "", phone: "", place: "" };

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // lock scroll (incl. Lenis) + back-button trap while open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // @ts-ignore
    if (window.lenis) window.lenis.stop();
    window.history.pushState({ modalOpen: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      // @ts-ignore
      if (window.lenis) window.lenis.start();
      window.removeEventListener("popstate", onPop);
      if (window.history.state?.modalOpen) window.history.back();
    };
  }, [isOpen, onClose]);

  const set = (field: keyof typeof EMPTY, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.parentName.trim()) e.parentName = "Required";
    if (!form.studentName.trim()) e.studentName = "Required";
    if (!form.classGrade) e.classGrade = "Required";
    if (!form.place.trim()) e.place = "Required";
    const digits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) e.phone = "Required";
    else if (countryCode === "+91" && digits.length !== 10) e.phone = "Enter a 10-digit number";
    else if (countryCode === "+971" && (digits.length < 7 || digits.length > 9))
      e.phone = "Enter a valid UAE number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setForm(EMPTY);
      setErrors({});
      setIsSubmitted(false);
      setIsSubmitting(false);
    }, 500);
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (isSubmitting || !validate()) return;
    setIsSubmitting(true);

    const payload = {
      parentName: form.parentName.trim(),
      studentName: form.studentName.trim(),
      classGrade: form.classGrade,
      phone: `${countryCode} ${form.phone.trim()}`,
      place: form.place.trim(),
    };

    // optimistic — the server also mirrors to the Sheet, which is slow
    fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("Booking submission error:", err));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  }

  if (!isOpen) return null;

  const fieldCls =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-secondary-yellow";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/70";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Backdrop onClick={handleClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#562190] shadow-[0_0_80px_rgba(0,0,0,0.4)]"
      >
        <Decorations isSubmitted={isSubmitted} />

        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: 'url("/assets/images/step1bg.webp")' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#562190]/40 via-[#562190]/85 to-[#562190]" />

        <div className="relative z-10 flex flex-col">
          <div className="flex items-center justify-end px-4 py-3 md:px-6">
            <button
              onClick={handleClose}
              className="group rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <IoClose size={26} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          <div className="px-6 pb-8 pt-2 md:px-10">
            {isSubmitted ? (
              <SuccessStep selectedProgram="TinkerChamps" onDone={handleClose} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" data-lenis-prevent>
                <div className="mb-6">
                  <h2 className="font-covered text-3xl font-bold text-white md:text-4xl">
                    Book a <span className="text-secondary-yellow">Seat</span>
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Fill this in and our team will call you back within 24 hours.
                  </p>
                </div>

                <div>
                  <label htmlFor="bm-parent" className={labelCls}>
                    Parent&apos;s name
                  </label>
                  <input
                    id="bm-parent"
                    className={fieldCls}
                    placeholder="e.g. Anjali Menon"
                    value={form.parentName}
                    onChange={(e) => set("parentName", e.target.value)}
                  />
                  {errors.parentName && (
                    <p className="mt-1 text-xs text-secondary-yellow">{errors.parentName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bm-student" className={labelCls}>
                    Student&apos;s name
                  </label>
                  <input
                    id="bm-student"
                    className={fieldCls}
                    placeholder="e.g. Aarav Menon"
                    value={form.studentName}
                    onChange={(e) => set("studentName", e.target.value)}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-xs text-secondary-yellow">{errors.studentName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bm-class" className={labelCls}>
                    Class
                  </label>
                  <select
                    id="bm-class"
                    className={`${fieldCls} appearance-none`}
                    value={form.classGrade}
                    onChange={(e) => set("classGrade", e.target.value)}
                  >
                    <option value="" className="text-primary-purple">
                      Select class
                    </option>
                    {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                      <option key={c} value={c} className="text-primary-purple">
                        Class {c}
                      </option>
                    ))}
                  </select>
                  {errors.classGrade && (
                    <p className="mt-1 text-xs text-secondary-yellow">{errors.classGrade}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bm-phone" className={labelCls}>
                    Phone
                  </label>
                  <div className="flex gap-2">
                    <select
                      aria-label="Country code"
                      className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-white outline-none focus:border-secondary-yellow"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91" className="text-primary-purple">
                        +91
                      </option>
                      <option value="+971" className="text-primary-purple">
                        +971
                      </option>
                    </select>
                    <input
                      id="bm-phone"
                      className={fieldCls}
                      placeholder="10-digit number"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-secondary-yellow">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bm-place" className={labelCls}>
                    Location
                  </label>
                  <input
                    id="bm-place"
                    className={fieldCls}
                    placeholder="Town / city"
                    value={form.place}
                    onChange={(e) => set("place", e.target.value)}
                  />
                  {errors.place && (
                    <p className="mt-1 text-xs text-secondary-yellow">{errors.place}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-primary-purple shadow-[0_10px_30px_rgba(253,198,56,0.3)] transition-all hover:bg-white disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-primary-purple"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
