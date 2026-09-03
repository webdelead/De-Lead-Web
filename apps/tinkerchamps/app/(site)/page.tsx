import dynamic from "next/dynamic";
import HeroSection from "../components/HeroSection";
import ScrollColorBackground from "../components/ScrollColorBackground";
import VideoSection from "../components/Videosection";

// Dynamically import below-the-fold Client Components to reduce initial JS payload
const StatsSection = dynamic(() => import("../components/StatsSection"));
const AboutSection = dynamic(() => import("../components/AboutSection"));
const MarqueeSection = dynamic(() => import("../components/MarqueeSection"));
const EventsSection = dynamic(() => import("../components/EventsSection"));
const TestimonialsSection = dynamic(
  () => import("../components/TestimonialSection"),
);
const WhatsappReviewsSection = dynamic(
  () => import("../components/WhatsappReviewsSection"),
);
const LearningSection = dynamic(() => import("../components/LearningSection"));
const ScrollJourneySection = dynamic(
  () => import("../components/ScrollJourneySection"),
);
const GallerySection = dynamic(() => import("../components/GallerySection"));
const FAQSection = dynamic(() => import("../components/FAQSection"));

export default function Home() {
  return (
    <main className="w-full flex items-center justify-center flex-col">
      <ScrollColorBackground>
        <HeroSection />
        <VideoSection />
        <StatsSection />
        <AboutSection />
        <MarqueeSection />
        <EventsSection />
        <TestimonialsSection />
        <WhatsappReviewsSection />
        <LearningSection />
        <ScrollJourneySection />
        <GallerySection />
        <FAQSection />
      </ScrollColorBackground>
    </main>
  );
}
