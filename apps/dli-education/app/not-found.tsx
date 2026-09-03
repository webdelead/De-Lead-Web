import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found — DLI Education" };

export default function NotFound() {
  return (
    <main className="nf-wrap">
      <style>{`
        .nf-wrap{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;gap:20px;padding:64px 24px;background:var(--bg);color:var(--ink)}
        .nf-wrap img{height:30px;width:auto;margin-bottom:8px}
        .nf-code{font-family:var(--font);font-weight:800;letter-spacing:-.03em;line-height:1;
          font-size:clamp(92px,18vw,190px);color:var(--coral);margin:0}
        .nf-title{font-family:var(--font);font-weight:700;font-size:clamp(22px,4vw,32px);margin:0}
        .nf-copy{max-width:46ch;color:var(--ink-soft);font-size:1.02rem;line-height:1.65;margin:0}
        .nf-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:8px}
      `}</style>
      <img src="/assets/logo/logo-delead-dark.png" alt="De' Lead International" />
      <p className="nf-code">404</p>
      <h1 className="nf-title">This lesson doesn&rsquo;t exist</h1>
      <p className="nf-copy">
        The page you&rsquo;re after isn&rsquo;t here. Head back to the DLI Education catalogue for
        students and working professionals.
      </p>
      <div className="nf-actions">
        <a className="btn btn-magenta" href="/">Back to home</a>
        <a className="btn btn-outline" href="/students">Browse courses</a>
      </div>
    </main>
  );
}
