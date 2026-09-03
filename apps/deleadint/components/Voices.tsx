import type { CSSProperties } from "react";
import { getVoices } from "@/lib/content";

const palette: [string, string][] = [
  ["var(--cream2)", "var(--ink)"],
  ["var(--ink)", "#fff"],
  ["var(--magenta-deep)", "#fff"],
  ["#2a4d3a", "#fff"],
];

function initials(name: string) {
  const parts = name
    .replace(/\b(Dr|Mr|Mrs|Ms|Prof)\.?\s+/gi, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]![0]!;
  const last = parts.length > 1 ? parts[parts.length - 1]![0]! : "";
  return (first + last).toUpperCase();
}

export async function Voices() {
  const rows = await getVoices();

  return (
    <section className="voices" id="voices">
      <div className="container voices-layout">
        <div className="voices-pin reveal">
          <span className="eyebrow">What People Notice</span>
          <h2>Not our words, theirs</h2>
          <p>Voices from the schools, parents and companies we&apos;ve worked with.</p>
        </div>

        <div className="voices-stack">
          {rows.map((t, i) => {
            const [bg, fg] = palette[i % palette.length]!;
            const role = t.sourceNote ? `${t.authorRole}, ${t.sourceNote}` : t.authorRole;
            return (
              <div
                key={t.id}
                className="voice-stackcard"
                style={{ "--vsc-bg": bg, "--vsc-fg": fg } as CSSProperties}
              >
                <span className="vsc-num">{String(i + 1).padStart(2, "0")}</span>
                <p className="vsc-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="vsc-who">
                  <span className="vsc-avatar">{initials(t.authorName)}</span>
                  <div>
                    <b>{t.authorName}</b>
                    <span>{role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
