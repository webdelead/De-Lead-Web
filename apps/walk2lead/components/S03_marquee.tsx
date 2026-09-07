const ITEMS = [
  "Robotics",
  "Arduino",
  "Sensors",
  "AI-Assisted Coding",
  "Design Thinking",
  "School Expos",
  "District Innovators Expo",
];

export function S03_marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-ink py-[14px] text-cream">
      <div className="inline-flex [animation:w2l-marquee_34s_linear_infinite] motion-reduce:[animation:none]">
        {[...ITEMS, ...ITEMS].map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-[22px] text-[0.82rem] font-semibold uppercase tracking-[0.14em] after:text-[0.6rem] after:text-w2l-bright after:content-['◆']"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
