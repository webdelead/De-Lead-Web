"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f4f4] text-gray-700 px-6 md:px-16 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Divider */}
        <div className="border-t border-gray-300 mb-10"></div>

        {/* Main Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          {/* LEFT CONTENT */}
          <div className="space-y-5 text-sm">
            <div className="flex gap-4">
              <span className="font-semibold min-w-20">Address :</span>
              <p>
                2nd Floor, Maharajah Complex,
                <br />
                Ramanattukara,
                <br />
                Kozhikode, Kerala, INDIA, 673633
              </p>
            </div>

            <div className="flex gap-4">
              <span className="font-semibold min-w-20">Contact :</span>
              <p>+91 807 556 6081</p>
            </div>

            <div className="flex gap-4">
              <span className="font-semibold min-w-20">Email :</span>
              <p>info@deleadint.com</p>
            </div>
          </div>

          {/* RIGHT LOGO */}
          <div className="relative w-60 h-auto">
            <Image
              src="/assets/TCLogo.webp"
              alt="TinkerChamps"
              width={240}
              height={100}
              className="w-60 h-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Social Icons */}
          <div className="flex items-center gap-6 text-gray-600">
            <Link
              href="https://www.instagram.com/tinker_champs"
              target="_blank"
              className="flex items-center gap-2 hover:text-black"
            >
              <FaInstagram size={16} />
              Instagram
            </Link>

            <Link
              href="https://www.linkedin.com/company/deleadint/"
              target="_blank"
              className="flex items-center gap-2 hover:text-black"
            >
              <FaLinkedin size={16} />
              LinkedIn
            </Link>

            <Link
              href="https://youtube.com/@deleadinternational"
              target="_blank"
              className="flex items-center gap-2 hover:text-black"
            >
              <FaYoutube size={16} />
              YouTube
            </Link>
          </div>

          {/* Copyright & Credit */}
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-gray-500 text-xs md:text-sm">
            <p>Tinkerchamps©2026 All rights reserved</p>
            <span className="hidden md:block text-gray-300">|</span>
            <p>
              Designed and developed by{" "}
              <Link
                href="https://wizzyminds.com"
                target="_blank"
                className="font-semibold hover:text-black transition-colors"
              >
                wizzyminds
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
