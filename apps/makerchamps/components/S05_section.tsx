const ROWS: [string, string][] = [
  ['"I don\'t know what I want to be"', '"I want to build solutions to real problems"'],
  ["Hesitant to speak in class", "Pitches an idea to a room full of people"],
  ["Waits for the teacher to give the answer", "Spots a problem and builds a solution"],
  ["Studying to pass exams", "Studying with a reason, to build something"],
];

const beforeC =
  "[padding:12px_14px] rounded-[var(--radius-sm)] text-[0.92rem] leading-[1.4] [background:rgba(254,85,1,0.12)] [border-left:3px_solid_var(--color-mc-orange)]";
const afterC =
  "[padding:12px_14px] rounded-[var(--radius-sm)] text-[0.92rem] leading-[1.4] font-semibold [background:rgba(190,216,10,0.12)] [border-left:3px_solid_var(--color-mc-lime)]";

export function S05_section() {
  return (
    <>
      <section className="section [background:var(--color-mc-navy)] [color:var(--color-mc-cream)]">
        <div className="pattern-bg on-dark"></div>
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: "var(--mc-lime)" }}>
              In two days, something shifts
            </span>
            <h2>You won&apos;t see the change in a certificate</h2>
            <p className="lede [color:rgba(247,247,247,0.78)]">
              You&apos;ll see it in how they talk, what they want, and how they carry themselves.
              Here&apos;s what parents tell us they notice.
            </p>
          </div>
          <div className="reveal-stagger flex flex-col gap-[14px]">
            {ROWS.map(([b, a]) => (
              <div
                key={b}
                className="stagger-item grid grid-cols-1 gap-2 rounded-[var(--radius-md)] p-4 [background:rgba(247,247,247,0.05)] [border:1px_solid_rgba(247,247,247,0.12)] md:grid-cols-[1fr_auto_1fr] md:items-center"
              >
                <div className={beforeC}>{b}</div>
                <div className="flex items-center justify-center text-[0.8rem] [color:var(--color-mc-lime)]">
                  →
                </div>
                <div className={afterC}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
