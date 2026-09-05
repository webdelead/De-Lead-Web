"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { IoChevronForwardOutline } from "react-icons/io5";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#learning", label: "Activities" },
  { href: "#gallery", label: "Gallery" },
];

import { useBookingModal } from "../context/ModalContext";

export default function Navbar() {
  const { openBookingModal } = useBookingModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  // Hide on scroll-down / show on scroll-up — same pattern as every other
  // site (deleadint/walk2lead/makerchamps/corporate/dli-education
  // public/js/main.js).
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const isOpenRef = useRef(isOpen);
  const { scrollY } = useScroll();

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) setNavHidden(false);
  }, [isOpen]);

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    setIsScrolled(currentScrollY > 10);

    if (isOpenRef.current) {
      setNavHidden(false);
    } else if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
      setNavHidden(true);
    } else if (currentScrollY < lastScrollYRef.current) {
      setNavHidden(false);
    }
    lastScrollYRef.current = currentScrollY;

    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    let current = sectionIds[0] || "hero";
    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (!section) continue;

      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.3) {
        current = id;
      }
    }

    setActiveSection(current);
  });

  // Lock body scroll on mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Outer fixed bar */}
      <motion.header
        className="fixed inset-x-0 top-1 z-50 md:px-6 px-2"
        animate={{ y: navHidden ? "-120%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          initial={{
            y: -20,
            opacity: 0,
            borderRadius: 0,
            backgroundColor: "rgba(0,0,0,0)",
            boxShadow: "none",
          }}
          animate={{
            y: isScrolled ? 8 : 0,
            opacity: 1,
            borderRadius: 16,
            backgroundColor: isScrolled ? "#562190" : "rgba(0,0,0,0)",
            boxShadow: isScrolled ? "0 0 24px rgba(86,33,144,0.4)" : "none",
          }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
          className="mx-auto px-3"
        >
          <nav
            className="flex items-center justify-between w-full md:py-2 py-2"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link href="#hero" scroll={true}>
              <Image
                src="/assets/TCLogo.webp"
                alt="Tinkerchamps Logo"
                width={100}
                height={75}
                className="object-contain cursor-pointer"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2 text-base font-semibold text-white border-2 border-secondary-grey-1 rounded-full px-2 py-1 bg-[#562190]/60 backdrop-blur-md">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    scroll={true}
                    className={`px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-white text-[#562190]"
                        : "text-white hover:text-white hover:bg-[#562190]/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={openBookingModal}
                className="flex items-center px-5 py-2 rounded-full text-white text-base font-semibold border-2 border-secondary-grey-1 hover:bg-white hover:text-[#562190] transition-colors duration-300"
              >
                <span className="flex items-center gap-2">
                  Book Now <IoChevronForwardOutline className="text-2xl" />
                </span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-3xl text-white z-50"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden overflow-hidden"
              >
                <div className="bg-[#562190]/90 border border-[#562190] rounded-2xl mt-3 mb-2 backdrop-blur-md">
                  <div className="p-4 flex flex-col items-center text-center space-y-2">
                    {NAV_ITEMS.map((item, idx) => {
                      const isActive =
                        activeSection === item.href.replace("#", "");
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="w-[80%]"
                        >
                          <Link
                            href={item.href}
                            scroll={true}
                            onClick={closeMenu}
                            className={`flex justify-center items-center w-full px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${
                              isActive
                                ? "bg-white text-[#562190]"
                                : "text-white hover:bg-white/20"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/10 p-4 flex flex-col items-center text-center space-y-3">
                    <button
                      onClick={() => {
                        closeMenu();
                        openBookingModal();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-bold text-base border border-white hover:bg-white hover:text-[#562190] transition-all duration-300"
                    >
                      Join Now
                      <IoChevronForwardOutline className="text-xl" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
}
