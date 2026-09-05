import dynamic from "next/dynamic";
import HeroSection from "../components/HeroSection";
import ScrollColorBackground from "../components/ScrollColorBackground";
import VideoSection from "../components/Videosection";
import { getEvents, getGallery, getReviews, getTestimonials } from "../lib/tc-db";

// ISR: cache the rendered page for an hour; the dashboard's "Publish to site"
// button hits /api/revalidate for an instant refresh. No per-visitor DB hit.
export const revalidate = 3600;

// Dynamically import below-the-fold Client Components to reduce initial JS payload
const StatsSection = dynamic(() => import("../components/StatsSection"));
const AboutSection = dynamic(() => import("../components/AboutSection"));
const DirectorsNoteSection = dynamic(
  () => import("../components/DirectorsNoteSection"),
);
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

export default async function Home() {
  const [events, gallery, reviews, testimonials] = await Promise.all([
    getEvents(false),
    getGallery(),
    getReviews(),
    getTestimonials(),
  ]);

  return (
    <main className="w-full flex items-center justify-center flex-col">
      <ScrollColorBackground>
        <HeroSection />
        <VideoSection />
        <StatsSection />
        <AboutSection />
        <DirectorsNoteSection />
        <MarqueeSection />
        <EventsSection events={events} />
        <TestimonialsSection testimonials={testimonials} />
        <WhatsappReviewsSection
          reviews={reviews.map((r) => ({ id: r._id, url: r.screenshot, title: r.title }))}
        />
        <LearningSection />
        <ScrollJourneySection />
        <GallerySection items={gallery.map((g) => ({ image: g.image }))} />
        <FAQSection />
      </ScrollColorBackground>
    </main>
  );
}
