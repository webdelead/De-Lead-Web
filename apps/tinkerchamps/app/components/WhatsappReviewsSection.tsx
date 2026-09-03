"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaWhatsapp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { client, urlFor } from "../../sanity/lib/client";

interface ReviewImage {
  id: string;
  url: string;
  title?: string;
}

const mockReviews: ReviewImage[] = [
  {
    id: "mock-1",
    url: "/assets/images/whatsapp_review_1.png",
    title: "Review from Parent Anya",
  },
  {
    id: "mock-2",
    url: "/assets/images/whatsapp_review_2.png",
    title: "Review from Parent Kabir",
  },
];

export default function WhatsappReviewsSection() {
  const [reviews, setReviews] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "whatsappReview"] | order(_createdAt desc)`)
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item._id,
            url: urlFor(item.screenshot).url(),
            title: item.title,
          }));
          setReviews(formatted);
        } else {
          setReviews(mockReviews);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch WhatsApp reviews:", err);
        setReviews(mockReviews);
        setLoading(false);
      });
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <section className="w-full py-16 flex justify-center items-center h-60">
        <div className="animate-spin h-8 w-8 border-4 border-[#FBC333] border-t-transparent rounded-full" />
      </section>
    );
  }

  return (
    <section id="whatsapp-reviews" className="py-16 md:py-24 w-full relative overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-4 relative">
          {/* <p className="text-[#FBC333] font-semibold tracking-wider text-xs uppercase mb-2">
            Direct & Unedited Testimonials
          </p> */}
          <h2 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
            What Parents Share on
          </h2>
          <h2 className="text-6xl md:text-8xl font-bold font-covered text-[#FBC333] -mt-2">
            WHATSAPP
          </h2>
        </div>
      </div>

      {/* MANUAL SCROLL ROW */}
      <div className="w-full relative py-4 select-none">
        {/* Subtle gradients on left and right for fade out effect */}
        {/* <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-primary-purple to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-primary-purple to-transparent z-10 pointer-events-none" /> */}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-8 md:px-24 py-4"
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[300px]"
            >
              <div
                className="group/card relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-3 shadow-xl flex flex-col items-center justify-center aspect-[9/16]"
              >
                {/* WhatsApp Indicator Icon */}
                <div className="absolute top-4 right-4 z-10 bg-emerald-500 text-white p-2 rounded-full shadow-md group-hover/card:scale-110 transition-transform duration-300">
                  <FaWhatsapp size={16} />
                </div>

                {/* Review Image */}
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/20">
                  <Image
                    src={review.url}
                    alt={review.title || "WhatsApp Review Screenshot"}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => scroll("left")}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-300 text-[#3E136D] transition shadow-lg cursor-pointer active:scale-95"
          aria-label="Scroll left"
        >
          <FaArrowLeft size={16} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-300 text-[#3E136D] transition shadow-lg cursor-pointer active:scale-95"
          aria-label="Scroll right"
        >
          <FaArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
