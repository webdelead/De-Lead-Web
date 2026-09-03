import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StatBand } from "@/components/StatBand";
import { AssocMarquee } from "@/components/AssocMarquee";
import { About } from "@/components/About";
import { EcoIntro } from "@/components/EcoIntro";
import { VStack } from "@/components/VStack";
import { Press } from "@/components/Press";
import { Voices } from "@/components/Voices";
import { Gallery } from "@/components/Gallery";
import { Journal } from "@/components/Journal";
import { CtaBand } from "@/components/CtaBand";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

// ISR: regenerate at most hourly; the dashboard's Publish button hits
// /api/revalidate for instant updates.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <StatBand />
      <AssocMarquee />
      <About />
      <EcoIntro />
      <VStack />
      <Press />
      <Voices />
      <Gallery />
      <Journal />
      <CtaBand />
      <ContactForm />
      <Footer />
    </>
  );
}
