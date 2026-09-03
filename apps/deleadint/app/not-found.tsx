import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found — De' Lead International" };

export default function NotFound() {
  return (
    <main className="nf-wrap">
      <style>{`
        .nf-wrap{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;gap:22px;padding:64px 24px;background:var(--cream);color:var(--ink)}
        .nf-wrap img{height:34px;width:auto;margin-bottom:8px}
        .nf-code{font-family:'Lora',Georgia,serif;font-weight:700;letter-spacing:-.02em;line-height:1;
          font-size:clamp(88px,18vw,180px);color:var(--magenta);margin:0}
        .nf-title{font-family:'Lora',Georgia,serif;font-weight:600;font-size:clamp(22px,4vw,32px);margin:0}
        .nf-copy{max-width:44ch;color:var(--ink-soft);font-size:1.02rem;line-height:1.65;margin:0}
        .nf-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:6px}
      `}</style>
      <img src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
      <p className="nf-code">404</p>
      <h1 className="nf-title">This page wandered off</h1>
      <p className="nf-copy">
        The page you&rsquo;re after doesn&rsquo;t exist or has moved. Let&rsquo;s get you back to
        the De&rsquo; Lead ecosystem.
      </p>
      <div className="nf-actions">
        <a className="btn btn-primary" href="/">
          Back to home
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
        <a className="btn btn-ghost" href="/#eco">Explore the ecosystem</a>
      </div>
    </main>
  );
}
