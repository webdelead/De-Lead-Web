const card =
  "reveal rounded-[20px] px-[30px] py-[34px] [border:1px_solid_var(--color-line)]";
const role = "mb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-accent";
const logo = "mb-5 h-[52px] w-auto object-contain [mix-blend-mode:multiply]";

export function S16_stake() {
  return (
    <>
      <section style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="eyebrow reveal">Stakeholders</div>
          <h2 className="h2 reveal">One implementation team. Two partners who make it possible.</h2>
          <div className="mt-12 grid grid-cols-[1.15fr_1fr_1fr] items-stretch gap-[22px] max-[900px]:grid-cols-1">
            <div className={`${card} border-none bg-magenta text-white`}>
              <img
                loading="lazy"
                decoding="async"
                src="/assets/logo-delead-dark.png"
                alt="De' Lead International"
                className="mb-5 h-[52px] w-auto object-contain [filter:brightness(0)_invert(1)]"
              />
              <div className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#f3c9e2]">
                CSR Implementation Team
              </div>
              <h3 className="mb-2.5 text-[1.15rem]">De&apos; Lead International</h3>
              <p className="text-[0.88rem] text-white/85">
                A multi-domain training and education solutions company operating across India and
                the UAE, blending pedagogy, psychology and technology to run high-impact STEM
                programmes end-to-end: curriculum, trainers, kits, monitoring and expos.
              </p>
            </div>
            <div className={`${card} bg-white`}>
              <img
                loading="lazy"
                decoding="async"
                src="/assets/logo-walkaroo.jpg"
                alt="Walkaroo Foundation"
                className={logo}
              />
              <div className={role}>Funding &amp; CSR</div>
              <h3 className="mb-2.5 text-[1.15rem]">Walkaroo Foundation</h3>
              <p className="text-[0.88rem] text-ink-soft">
                The not-for-profit CSR arm of the Walkaroo Group, focused on education, healthcare,
                women&apos;s empowerment and community development. It funds Walk2Lead as part of its
                commitment to bridging the digital divide.
              </p>
            </div>
            <div className={`${card} bg-white`}>
              <div className="mb-5 flex gap-3">
                {[
                  ["logo-diet-mlp.jpg", "DIET Malappuram"],
                  ["logo-diet-kkd.png", "DIET Kozhikode"],
                  ["logo-diet-knr.jpg", "DIET Kannur"],
                  ["logo-diet-wyd.jpg", "DIET Wayanad"],
                ].map(([file, alt]) => (
                  <img
                    key={file}
                    loading="lazy"
                    decoding="async"
                    src={`/assets/${file}`}
                    alt={alt}
                    className="m-0 h-[52px] w-auto object-contain [mix-blend-mode:multiply]"
                  />
                ))}
              </div>
              <div className={role}>Academic Partners</div>
              <h3 className="mb-2.5 text-[1.15rem]">DIET: Malappuram, Kozhikode, Kannur &amp; Wayanad</h3>
              <p className="text-[0.88rem] text-ink-soft">
                District Institutes of Education and Training provide official endorsement, school
                selection and coordination, converting a private initiative into a scalable
                intervention inside the government school system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRESS */}
    </>
  );
}
