"use client";

import Image from "next/image";

// Same official cutout portraits used across the other De' Lead sites
// (apps/corporate/public/assets/people/, apps/walk2lead, apps/makerchamps) —
// copied in rather than cropped fresh, per the established pattern.
const directors = [
  {
    name: "Arjun C P",
    role: "Chief Technology Officer, De' Lead International",
    photo: "/assets/people/arjun-cp.webp",
    quote:
      "Every module we design starts with one question — will a fourteen-year-old actually want to build this with their hands, or just watch someone else do it? If it's the second one, we throw it out. TinkerChamps only works when the tech is real enough to break, so kids learn to fix it themselves.",
  },
  {
    name: "Sabarinath K",
    role: "Chief Marketing Officer, De' Lead International",
    photo: "/assets/people/sabarinath-k.webp",
    quote:
      "Parents ask me the same thing every season — will three days actually change anything? I tell them to watch pickup day instead of the brochure. A quiet kid who wouldn't make eye contact on day one, up on stage running the closing presentation for their whole team. That's the only metric that's ever mattered to us.",
  },
];

export default function DirectorsNoteSection() {
  return (
    <section id="directors-note" className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-3xl md:text-4xl font-semibold text-white mb-1">A note from</p>
          <h2 className="text-5xl md:text-7xl font-bold font-covered text-secondary-yellow">
            our directors
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {directors.map((d) => (
            <div
              key={d.name}
              className="flex flex-col bg-[#3E136D] border border-white/10 rounded-2xl shadow-xl p-8 md:p-10"
            >
              <p className="text-3xl text-secondary-yellow mb-2">&ldquo;</p>
              <p className="text-lg md:text-xl font-medium text-white leading-relaxed mb-8 flex-1">
                {d.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-2xl overflow-hidden bg-white/10 ring-2 ring-secondary-yellow/70">
                  <Image
                    src={d.photo}
                    alt={d.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{d.name}</p>
                  <p className="text-sm text-gray-200">{d.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
