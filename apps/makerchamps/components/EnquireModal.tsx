"use client";

import { useEffect, useState } from "react";

/* Auto-opening enquiry popup — same 5 fields as the #enquiryForm footer form
 * (S11_enquire.tsx), just its own modal instance with data-lead-source so
 * public/js/lead-capture.js wires + submits it independently. Not styled
 * like TinkerChamps' BookingModal — this uses MakerChamps' own cream-card /
 * torn-triangle idiom instead. */

const AUTO_OPEN_DELAY_MS = 10000;

const field = "block";
const labelC = "mb-1.5 block text-[0.78rem] font-semibold opacity-75";
const inputC =
  "w-full rounded-[var(--radius-sm)] [padding:12px_14px] text-[0.95rem] [font-family:var(--font-inter)] [background:var(--color-mc-white)] [border:1.5px_solid_rgba(2,30,93,0.18)] focus:outline-none focus:[border-color:var(--color-mc-orange)]";

export function EnquireModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // skip the popup if they already sent the footer form
      const footerForm = document.getElementById("enquiryForm") as HTMLFormElement | null;
      if (footerForm?.dataset.leadDone) return;
      setIsOpen(true);
    }, AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div
      className={`enquire-modal${isOpen ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquireModalTitle"
      aria-hidden={!isOpen}
    >
      <div className="enquire-modal-backdrop" onClick={() => setIsOpen(false)} />
      <div className="enquire-modal-card">
        <span
          className="torn-triangle"
          style={{ top: -14, right: 28 }}
          aria-hidden="true"
        />
        <button
          type="button"
          className="enquire-modal-close"
          aria-label="Close"
          onClick={() => setIsOpen(false)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <span className="eyebrow" style={{ color: "var(--mc-orange)" }}>
          Only 60 seats per season
        </span>
        <h3 id="enquireModalTitle" className="mt-1 text-[1.3rem] [color:var(--color-mc-navy)]">
          Don&apos;t miss the next batch
        </h3>
        <p className="mt-1.5 text-[0.85rem] opacity-70">
          Leave your details and our team will call you back within 24 hours.
        </p>

        <form data-lead-source="makerchamps" className="mt-4 flex flex-col gap-3.5" id="enquireModalForm">
          <div className={field}>
            <label htmlFor="emParentName" className={labelC}>
              Parent&apos;s Name
            </label>
            <input type="text" id="emParentName" name="parentName" required className={inputC} />
          </div>
          <div className={field}>
            <label htmlFor="emChildClass" className={labelC}>
              Child&apos;s Class
            </label>
            <select id="emChildClass" name="childClass" required defaultValue="" className={inputC}>
              <option value="" disabled>
                Select class
              </option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
            </select>
          </div>
          <div className={field}>
            <label htmlFor="emPhone" className={labelC}>
              Phone Number
            </label>
            <input type="tel" id="emPhone" name="phone" required className={inputC} />
          </div>
          <div className={field}>
            <label htmlFor="emEmail" className={labelC}>
              Email
            </label>
            <input type="email" id="emEmail" name="email" className={inputC} />
          </div>
          <div className={field}>
            <label htmlFor="emMessage" className={labelC}>
              Message (optional)
            </label>
            <textarea id="emMessage" name="message" rows={3} className={inputC}></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Send Enquiry
          </button>
          <p className="text-center text-[0.76rem] opacity-60">
            We&apos;ll get back to you within 24 hours. No spam, ever.
          </p>
        </form>
      </div>
    </div>
  );
}
