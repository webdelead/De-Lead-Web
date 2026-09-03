import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found — MakerChamps" };

export default function NotFound() {
  return (
    <main className="nf-wrap">
      <style>{`
        .nf-wrap{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;gap:20px;padding:64px 24px;background:var(--mc-navy);color:var(--mc-white)}
        .nf-wrap img{height:40px;width:auto;margin-bottom:6px}
        .nf-code{font-family:var(--font-mega);font-size:clamp(96px,20vw,200px);line-height:.9;margin:0;
          color:var(--mc-lime);letter-spacing:.02em}
        .nf-title{font-family:var(--font-display);font-weight:700;font-size:clamp(22px,4vw,34px);margin:0}
        .nf-copy{max-width:46ch;color:rgba(255,255,255,.72);font-size:1.02rem;line-height:1.65;margin:0}
        .nf-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:8px}
        .nf-actions .btn-ghost{border:1.5px solid rgba(255,255,255,.35);color:#fff;background:transparent}
      `}</style>
      <img src="/assets/brand/makerchamps-logo-on-dark.webp" alt="MakerChamps" />
      <p className="nf-code">404</p>
      <h1 className="nf-title">Nothing to build here</h1>
      <p className="nf-copy">
        This page doesn&rsquo;t exist. Head back and see what two days on the NIT Calicut campus
        actually looks like.
      </p>
      <div className="nf-actions">
        <a className="btn btn-primary" href="/">Back to home</a>
        <a className="btn btn-ghost" href="/#enquire">Enquire about a seat</a>
      </div>
    </main>
  );
}
