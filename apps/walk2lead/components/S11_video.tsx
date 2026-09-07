export function S11_video() {
  return (
    <>
      <section className="bg-white [border-bottom:1px_solid_var(--color-line)] [border-top:1px_solid_var(--color-line)]">
        <div className="wrap">
          <div className="eyebrow reveal">Watch it happen</div>
          <h2 className="h2 reveal">Hear it from DIET Malappuram</h2>
          <div className="reveal mt-11 grid grid-cols-[1.3fr_1fr] items-center gap-10 max-[900px]:grid-cols-1">
            <div className="aspect-video overflow-hidden rounded-[20px] bg-black shadow-card">
              <iframe
                src="https://www.youtube.com/embed/7MLKKZ3hG2M"
                title="Impact of Walk2Lead in Malappuram: Dr. Babu Varghese, Principal of DIET Malappuram"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
            <div>
              <blockquote className="mb-3.5 font-serif text-[1.2rem] italic leading-[1.4]">
                &quot;The Walk2Lead programme has been a watershed moment for our government
                schools.&quot;
              </blockquote>
              <cite className="block text-[0.9rem] font-semibold not-italic text-accent">
                Dr. Babu Varghese, Principal, DIET Malappuram
              </cite>
              <div className="mt-[22px] flex flex-col items-start gap-2.5">
                <a
                  className="btn btn-ghost"
                  href="https://www.youtube.com/watch?v=Iwgu1fta5KI"
                  target="_blank"
                  rel="noopener"
                >
                  Watch the GSHSS Meppayil win →
                </a>
                <a
                  className="btn btn-ghost"
                  href="https://www.youtube.com/@Deleadinternational/videos"
                  target="_blank"
                  rel="noopener"
                >
                  More on our YouTube channel →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
    </>
  );
}
