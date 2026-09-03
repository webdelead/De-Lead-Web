/* Full content population — uploads every image from the ported sites'
 * public/assets folders into Supabase Storage and inserts the matching
 * content rows, so ALL of it becomes dashboard-editable.
 *
 * Idempotent: images upsert by path; the content tables it owns are
 * cleared per-vertical and rebuilt. Run once:
 *   pnpm --filter @delead/db populate
 */
import { requireEnv } from "./_env";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createDb } from "../src/client";
import {
  assets,
  testimonials,
  pressClippings,
  galleryImages,
  w2lProjects,
  blogPosts,
  courses,
  studentOutcomes,
  trackRecord,
} from "../src/schema";
import { eq, and } from "drizzle-orm";

const ROOT = resolve(import.meta.dirname, "../../..");
const APPS = resolve(ROOT, "apps");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql } = createDb(DB_URL);

const MIME: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
};

async function ensureBucket(bucket: string) {
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}

const assetCache = new Map<string, string>();

/** upload apps/<localRel> to <bucket>/<key>, upsert an assets row, return its id */
async function up(localRel: string, bucket: string, key: string, vertical: string, alt: string) {
  const cacheKey = `${bucket}/${key}`;
  if (assetCache.has(cacheKey)) return assetCache.get(cacheKey)!;

  const path = resolve(APPS, localRel);
  const buf = readFileSync(path);
  const ext = localRel.split(".").pop()!.toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";

  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": mime, "x-upsert": "true" },
    body: new Uint8Array(buf),
  });
  if (!put.ok) throw new Error(`upload ${key}: ${put.status} ${await put.text()}`);

  const [row] = await db
    .insert(assets)
    .values({
      provider: "supabase",
      bucket,
      path: key,
      mime,
      bytes: statSync(path).size,
      vertical: vertical as never,
      alt,
    })
    .onConflictDoUpdate({
      target: [assets.provider, assets.bucket, assets.path],
      set: { bytes: statSync(path).size, alt },
    })
    .returning({ id: assets.id });
  assetCache.set(cacheKey, row!.id);
  return row!.id;
}

/* ============================================================
   WALK2LEAD — projects, testimonials, gallery, press
   ============================================================ */

/* [title, category, imgPath, description, imgAlt] — strings must stay
 * byte-identical to the approved static markup (apps/walk2lead S10). */
const W2L_PROJECTS: [string, string, string, string, string][] = [
  ["Waste-Collecting River Boat", "Environment", "projects/expo-project-3.png",
   "An Arduino-based boat using ultrasonic sensors to detect floating waste, DC-motor propellers and a front-mounted collection net, a low-cost answer to river and sea cleaning.",
   "Students presenting the Waste-Collecting River Boat"],
  ["Medicine Delivery Robot", "Healthcare", "projects/expo-robot.jpg",
   "An autonomous assistant designed to support patients and reduce waiting time inside healthcare facilities.",
   "Students presenting the Medicine Delivery Robot"],
  ["Urine Bag Fill Alert", "Healthcare", "projects/kids-present.jpg",
   "Automatically monitors urine bag levels and alerts hospital staff when full, for timely intervention, better hygiene, real patient impact.",
   "Students demonstrating the Urine Bag Fill Alert"],
  ["Three-Wire Fault Line Detector", "Electrical Safety", "projects/three-wire-detector.jpg",
   "An Arduino Uno with push buttons and an LCD screen that gives real-time, safe status alerts for each line in a three-wire electrical system.",
   "Students presenting the Three-Wire Fault Line Detector"],
  ["Life Guard", "Flood Safety", "projects/expo-lifeguard.jpg",
   "An automatic hydraulic lift that detects rising floodwater and elevates living spaces and beds to protect occupants — an affordable add-on for homes in flood-prone areas.",
   "Students presenting the Life Guard hydraulic house project"],
  ["Money Eating Monster", "Awareness", "projects/money-eating-monster.jpg",
   "An interactive smart piggy bank: a sensor detects each coin and a servo mechanism makes the monster \"eat\" it, turning saving into a game for children.",
   "Students presenting the Money Eating Monster smart piggy bank"],
  ["Gas Stove Automation System", "Home Safety", "projects/gas-stove.jpg",
   "A servo-controlled gas knob with ultrasonic boil detection and a smoke sensor that automatically shuts off the stove when unsafe conditions are detected.",
   "Students presenting the Gas Stove Automation System"],
  ["Smart Gas Detection System", "Home Safety", "projects/smart-gas-detection.jpg",
   "An MQ-2 sensor detects gas leaks and automatically opens windows, cuts power via relay, and activates an exhaust fan to clear the space.",
   "Students presenting the Smart Gas Detection System"],
  ["Aqua Guard", "Marine Safety", "projects/aqua-guard.jpg",
   "Real-time passenger counter and weight monitor for small boats; if tilt is detected, motors pump water to the opposite side to restore balance and prevent capsizing.",
   "Students presenting Aqua Guard"],
  ["Air Quality Checker", "Environment", "projects/air-quality-checker.jpg",
   "An MQ135 sensor detects CO₂ and harmful gases in real time, giving homes and schools an affordable way to monitor air quality and protect health.",
   "Students presenting the Air Quality Checker"],
  ["Smart Farming Robot", "Agriculture", "projects/smart-farming-robot.jpg",
   "An automated assistant for crop monitoring and irrigation, reducing manual labour and continuous supervision for small-plot farming.",
   "Students presenting the Smart Farming Robot"],
  ["AutoShine", "Hygiene", "projects/autoshine.jpg",
   "Ultrasonic sensors detect footwear at an entrance and activate 360-degree rotating brushes for touchless, automatic shoe cleaning.",
   "Students presenting AutoShine"],
  ["Automatic Seeder and Tiller", "Agriculture", "projects/automatic-seeder.jpg",
   "A battery-powered robot that simultaneously tills soil and sows seeds with uniform spacing, cutting labour costs for small-scale farmers.",
   "Students presenting the Automatic Seeder and Tiller"],
];

/* [quote, name, role, avatarFile|null, sourceNote, photoStyle] — first two are
 * the "feature" quotes; strings byte-identical to static markup (S12). */
const W2L_TESTIMONIALS: [string, string, string, string | null, string, string][] = [
  ["The Walk2Lead Robotics TechQuest reflects our vision of empowering young minds with the skills needed for tomorrow's world. By bringing structured robotics and technology training to government school students, we are ensuring that innovation and opportunity reach those who need it most. We are proud to support a project that is shaping a generation of thinkers and leaders.",
   "Mr. V. Noushad", "Managing Director, Walkaroo Foundation", "people/v-noushad.png", "feature", ""],
  ["Walk2Lead Robotics TechQuest is an exciting and inspiring learning initiative created to introduce students of government schools, especially those in rural and coastal areas, to the world of robotics and technology. This project aims to bridge the learning gap by bringing high-quality STEM education to children who often have limited access to such opportunities. The programme offers a 52-hour, hands-on learning journey for students of Classes 6 and 7, filled with fun activities, simple coding tasks, and guided robotics projects. By nurturing curiosity and problem-solving skills at a young age, this project hopes to empower young learners to imagine boldly, explore freely, and grow with confidence in a rapidly changing world.",
   "Dr. Sumitra Binu", "Walkaroo Foundation", "people/sumitra.png", "feature", "object-position: 50% 10%"],
  ["I was initially skeptical, wondering if students this young could both comprehend the theory and deliver a functional project. Instead of just answering my question to the trainers, my own students proved my doubts wrong by successfully completing their project and taking the top prize at the district expo.",
   "Mr. Abdul Rahoof", "School Coordinator, GUPS Veemboor", "people/abdul-rahoof.png", "", ""],
  ["The Walk2Lead programme has been a watershed moment for our government schools. The collaboration successfully integrated high-quality AI training into our system, proving we can prepare every child for the digital future when committed partners join hands.",
   "Dr. Babu Varghese", "Principal, DIET Malappuram", "people/babu-varghese.png", "", ""],
  ["I was thrilled to help launch this initiative. The hands-on, engaging approach to robotics immediately sparked genuine curiosity and confidence among the kids. Walk2Lead lays a strong, practical foundation for innovation in our community.",
   "Dr. Abdunnasar U K", "Principal, DIET Kozhikode", "people/abdunnasar-uk.png", "", ""],
  ["The training was exceptional due to its scientific planning and high standards. It gave students from ordinary government schools a rare, international-level training opportunity, filling the school with pride.",
   "Mrs. S. Bindu", "Headmistress, Thavanur KM GUPS", "people/s-bindu.png", "", ""],
  ["Out of 400 children, 30, including mine, were selected for robotics training. The three-month training quickly led to a noticeable, positive change in the children, boosting their interest and confidence. My children presented their project well in the district competition.",
   "A Proud Parent", "Phase 2, Malappuram", null, "", ""],
  ["Out of 400 children, 30 were selected for robotics training sponsored by Walkaroo, De' Lead International, and DIET. The three-month journey brought a noticeable, positive change, boosting their interest and confidence. My students presented their project well at the district competition — a very useful, joy-filled, and transformative experience.",
   "Mrs. Shahina", "HM, GUPS Mundothuparamba", "people/shahina.png", "", ""],
  ["Watching such young students excel in such a technological area is itself impressive. Happy to be a part of it.",
   "Mrs. Nisha Subramaniam", "Principal, SSVM International", "people/nisha-subramaniam.png", "", ""],
  ["The students clearly understand the project, the concepts, and how to present in a pitch-level manner. It's truly an admirable outcome of this programme.",
   "Mr. Ram Kamal Manoj", "Managing Trustee, TechTop · Advisor, Dept. of School Education, Govt. of Andhra Pradesh", "people/ram-kamal-manoj.png", "", ""],
  ["The presentations and projects were on par with a college-level final project. The kind of training received by the students is commendable — and this age group works remarkably well in learning and understanding concepts. These are some smart kids.",
   "Mr. Harikrishnan M", "Asst. Professor, IEDC Nodal Officer", "people/harikrishnan-m.png", "", ""],
];

const W2L_GALLERY: [string, string][] = [
  ["big-group.jpg", "Walk2Lead cohort group photo"],
  ["boy-mic.jpg", "Student presenting his project"],
  ["girl-mic-team.jpg", "Student team presenting"],
  ["expo-team1.jpg", "Team at the expo"],
  ["project-table.jpg", "Students demonstrating a prototype"],
  ["inauguration.jpg", "Programme inauguration"],
  ["award-kids.jpg", "Students receiving recognition"],
  ["memento-group.jpg", "Memento distribution ceremony"],
  ["panel.jpg", "Stakeholder panel at district event"],
];

const W2L_PRESS: [string, string][] = [
  ["news-feroke.jpg", "Feroke"], ["news-wa-0085.jpg", ""], ["news-wa-0013.jpg", ""],
  ["news-wa-0015.jpg", ""], ["news-wa-0008.jpg", ""], ["news-wa-0009.jpg", ""],
  ["news-karuvanpoyil.jpg", "Karuvanpoyil"], ["news-manassery.jpg", "Manassery"],
  ["news-meenchanda-1.jpg", "Meenchanda"], ["news-meenchanda-2.jpg", "Meenchanda"],
  ["news-meenchanda-3.jpg", "Meenchanda"], ["news-meppayil.jpg", "Meppayil"],
  ["news-nallalam.jpg", "Nallalam"], ["news-snbm.jpg", ""], ["news-thurayur.jpg", "Thurayur"],
  ["news-wa-1.jpg", ""], ["news-wa-2.jpg", ""], ["news-wa-3.jpg", ""], ["news-wa-4.jpg", ""],
  ["news-wa-5.jpg", ""], ["news-wa-6.jpg", ""], ["news-wa-7.jpg", ""], ["news-wa-8.jpg", ""],
  ["news-comb-1.jpg", "Coverage compilation"], ["news-comb-2.jpg", "Coverage compilation"],
  ["news-comb-3.jpg", "Coverage compilation"], ["news-newspaper.jpg", ""],
];

/* ============================================================
   MAKERCHAMPS gallery
   ============================================================ */
/* 8 photos, 2 marquee rows of 4 (S09_gallery). alt = exact static markup. */
const MC_GALLERY: [string, string][] = [
  ["orientation-auditorium.webp", "Orientation session in an NIT Calicut auditorium"],
  ["isro-exhibit-tour.webp", "Students on a guided space-research exhibit tour"],
  ["chandrayaan-lander-demo.webp", "Mentor explaining a Chandrayaan lander model to students"],
  ["electronics-lab-visit.webp", "Students visiting an NIT electronics research lab"],
  ["chemistry-lab-handson.webp", "Hands-on chemistry experiment session"],
  ["prototype-building.webp", "Students building a prototype with real materials"],
  ["physics-demo-pascals-law.webp", "Live physics demonstration on stage"],
  ["nit-team-huddle.webp", "Team huddle inside an NIT Calicut hall"],
];

// [quote, author, role] — 4 real MakerChamps quotes (S10_testimonials)
const MC_TESTIMONIALS: [string, string, string][] = [
  ["My daughter Meenakshi had an absolutely fantastic time. Beyond just the lessons, this bootcamp has been truly transformative — we've seen a remarkable boost in her confidence. Getting to explore a premier institution like NIT Calicut, attend live classes, and work in the actual labs was a dream come true for her.",
   "Soorajnath", "Parent of Meenakshi"],
  ["The students thoroughly enjoyed the sessions and found the experience truly encouraging. They have so many valuable takeaways — it's wonderful to see how happy and inspired they are. We sincerely appreciate all the time, effort, and passion the team put into making these sessions so meaningful.",
   "Program Partner", "MakerChamps Season 2"],
  ["My son Hashim wasn't very enthusiastic going in — but the transformation over just two days was remarkable. He came home more energetic, more confident, more inspired, and told me: \"I don't want to study in a normal college anymore. I have to crack JEE and get into a really good college — I have to work.\" For me, that shift in mindset was the greatest achievement of this program.",
   "Safiya Cheruvakkath", "Parent of Muhammed Hashim, Grade XI"],
  ["The two-day camp was a wonderful event — my son loved it. Since he dreams of studying at an NIT, he was thrilled to visit the campus and take part. In an era where children are confined to their phones, camps like this are exactly what helps the new generation build real social connections. Please conduct more programs like this.",
   "Parent of Rizwan Khan", "Translated from a Malayalam voice message"],
];

/* ============================================================
   CORPORATE TRAINING — track record, testimonials, gallery
   ============================================================ */
// [whenLabel, client, blurb, badge] — S09_trackrecord (7, then cloned in the component)
const CORP_TRACK: [string, string, string, string][] = [
  ["Feb 2023", "RAG Business Hub", "Full-staff leadership training: decision-making, communication, a culture of innovation.", "Whole company"],
  ["Dec 2023", "DP World", "Confidence and team building for a cohort of 100 staff, personalised coaching and exercises.", "100 staff"],
  ["Feb 2024", "RAG Business Hub", "Team building at the Business Bay head office for the entire team, CEO and co-founder included.", "CEO included"],
  ["Mar 2024", "Kayzan Group", "Two-day immersive outbound for 35 senior members at a farmhouse in Al Rahba, Abu Dhabi.", "2 days · 35 people"],
  ["May 2024", "Kayzan Group", "Emotional Selling & Leadership Accelerator for the sales team, Al Bustan Centre, Dubai.", "Sales team"],
  ["Sep 2024", "Al Ahalia Group", "Next Level Leadership for 50+ decision-makers across medical, operations, nursing, marketing & admin.", "50+ leaders"],
  ["Feb 2025", "DP World Digital", "Activity-based team building for the Enterprise Systems team, running 12:30pm to 10pm, with a BBQ.", "Full day"],
];

// [quote, author, role] — S10_testimonials placeholders (kept as-is so the site is unchanged; client edits in the dashboard)
const CORP_TESTIMONIALS: [string, string, string][] = [
  ["The two days out of the office did more for how the team communicates than anything we had tried in-house. People came back talking to each other differently.",
   "[Client name]", "[Role], [Company]"],
  ["It was built around our actual challenges, not a generic deck. The facilitators ran the room themselves and kept every session hands-on.",
   "[Client name]", "[Role], [Company]"],
  ["Our leadership team took part alongside everyone else. That is what made the change stick once we were back at our desks.",
   "[Client name]", "[Role], [Company]"],
];

// [file, caption, alt] — S12_gallery (5, fixed grid slots g-a..g-e)
const CORP_GALLERY: [string, string, string][] = [
  ["outbound-horse.webp", "Outbound, Al Rahba", "Participant horse riding during an outbound session in Abu Dhabi"],
  ["facilitator-mic.webp", "On the floor", "A facilitator leading a corporate session"],
  ["trophy-win.webp", "Team challenge", "A team celebrating a challenge win"],
  ["support-activity.webp", "Trust exercise", "A group trust-and-support activity"],
  ["sales-session.webp", "Sales team, Dubai", "A training session in a Dubai conference hall"],
];

/* ============================================================
   DLI EDUCATION — student catalogue + student outcomes
   ============================================================ */
// [track, title, description, ageLabel, format, durationLabel] — students/S05_catalogue (11, in order)
const DLI_COURSES: [string, string, string, string, string, string][] = [
  ["AI & Data", "Gen AI for Smart Learning", "Prompt engineering, smart study techniques, memory and visual learning, ethical AI use.", "Ages 13+", "Group or 1-to-1", "2 months"],
  ["AI & Data", "Artificial Intelligence for All", "How models learn, everyday AI tools, building simple projects, ethics and limitations.", "Ages 12+", "Group or 1-to-1", "Concepts first"],
  ["AI & Data", "Python for Data Analytics", "Statistics fundamentals, data management, exploratory analysis, visualisation, capstone projects.", "Ages 14+", "4 to 5 months", "48 to 60 hrs"],
  ["AI & Data", "Data & Analytics", "Reading, cleaning and presenting data, and building dashboards a team can actually use.", "Ages 14+", "Group or 1-to-1", "Dashboards"],
  ["Coding & Web", "Python Programming", "Core fundamentals, problem solving, control structures, data structures, file and exception handling.", "Ages 12+", "3 to 4 months", "32 hrs"],
  ["Coding & Web", "Web Development", "HTML foundation, CSS and Bootstrap, JavaScript and jQuery, frameworks, deployment.", "Ages 12+", "4 to 5 months", "32 to 48 hrs"],
  ["Coding & Web", "Internet of Things", "Microcontrollers, sensors and actuators, connectivity, build a connected device.", "Ages 13+", "Group or 1-to-1", "Hardware included"],
  ["Design", "3D Design & Modeling", "Modelling fundamentals, design and sculpting, texturing and rendering, architecture, product design.", "Ages 12+", "3 to 4 months", "32 hrs"],
  ["Design", "UI/UX Designing", "User research, wireframing, visual design, prototyping.", "Ages 14+", "Group or 1-to-1", "Prototype"],
  ["Robotics & Kids", "Robotics", "Electronics and sensors, mechanical design, robot programming, innovation projects. Prepares for STEM careers.", "Ages 10+", "3 to 4 months", "32 hrs"],
  ["Robotics & Kids", "Block Based Coding for Kids", "Scratch, Code.org, PictoBlox, EduBlocks. Computational thinking without syntax errors.", "Ages 7+", "3 to 4 months", "32 hrs"],
];

// [name, place, win, tag] — students/S07_heroes (6, in order)
const DLI_OUTCOMES: [string, string, string, string][] = [
  ["Muhammed Adhil T S", "GUPS Thurayoor, Kerala", "Champion at the TechTop International Bootcamp, held at Kerala Startup Mission's Maker Village, Kochi.", "Robotics"],
  ["Ameya M", "GGVHS Feroke, Kerala", "Champion at the TechTop International Bootcamp, held at Kerala Startup Mission's Maker Village, Kochi.", "Robotics"],
  ["Evana Eliza Vinoj", "Sharjah Indian School, UAE", "Digitised an entire village library with a Python application. Won the Sharjah Award for Educational Excellence, Distinguished Student, with a Dh30,000 scholarship.", "Python"],
  ["Aamil Nazar", "GHSS Medical College Campus, Kozhikode", "Built his school's website and was honoured by Kerala's education minister. Two-time winner of the state-level web design competition.", "Web development"],
  ["Abhinav Krishna", "Kozhikode, India", "Inspire Award for a Money Sanitizer Machine built with robotics. Designed an automatic waste-collection machine prototype for city workers.", "Robotics"],
  ["Neeraj V M", "GHSS Koduvayoor, Kerala", "Built a weather application in Python and completed a machine-learning project at the age of 14.", "Python & ML"],
];

/* ============================================================
   HUB (deleadint) — gallery + press
   ============================================================ */
const HUB_LABEL: Record<string, string> = {
  corp: "Corporate Training", dli: "DLI Education", mc: "MakerChamps",
  tc: "TinkerChamps", uae: "India & UAE", w2l: "Walk2Lead",
};
const HUB_GALLERY = [
  "tc-1.webp", "w2l-1.webp", "mc-1.webp", "corp-1.webp", "tc-2.webp", "dli-1.webp",
  "w2l-2.webp", "mc-3.webp", "uae-1.webp", "corp-2.webp", "tc-3.webp", "dli-2.webp",
  "mc-2.webp", "corp-3.webp", "tc-4.webp", "corp-suit.webp",
];
const HUB_PRESS = ["press-1.webp", "press-2.webp", "press-3.webp", "press-4.webp", "press-5.webp", "press-6.webp"];

/* ============================================================
   BLOG — the 3 seeded + 2 more, all from confirmed facts
   ============================================================ */
const now = Date.now();
const POSTS = [
  {
    slug: "inside-a-walk2lead-district-expo", tag: "DLI Foundation",
    title: "Inside a Walk2Lead district expo",
    excerpt: "What it takes to get government-school students from their first Arduino to a working prototype in three months.",
    daysAgo: 3,
    bodyMd: `Walk2Lead runs a three-month, 52-hour curriculum in rural and coastal government schools across Kerala — Arduino kits, sensors, coding, and AI-assisted building for Classes 6 and 7.\n\nEach school runs a two-stage selection down to about 30 students, builds through roughly 26 sessions, and ends with a school expo. The strongest projects go on to a district **Innovators Expo** judged by an external panel.\n\nBy the current phase that adds up to **44 schools, 1,300+ students, four districts** — each phase funded on the results of the last. Funded by Walkaroo Foundation, implemented end to end by De' Lead International.`,
  },
  {
    slug: "why-we-run-camps-not-classrooms", tag: "TinkerChamps",
    title: "Why we run camps, not classrooms",
    excerpt: "The thinking behind zip-lines and pitching drills as a curriculum, not a break from one.",
    daysAgo: 7,
    bodyMd: `TinkerChamps started after the pandemic — not to close an academic gap, but to address the behavioural and mental-health fallout students were carrying back into classrooms.\n\nThe format is a 3-day residential camp (plus a 2-day @School version) for grades 6–12: leadership and communication drills, public-speaking training, activity-based learning, outdoor challenges, and a career-guidance thread built into the week rather than bolted on.\n\nTwenty-plus seasons in, 500+ students have been through it. The zip-line isn't the point — it's the setup for the debrief.`,
  },
  {
    slug: "a-bootcamp-that-runs-from-inside-nit-calicut", tag: "MakerChamps",
    title: "A bootcamp that runs from inside NIT Calicut",
    excerpt: "Why running seven modules through a working technology-business incubator changes how students think about what's next.",
    daysAgo: 12,
    bodyMd: `MakerChamps is a 2-day, 1-night residential bootcamp on the NIT Calicut campus for class 8–12, capped at 60 seats.\n\nIt's co-hosted with **Nlightened ZenSolutions**, a startup incubated inside NIT Calicut's Technology Business Incubator, in association with the Centre for Holistic Teaching and Learning — so students get into real classrooms and labs, not a rented hall nearby.\n\nSeven hands-on modules run from expert mentor sessions and campus lab visits through design thinking, prototype building, and a final pitch. The main agenda isn't the prototype — it's two days of exposure to a top-ranked engineering campus, early enough to change what a student thinks is possible.`,
  },
  {
    slug: "the-directors-run-the-room", tag: "Corporate Training",
    title: "The directors run the room",
    excerpt: "What changes when a leadership team trades a slide deck for a rope course — and the facilitators are the people who designed it.",
    daysAgo: 18,
    bodyMd: `De' Lead's corporate practice is built for teams that have outgrown the classroom. Every session runs on an activity, not a slide: a real problem, real pressure, and a debrief that translates straight back to how the team works.\n\nArjun C P and Sabarinath K facilitate the sessions themselves, backed by specialist facilitators including an emotional-selling coach for sales teams. Signature outbound activities — Flight Game, Rope Passing, Rope Escape, Tower Building — sit alongside boardroom strategy drills inside a single engagement.\n\nDated, named engagements since 2023: RAG Business Hub, DP World (100 staff), Kayzan Group (Abu Dhabi outbound), Al Ahalia Group (50+ decision-makers), DP World Digital Enterprise Systems.`,
  },
  {
    slug: "anyonecancode-what-that-looks-like", tag: "DLI Education",
    title: "#anyonecancode, and what that looks like",
    excerpt: "From a first Python class to a state-level web-design win — a few real student journeys.",
    daysAgo: 24,
    bodyMd: `DLI Education runs a hands-on catalogue across coding, AI, robotics and design — Python, web development, data analytics, 3D modelling, block coding, and applied Gen AI — delivered online, offline, in camps or as corporate workshops.\n\nReal student wins worth naming: **Evana Eliza Vinoj** (UAE) digitised a village library in Python and won the Sharjah Award for Educational Excellence with a Dh30,000 scholarship. **Aamil Nazar** built his school's website and won the state-level web-design competition twice. **Adhil T S & Ameya M** were champions at the TechTop International Bootcamp at Maker Village, Kochi. **Abhinav Krishna** won an Inspire Award for a waste-collection prototype.\n\nThe ethos is in the hashtag: the first class is about making something real, and keeping the lesson long after it ends.`,
  },
];

/* ============================================================
   RUN
   ============================================================ */
async function main() {
  for (const b of ["walk2lead", "makerchamps", "shared"]) await ensureBucket(b);

  // ---- Walk2Lead projects ----
  await db.delete(w2lProjects);
  for (let i = 0; i < W2L_PROJECTS.length; i++) {
    const [title, category, img, description, imgAlt] = W2L_PROJECTS[i]!;
    const assetId = await up(`walk2lead/public/assets/${img}`, "walk2lead", `projects/${img.split("/").pop()}`, "walk2lead", imgAlt);
    await db.insert(w2lProjects).values({ title, category, description, assetId, sortOrder: i });
  }
  console.log(`✔ w2l_projects: ${W2L_PROJECTS.length}`);

  // ---- Walk2Lead testimonials ----
  await db.delete(testimonials).where(eq(testimonials.vertical, "walk2lead"));
  for (let i = 0; i < W2L_TESTIMONIALS.length; i++) {
    const [quote, authorName, authorRole, avatar, sourceNote] = W2L_TESTIMONIALS[i]!;
    const avatarAssetId = avatar
      ? await up(`walk2lead/public/assets/${avatar}`, "walk2lead", `people/${avatar.split("/").pop()}`, "walk2lead", authorName)
      : null;
    await db.insert(testimonials).values({
      vertical: "walk2lead", quote, authorName, authorRole,
      avatarAssetId, sourceNote, sortOrder: i,
    });
  }
  console.log(`✔ testimonials (walk2lead): ${W2L_TESTIMONIALS.length}`);

  // ---- Walk2Lead gallery ----
  await db.delete(galleryImages).where(eq(galleryImages.vertical, "walk2lead"));
  for (let i = 0; i < W2L_GALLERY.length; i++) {
    const [file, alt] = W2L_GALLERY[i]!;
    const assetId = await up(`walk2lead/public/assets/${file}`, "walk2lead", `gallery/${file}`, "walk2lead", alt);
    await db.insert(galleryImages).values({ vertical: "walk2lead", title: alt, assetId, sortOrder: i });
  }
  console.log(`✔ gallery (walk2lead): ${W2L_GALLERY.length}`);

  // ---- Walk2Lead press ----
  await db.delete(pressClippings).where(eq(pressClippings.vertical, "walk2lead"));
  for (let i = 0; i < W2L_PRESS.length; i++) {
    const [file, place] = W2L_PRESS[i]!;
    const assetId = await up(`walk2lead/public/assets/news/${file}`, "walk2lead", `press/${file}`, "walk2lead",
      place ? `${place} newspaper coverage of Walk2Lead` : "Walk2Lead newspaper coverage");
    await db.insert(pressClippings).values({
      vertical: "walk2lead", title: place, publication: "", dateStr: "", assetId, sortOrder: i,
    });
  }
  console.log(`✔ press_clippings (walk2lead): ${W2L_PRESS.length}`);

  // ---- MakerChamps gallery ----
  await db.delete(galleryImages).where(eq(galleryImages.vertical, "makerchamps"));
  for (let i = 0; i < MC_GALLERY.length; i++) {
    const [file, alt] = MC_GALLERY[i]!;
    const assetId = await up(`makerchamps/public/assets/photos/${file}`, "makerchamps", `gallery/${file}`, "makerchamps", alt);
    await db.insert(galleryImages).values({ vertical: "makerchamps", title: alt, assetId, sortOrder: i });
  }
  console.log(`✔ gallery (makerchamps): ${MC_GALLERY.length}`);

  // ---- MakerChamps testimonials ----
  await db.delete(testimonials).where(eq(testimonials.vertical, "makerchamps"));
  for (let i = 0; i < MC_TESTIMONIALS.length; i++) {
    const [quote, authorName, authorRole] = MC_TESTIMONIALS[i]!;
    await db.insert(testimonials).values({ vertical: "makerchamps", quote, authorName, authorRole, sortOrder: i });
  }
  console.log(`✔ testimonials (makerchamps): ${MC_TESTIMONIALS.length}`);

  // ---- Corporate track record ----
  await db.delete(trackRecord);
  for (let i = 0; i < CORP_TRACK.length; i++) {
    const [whenLabel, client, blurb, badge] = CORP_TRACK[i]!;
    await db.insert(trackRecord).values({ whenLabel, client, blurb, badge, sortOrder: i });
  }
  console.log(`✔ track_record (corporate): ${CORP_TRACK.length}`);

  // ---- Corporate testimonials ----
  await db.delete(testimonials).where(eq(testimonials.vertical, "corporate"));
  for (let i = 0; i < CORP_TESTIMONIALS.length; i++) {
    const [quote, authorName, authorRole] = CORP_TESTIMONIALS[i]!;
    await db.insert(testimonials).values({ vertical: "corporate", quote, authorName, authorRole, sortOrder: i });
  }
  console.log(`✔ testimonials (corporate): ${CORP_TESTIMONIALS.length}`);

  // ---- Corporate gallery ----
  await db.delete(galleryImages).where(eq(galleryImages.vertical, "corporate"));
  for (let i = 0; i < CORP_GALLERY.length; i++) {
    const [file, caption, alt] = CORP_GALLERY[i]!;
    const assetId = await up(`corporate/public/assets/photos/${file}`, "shared", `corporate/gallery/${file}`, "corporate", alt);
    await db.insert(galleryImages).values({ vertical: "corporate", title: caption, assetId, sortOrder: i });
  }
  console.log(`✔ gallery (corporate): ${CORP_GALLERY.length}`);

  // ---- DLI Education — student catalogue ----
  await db.delete(courses).where(eq(courses.audience, "students"));
  for (let i = 0; i < DLI_COURSES.length; i++) {
    const [track, title, description, ageLabel, format, durationLabel] = DLI_COURSES[i]!;
    await db.insert(courses).values({
      audience: "students", track, title, description, ageLabel, format, durationLabel, sortOrder: i,
    });
  }
  console.log(`✔ courses (dli, students): ${DLI_COURSES.length}`);

  // ---- DLI Education — student outcomes ----
  await db.delete(studentOutcomes).where(eq(studentOutcomes.vertical, "dli_education"));
  for (let i = 0; i < DLI_OUTCOMES.length; i++) {
    const [name, place, win, tag] = DLI_OUTCOMES[i]!;
    await db.insert(studentOutcomes).values({ vertical: "dli_education", name, place, win, tag, sortOrder: i });
  }
  console.log(`✔ student_outcomes (dli): ${DLI_OUTCOMES.length}`);

  // ---- Hub gallery ----
  await db.delete(galleryImages).where(eq(galleryImages.vertical, "deleadint"));
  for (let i = 0; i < HUB_GALLERY.length; i++) {
    const file = HUB_GALLERY[i]!;
    const label = HUB_LABEL[file.split("-")[0]!] ?? "De' Lead";
    const assetId = await up(`deleadint/public/assets/gallery/${file}`, "shared", `deleadint/gallery/${file}`, "deleadint", label);
    await db.insert(galleryImages).values({ vertical: "deleadint", title: label, assetId, sortOrder: i });
  }
  console.log(`✔ gallery (deleadint): ${HUB_GALLERY.length}`);

  // ---- Hub press ----
  await db.delete(pressClippings).where(eq(pressClippings.vertical, "deleadint"));
  for (let i = 0; i < HUB_PRESS.length; i++) {
    const file = HUB_PRESS[i]!;
    const assetId = await up(`deleadint/public/assets/press/${file}`, "shared", `deleadint/press/${file}`, "deleadint", "Newspaper coverage");
    await db.insert(pressClippings).values({
      vertical: "deleadint", title: "", publication: "", dateStr: "", assetId, sortOrder: i,
    });
  }
  console.log(`✔ press_clippings (deleadint): ${HUB_PRESS.length}`);

  // ---- Blog ----
  await db.delete(blogPosts);
  for (let i = 0; i < POSTS.length; i++) {
    const p = POSTS[i]!;
    await db.insert(blogPosts).values({
      vertical: null,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      bodyMd: p.bodyMd,
      tag: p.tag,
      status: "published",
      authorName: "De' Lead International",
      publishedAt: new Date(now - p.daysAgo * 864e5),
    });
  }
  console.log(`✔ blog_posts: ${POSTS.length}`);
}

await main();
await sql.end();
console.log("populate done.");
