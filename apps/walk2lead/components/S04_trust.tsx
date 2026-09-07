const DIETS = [
  ["logo-diet-mlp.jpg", "DIET Malappuram"],
  ["logo-diet-kkd.png", "DIET Kozhikode"],
  ["logo-diet-knr.jpg", "DIET Kannur"],
  ["logo-diet-wyd.jpg", "DIET Wayanad"],
];

export function S04_trust() {
  return (
    <>
      {/* .reveal stays until the main.js -> @delead/ui <Reveal> swap */}
      <div className="reveal border-y border-solid border-line bg-white py-[30px] max-[600px]:py-6">
        <div className="wrap flex flex-wrap items-center justify-center gap-11 max-[600px]:flex-col max-[600px]:gap-4">
          <div className="flex items-center gap-3.5 max-[600px]:justify-center">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Implemented by
            </span>
            <img
              loading="lazy"
              decoding="async"
              src="/assets/logo-delead-dark.png"
              alt="De' Lead International"
              className="h-[42px] w-auto object-contain [mix-blend-mode:multiply] max-[600px]:h-[34px]"
            />
          </div>
          <div className="flex flex-nowrap items-center gap-5 max-[600px]:w-full max-[600px]:flex-col max-[600px]:gap-4">
            <div className="flex items-center gap-5 max-[600px]:justify-center">
              <img
                loading="lazy"
                decoding="async"
                src="/assets/logo-walkaroo.jpg"
                alt="Walkaroo Foundation"
                className="h-[42px] w-auto object-contain [mix-blend-mode:multiply]"
              />
            </div>
            <div className="flex items-center gap-5 max-[600px]:w-full max-[600px]:justify-between max-[600px]:gap-2.5">
              {DIETS.map(([file, alt]) => (
                <img
                  key={file}
                  loading="lazy"
                  decoding="async"
                  src={`/assets/${file}`}
                  alt={alt}
                  className="h-[42px] w-auto object-contain [mix-blend-mode:multiply] max-[600px]:h-auto max-[600px]:max-h-[48px] max-[600px]:max-w-[23%] max-[600px]:flex-1"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT / PROGRAM */}
    </>
  );
}
