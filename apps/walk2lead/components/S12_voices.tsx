import type { CSSProperties } from "react";
import { getVoices } from "@/lib/content";

const chevL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const chevR = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }} aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PHOTO_STYLE: Record<string, CSSProperties> = {
  "Dr. Sumitra Binu": { objectPosition: "50% 10%" },
};

const sliderBtn =
  "grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-white text-ink transition-colors [border:1.5px_solid_var(--color-line)] hover:text-w2l hover:[border-color:var(--color-w2l)]";
const mark = "font-serif text-[3.4rem] leading-[0] text-w2l-bright opacity-90";

export async function S12_voices() {
  const rows = await getVoices();
  const features = rows.filter((r) => r.sourceNote === "feature");
  const slider = rows.filter((r) => r.sourceNote !== "feature");

  return (
    <>
      <section id="voices" className="bg-cream">
        <div className="wrap">
          <div className="eyebrow reveal">Voices</div>
          <h2 className="h2 reveal">
            The foundation, the government, the schools, and the parents
          </h2>

          {features.map((f) => (
            <div
              className="reveal mt-12 flex overflow-hidden rounded-[20px] bg-ink max-[700px]:flex-col"
              key={f.id}
            >
              <div className="flex flex-[0_0_300px] items-stretch justify-center bg-cream-2 max-[700px]:flex-[0_0_auto]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={f._url}
                  alt={f.authorName}
                  style={PHOTO_STYLE[f.authorName]}
                  className="h-full w-full object-cover object-top max-[700px]:max-h-[280px]"
                />
              </div>
              <div className="flex-[1_1_auto] px-[42px] py-10 text-white">
                <span className={`${mark} mb-4 block`}>&quot;</span>
                <p className="mb-[22px] text-[1.12rem] italic text-white/85">{f.quote}</p>
                <div className="flex items-center gap-3.5">
                  <div>
                    <b className="block text-[0.98rem] text-white">{f.authorName}</b>
                    <span className="text-[0.82rem] text-white/60">{f.authorRole}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="reveal mt-[26px]">
            {/* .quote class + #quote-track id kept — main.js
                initInfiniteSlider('quote-track', …, '.quote', 4800) drives this */}
            <div
              id="quote-track"
              className="flex gap-[22px] overflow-x-auto overflow-y-hidden scroll-smooth pb-1 [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {slider.map((q) => (
                <div
                  className="quote relative flex h-full flex-[0_0_calc(50%-11px)] flex-col rounded-[20px] bg-white px-8 py-[34px] [border:1px_solid_var(--color-line)] [scroll-snap-align:start] max-[900px]:flex-[0_0_88%]"
                  key={q.id}
                >
                  <span className={`${mark} absolute left-[30px] top-[38px]`}>&quot;</span>
                  <p className="mb-[22px] mt-[18px] flex-[1_1_auto] pt-2 text-[0.97rem] italic text-ink-soft">
                    {q.quote}
                  </p>
                  <div className="mt-auto flex items-center gap-3.5">
                    <div className="grid h-[46px] w-[46px] min-h-[46px] min-w-[46px] flex-[0_0_46px] place-items-center self-center overflow-hidden rounded-full bg-w2l font-serif font-semibold text-white">
                      {q._url ? (
                        <img
                          loading="lazy"
                          decoding="async"
                          src={q._url}
                          alt={q.authorName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        (q.authorName.split(/\s+/).pop() ?? "?")[0]
                      )}
                    </div>
                    <div>
                      <b className="block text-[0.94rem]">{q.authorName}</b>
                      <span className="text-[0.8rem] text-ink-soft">{q.authorRole}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[18px] flex justify-end gap-2.5">
              <button className={sliderBtn} id="quote-prev" aria-label="Previous testimonial">
                {chevL}
              </button>
              <button className={sliderBtn} id="quote-next" aria-label="Next testimonial">
                {chevR}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DE'LEAD SPOTLIGHT */}
    </>
  );
}
