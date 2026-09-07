const chipList =
  "!grid grid-cols-2 gap-x-[22px] gap-y-4 max-[700px]:grid-cols-1";
const chipItem =
  "flex items-start gap-[9px] text-[0.94rem] before:mt-0.5 before:flex-[0_0_auto] before:text-[0.85em] before:font-bold before:text-accent before:content-['→']";
const note = { marginTop: "14px", fontSize: ".84rem", color: "var(--ink-soft)" } as const;

const LEADERS: [string, string][] = [
  ["Muhammed Riyas", "Minister for PWD & Tourism"],
  ["P. K. Kunhalikkutty", "Kerala Minister for Industries & Commerce, IT and AI"],
  ["Dr. K. T. Jaleel", "Former MLA, Thavanur"],
  ["Aryadan Shoukat", "MLA, Nilambur"],
  ["U. A. Latheef", "Former MLA, Manjeri"],
  ["Thottathil Raveendran", "MLA, Kozhikode"],
  ["Linto Joseph", "MLA, Thiruvambadi"],
  ["T. P. Ramakrishnan", "MLA, Perambra"],
  ["Dilip K. Kainikkara", "District Sub Collector, Malappuram"],
];

const JURY: [string, string][] = [
  ["Rony K. Roy", "Senior Technology Fellow, Kerala Startup Mission"],
  [
    "Ram Kamal Manoj",
    "Managing Trustee, TechTop; Advisor to Dept. of School Education, Govt. of Andhra Pradesh",
  ],
  [
    "Nisha Subramaniam",
    'Principal, SSVM International: "The presentations and projects were on par with a college-level final project."',
  ],
  [
    "Harikrishnan M",
    'Entrepreneur: "The students clearly understand the project, the concepts, and how to present at pitch level."',
  ],
];

function Chips({ items }: { items: [string, string][] }) {
  return (
    <ul className={chipList}>
      {items.map(([name, sub]) => (
        <li key={name} className={chipItem}>
          <div className="flex min-w-0 flex-col gap-0.5">
            <b className="block whitespace-normal text-ink">{name}</b>
            <span className="text-[0.78rem] text-ink-soft">{sub}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function S14_cred() {
  return (
    <>
      <section className="bg-white [border-top:1px_solid_var(--color-line)]">
        <div className="wrap">
          <div className="eyebrow reveal">Independent validation</div>
          <h2 className="h2 reveal">Inaugurated by leaders. Judged by experts.</h2>
          <div className="mt-12 grid grid-cols-2 gap-16 max-[900px]:grid-cols-1">
            <div className="reveal">
              <h3 className="mb-5 text-[1.25rem]">Leadership support &amp; inaugurations</h3>
              <Chips items={LEADERS} />
              <p style={note}>
                Plus municipal chairs, deputy mayors and ward councillors who inaugurated individual
                schools across all four phases. This is a selection, not the full list.
              </p>
            </div>
            <div className="reveal">
              <h3 className="mb-5 text-[1.25rem]">Expo jury &amp; what they said</h3>
              <Chips items={JURY} />
              <p style={note}>
                Each district expo brought its own jury panel. This is a selection, not the full
                list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
    </>
  );
}
