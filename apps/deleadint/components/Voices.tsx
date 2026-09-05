import { getVoices } from "@/lib/content";
import { VoicesCarousel, type VoiceRow } from "./VoicesCarousel";

export async function Voices() {
  const rows = (await getVoices()) as VoiceRow[];

  return (
    <section className="voices" id="voices">
      <div className="container">
        <div className="voices-head reveal">
          <span className="eyebrow">What People Notice</span>
          <h2>Not our words, theirs</h2>
          <p>
            Voices from the schools, parents and companies we&apos;ve worked with.
          </p>
        </div>

        <VoicesCarousel rows={rows} />
      </div>
    </section>
  );
}
