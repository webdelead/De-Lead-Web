/* Seeds real marketing content lifted from the current live sites so the
 * Astro builds have data on day one. Idempotent: each table is only seeded
 * when empty, so it never clobbers edits made later in the dashboard. */
import { requireEnv } from "./_env";
import { createDb } from "../src/client";
import {
  siteStats,
  testimonials,
  courses,
  trackRecord,
  w2lPhases,
  w2lProjects,
  studentOutcomes,
  blogPosts,
} from "../src/schema";
import { sql } from "drizzle-orm";

const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql: raw } = createDb(url);

async function isEmpty(table: string) {
  const rows = await raw<{ n: number }[]>`select count(*)::int as n from ${raw(table)}`;
  return (rows[0]?.n ?? 0) === 0;
}

async function seedIfEmpty<T>(table: string, rows: T[], insert: () => Promise<unknown>) {
  if (await isEmpty(table)) {
    await insert();
    console.log(`✔ ${table}: seeded ${rows.length}`);
  } else {
    console.log(`· ${table}: not empty, skipped`);
  }
}

/* ---------- site_stats ---------- */
const STATS = [
  // hub
  { vertical: "deleadint", groupKey: "hero", label: "Students Impacted", value: "5000", suffix: "+", sortOrder: 0 },
  { vertical: "deleadint", groupKey: "hero", label: "Professionals Trained", value: "1000", suffix: "+", sortOrder: 1 },
  { vertical: "deleadint", groupKey: "hero", label: "Organisations Collaborated", value: "50", suffix: "+", sortOrder: 2 },
  // walk2lead
  { vertical: "walk2lead", groupKey: "impact", label: "Government schools", value: "44", suffix: "", sortOrder: 0 },
  { vertical: "walk2lead", groupKey: "impact", label: "Students reached", value: "1,300", suffix: "+", sortOrder: 1 },
  { vertical: "walk2lead", groupKey: "impact", label: "Districts in Kerala", value: "4", suffix: "", sortOrder: 2 },
  // makerchamps
  { vertical: "makerchamps", groupKey: "hero", label: "Seats per season, max", value: "60", suffix: "", sortOrder: 0 },
  { vertical: "makerchamps", groupKey: "hero", label: "Modules, 2 days", value: "7", suffix: "", sortOrder: 1 },
  { vertical: "makerchamps", groupKey: "hero", label: "NIT in Kerala, NIRF top", value: "#1", suffix: "", sortOrder: 2 },
  // corporate
  { vertical: "corporate", groupKey: "big", label: "Corporate engagements since 2023", value: "7", suffix: "+", sortOrder: 0 },
  { vertical: "corporate", groupKey: "big", label: "Staff in a single DP World cohort", value: "100", suffix: "", sortOrder: 1 },
  { vertical: "corporate", groupKey: "big", label: "Decision-makers trained at Al Ahalia Group", value: "50", suffix: "+", sortOrder: 2 },
  { vertical: "corporate", groupKey: "big", label: "Sessions run on the ground in both", value: "India & UAE", suffix: "", sortOrder: 3 },
  // dli education
  { vertical: "dli_education", groupKey: "stats", label: "Learners trained", value: "2000", suffix: "+", sortOrder: 0 },
  { vertical: "dli_education", groupKey: "stats", label: "Course tracks", value: "11", suffix: "", sortOrder: 1 },
  { vertical: "dli_education", groupKey: "stats", label: "Delivery modes", value: "4", suffix: "", sortOrder: 2 },
  { vertical: "dli_education", groupKey: "stats", label: "Learners on both sides", value: "India & UAE", suffix: "", sortOrder: 3 },
  // tinkerchamps
  { vertical: "tinkerchamps", groupKey: "stats", label: "Seasons completed", value: "20", suffix: "+", sortOrder: 0 },
  { vertical: "tinkerchamps", groupKey: "stats", label: "Students attended", value: "500", suffix: "+", sortOrder: 1 },
  { vertical: "tinkerchamps", groupKey: "stats", label: "Hands-on activities", value: "50", suffix: "+", sortOrder: 2 },
];

/* ---------- testimonials ---------- */
const TESTIMONIALS = [
  { vertical: "deleadint", quote: "Gone are the days of shy students hiding in the back. TinkerChamps fostered collaboration and communication, making my classroom a vibrant hub of social learning and growth.", authorName: "Roshan John", authorRole: "Project Coordinator, PRISM", sourceNote: "on TinkerChamps", sortOrder: 0 },
  { vertical: "deleadint", quote: "Being from a non-IT background I thought it would be difficult to learn to code, but De' Lead helped me get the concepts easily, in a fun-filled way.", authorName: "Soumya C.", authorRole: "Civil Engineer → Python Developer", sourceNote: "on DLI Education", sortOrder: 1 },
  { vertical: "deleadint", quote: "It's my pleasure to use GoalFinder, a powerful tool to identify strengths and areas for improvement. I highly recommend it to my students.", authorName: "Dr. Bindhu Ann Thomas", authorRole: "Director, Kochi Business School", sourceNote: "on Goal Finder", sortOrder: 2 },
  { vertical: "deleadint", quote: "The students clearly understand the project, the concepts, and how to present in a pitch-level manner. A truly admirable outcome.", authorName: "Ram Kamal Manoj", authorRole: "Managing Trustee, TechTop", sourceNote: "on Walk2Lead", sortOrder: 3 },
  // makerchamps
  { vertical: "makerchamps", quote: "My daughter Meenakshi had an absolutely fantastic time. This bootcamp has been truly transformative — we've seen a remarkable boost in her confidence. Getting to explore a premier institution like NIT Calicut, attend live classes, and work in the actual labs was a dream come true for her.", authorName: "Soorajnath", authorRole: "Parent of Meenakshi", sortOrder: 0 },
  { vertical: "makerchamps", quote: "The students thoroughly enjoyed the sessions and found the experience truly encouraging. They have so many valuable takeaways — it's wonderful to see how happy and inspired they are.", authorName: "Program Partner", authorRole: "MakerChamps Season 2", sortOrder: 1 },
  { vertical: "makerchamps", quote: "My son Hashim wasn't very enthusiastic going in — but the transformation over just two days was remarkable. He came home and told me: “I have to crack JEE and get into a really good college — I have to work.” That shift in mindset was the greatest achievement of this program.", authorName: "Safiya Cheruvakkath", authorRole: "Parent of Muhammed Hashim, Grade XI", sortOrder: 2 },
  { vertical: "makerchamps", quote: "The two-day camp was a wonderful event — my son loved it. In an era where children are confined to their phones, camps like this are exactly what helps the new generation build real social connections. Please conduct more programs like this.", authorName: "Parent of Rizwan Khan", authorRole: "Translated from a Malayalam voice message", sortOrder: 3 },
  // dli education
  { vertical: "dli_education", quote: "Being from a non-IT background I thought it would be difficult to learn to code, but De' Lead helped me get the concepts easily, in a fun-filled way.", authorName: "Soumya C.", authorRole: "Civil Engineer, on DLI Education", sortOrder: 0 },
];

/* ---------- courses (DLI Education) ---------- */
const COURSES = [
  { audience: "students", track: "Coding & Web", title: "Python Programming", level: "Beginner", description: "Core fundamentals, problem solving, data structures, file and exception handling.", ageLabel: "Ages 12+", format: "Group or 1-to-1", durationLabel: "32 hrs", isFeatured: true, sortOrder: 0 },
  { audience: "students", track: "AI & Data", title: "Python for Data Analytics", level: "Intermediate", description: "Statistics, data management, exploratory analysis, visualisation and capstone projects.", ageLabel: "Ages 14+", format: "4 to 5 months", durationLabel: "48 to 60 hrs", isFeatured: true, sortOrder: 1 },
  { audience: "students", track: "Coding & Web", title: "Web Development", level: "Beginner", description: "HTML, CSS and Bootstrap, JavaScript and jQuery, frameworks and deployment.", ageLabel: "Ages 12+", format: "Group or 1-to-1", durationLabel: "32 to 48 hrs", isFeatured: true, sortOrder: 2 },
  { audience: "students", track: "Robotics & Kids", title: "Robotics", level: "Beginner", description: "Electronics and sensors, mechanical design and robot programming, geared to STEM pathways.", ageLabel: "Ages 10+", format: "3 to 4 months", durationLabel: "32 hrs", isFeatured: true, sortOrder: 3 },
  { audience: "students", track: "Design", title: "3D Design & Modeling", level: "Beginner", description: "Modelling fundamentals, sculpting, texturing and rendering for product and architecture.", ageLabel: "Ages 12+", format: "3 to 4 months", durationLabel: "32 hrs", isFeatured: true, sortOrder: 4 },
  { audience: "students", track: "AI & Data", title: "Gen AI for Smart Learning", level: "All levels", description: "AI study techniques, prompt engineering, memory and revision tools, ethical use.", ageLabel: "Ages 13+", format: "Group or 1-to-1", durationLabel: "2 months", isFeatured: true, sortOrder: 5 },
  { audience: "students", track: "Robotics & Kids", title: "Block Coding", level: "Beginner", description: "Scratch, Code.org, PictoBlox and EduBlocks — an early gateway for younger learners.", ageLabel: "Ages 7+", format: "3 to 4 months", durationLabel: "32 hrs", isFeatured: false, sortOrder: 6 },
  { audience: "students", track: "Coding & Web", title: "Internet of Things (IoT)", level: "Intermediate", description: "Sensors, microcontrollers and dashboards — connect the physical world to code.", ageLabel: "Ages 13+", format: "Group or 1-to-1", durationLabel: "32 hrs", isFeatured: false, sortOrder: 7 },
  { audience: "students", track: "Design", title: "UI/UX Design", level: "Beginner", description: "Research to a clickable prototype — the full product-design loop.", ageLabel: "Ages 14+", format: "Group or 1-to-1", durationLabel: "32 hrs", isFeatured: false, sortOrder: 8 },
  { audience: "professionals", track: "Applied AI", title: "Gen AI for Educators", level: "All levels", description: "Lesson design, assessment and feedback workflows with generative AI.", ageLabel: "Working professionals", format: "Cohort or 1-to-1", durationLabel: "2 months", isFeatured: true, sortOrder: 0 },
  { audience: "professionals", track: "Applied AI", title: "Gen AI for HR", level: "All levels", description: "Hiring, onboarding and people-ops workflows, redesigned around AI.", ageLabel: "Working professionals", format: "Cohort or 1-to-1", durationLabel: "2 months", isFeatured: true, sortOrder: 1 },
  { audience: "professionals", track: "Future Skills", title: "Design Thinking & Entrepreneurship", level: "All levels", description: "The IDEO/Stanford framework, applied to real problems your team owns.", ageLabel: "Working professionals", format: "Cohort", durationLabel: "Workshop", isFeatured: true, sortOrder: 2 },
  { audience: "professionals", track: "Future Skills", title: "Leadership & Communication", level: "All levels", description: "Practical leadership, feedback and presentation skills for people who manage people.", ageLabel: "Working professionals", format: "Cohort", durationLabel: "Workshop", isFeatured: true, sortOrder: 3 },
];

/* ---------- corporate track record ---------- */
const TRACK = [
  { whenLabel: "Feb 2023", client: "RAG Business Hub", blurb: "Full-staff leadership training: decision-making, communication, a culture of innovation.", badge: "Whole company", sortOrder: 0 },
  { whenLabel: "Dec 2023", client: "DP World", blurb: "Confidence and team building for a cohort of 100 staff, personalised coaching and exercises.", badge: "100 staff", sortOrder: 1 },
  { whenLabel: "Feb 2024", client: "RAG Business Hub", blurb: "Team building at the Business Bay head office for the entire team, CEO and co-founder included.", badge: "CEO included", sortOrder: 2 },
  { whenLabel: "Mar 2024", client: "Kayzan Group", blurb: "Two-day immersive outbound for 35 senior members at a farmhouse in Al Rahba, Abu Dhabi.", badge: "2 days · 35 people", sortOrder: 3 },
  { whenLabel: "May 2024", client: "Kayzan Group", blurb: "Emotional Selling & Leadership Accelerator for the sales team, Al Bustan Centre, Dubai.", badge: "Sales team", sortOrder: 4 },
  { whenLabel: "Sep 2024", client: "Al Ahalia Group", blurb: "Next Level Leadership for 50+ decision-makers across medical, operations, nursing, marketing & admin.", badge: "50+ leaders", sortOrder: 5 },
  { whenLabel: "Feb 2025", client: "DP World Digital", blurb: "Activity-based team building for the Enterprise Systems team, running 12:30pm to 10pm, with a BBQ.", badge: "Full day", sortOrder: 6 },
];

/* ---------- walk2lead phases ---------- */
const PHASES = [
  { label: "Phase 1", districts: "Kozhikode", schools: 1, students: 48, status: "complete", note: "Kinalur GUPS — the first school.", sortOrder: 0 },
  { label: "Phase 2", districts: "Malappuram & Kozhikode", schools: 16, students: 480, status: "complete", note: "", sortOrder: 1 },
  { label: "Phase 3", districts: "Kannur", schools: 3, students: 90, status: "complete", note: "", sortOrder: 2 },
  { label: "Phase 4", districts: "Kozhikode / Malappuram / Wayanad", schools: 24, students: 705, status: "currently running", note: "", sortOrder: 3 },
];

/* ---------- walk2lead student projects ---------- */
const W2L_PROJECTS = [
  { title: "Waste-Collecting River Boat", category: "Environment", description: "An Arduino-based boat using ultrasonic sensors to detect floating waste, DC-motor propellers and a front-mounted collection net — a low-cost answer to river and sea cleaning.", sortOrder: 0 },
  { title: "Medicine Delivery Robot", category: "Healthcare", description: "An autonomous assistant designed to support patients and reduce waiting time inside healthcare facilities.", sortOrder: 1 },
  { title: "Urine Bag Fill Alert", category: "Healthcare", description: "Automatically monitors urine bag levels and alerts hospital staff when full, for timely intervention and better hygiene.", sortOrder: 2 },
  { title: "Three-Wire Fault Line Detector", category: "Electrical Safety", description: "An Arduino Uno with push buttons and an LCD screen that gives real-time, safe status alerts for each line in a three-wire electrical system.", sortOrder: 3 },
  { title: "Life Guard", category: "Flood Safety", description: "An automatic hydraulic lift that detects rising floodwater and elevates living spaces and beds to protect occupants — an affordable add-on for homes in flood-prone areas.", sortOrder: 4 },
  { title: "Money Eating Monster", category: "Awareness", description: "An interactive smart piggy bank: a sensor detects each coin and a servo makes the monster “eat” it, turning saving into a game for children.", sortOrder: 5 },
  { title: "Gas Stove Automation System", category: "Home Safety", description: "A servo-controlled gas knob with ultrasonic boil detection and a smoke sensor that shuts off the stove when unsafe conditions are detected.", sortOrder: 6 },
];

/* ---------- DLI student outcomes ---------- */
const OUTCOMES = [
  { name: "Evana Eliza Vinoj", place: "Sharjah Indian School, UAE", win: "Digitised a village library with a Python application. Won the Sharjah Award for Educational Excellence, Distinguished Student, with a Dh30,000 scholarship.", tag: "Python", sortOrder: 0 },
  { name: "Aamil Nazar", place: "GHSS Medical College Campus, Kozhikode", win: "Built his school's website and was honoured by Kerala's education minister. Two-time winner of the state-level web design competition.", tag: "Web development", sortOrder: 1 },
  { name: "Adhil T S & Ameya M", place: "Kerala, India", win: "Champions at the TechTop International Bootcamp, held at Kerala Startup Mission's Maker Village, Kochi.", tag: "Robotics", sortOrder: 2 },
  { name: "Abhinav Krishna", place: "Kerala, India", win: "Inspire Award for a “Money Sanitizer Machine” and an auto waste-collection prototype.", tag: "Robotics", sortOrder: 3 },
  { name: "Neeraj V M", place: "Kerala, India", win: "Built a weather app and an ML project at age 14.", tag: "AI & Data", sortOrder: 4 },
];

/* ---------- starter blog posts (hub Journal) — client to edit ---------- */
const now = new Date();
const POSTS = [
  {
    vertical: null,
    title: "Inside a Walk2Lead district expo",
    slug: "inside-a-walk2lead-district-expo",
    excerpt: "What it takes to get government-school students from their first Arduino to a working prototype in three months.",
    tag: "DLI Foundation",
    status: "published",
    authorName: "De' Lead International",
    publishedAt: new Date(now.getTime() - 3 * 864e5),
    bodyMd: `Walk2Lead runs a three-month, 52-hour curriculum in rural and coastal government schools across Kerala — Arduino kits, sensors, coding, and AI-assisted building for Classes 6 and 7.\n\nEach school runs a two-stage selection down to about 30 students, builds through roughly 26 sessions, and ends with a school expo. The strongest projects go on to a district **Innovators Expo** judged by an external panel.\n\nBy the current phase that adds up to **44 schools, 1,300+ students, four districts** — each phase funded on the results of the last. Funded by Walkaroo Foundation, implemented end to end by De' Lead International.`,
  },
  {
    vertical: null,
    title: "Why we run camps, not classrooms",
    slug: "why-we-run-camps-not-classrooms",
    excerpt: "The thinking behind zip-lines and pitching drills as a curriculum, not a break from one.",
    tag: "TinkerChamps",
    status: "published",
    authorName: "De' Lead International",
    publishedAt: new Date(now.getTime() - 7 * 864e5),
    bodyMd: `TinkerChamps started after the pandemic — not to close an academic gap, but to address the behavioural and mental-health fallout students were carrying back into classrooms.\n\nThe format is a 3-day residential camp (plus a 2-day @School version) for grades 6–12: leadership and communication drills, public-speaking training, activity-based learning, outdoor challenges, and a career-guidance thread built into the week rather than bolted on.\n\nTwenty-plus seasons in, 500+ students have been through it. The zip-line isn't the point — it's the setup for the debrief.`,
  },
  {
    vertical: null,
    title: "A bootcamp that runs from inside NIT Calicut",
    slug: "a-bootcamp-that-runs-from-inside-nit-calicut",
    excerpt: "Why running seven modules through a working technology-business incubator changes how students think about what's next.",
    tag: "MakerChamps",
    status: "published",
    authorName: "De' Lead International",
    publishedAt: new Date(now.getTime() - 12 * 864e5),
    bodyMd: `MakerChamps is a 2-day, 1-night residential bootcamp on the NIT Calicut campus for class 8–12, capped at 60 seats.\n\nIt's co-hosted with **Nlightened ZenSolutions**, a startup incubated inside NIT Calicut's Technology Business Incubator, in association with the Centre for Holistic Teaching and Learning — so students get into real classrooms and labs, not a rented hall nearby.\n\nSeven hands-on modules run from expert mentor sessions and campus lab visits through design thinking, prototype building, and a final pitch. The main agenda isn't the prototype — it's two days of exposure to a top-ranked engineering campus, early enough to change what a student thinks is possible.`,
  },
];

async function main() {
  await seedIfEmpty("site_stats", STATS, () =>
    db.insert(siteStats).values(STATS as never),
  );
  await seedIfEmpty("testimonials", TESTIMONIALS, () =>
    db.insert(testimonials).values(TESTIMONIALS as never),
  );
  await seedIfEmpty("courses", COURSES, () => db.insert(courses).values(COURSES as never));
  await seedIfEmpty("track_record", TRACK, () => db.insert(trackRecord).values(TRACK as never));
  await seedIfEmpty("w2l_phases", PHASES, () => db.insert(w2lPhases).values(PHASES as never));
  await seedIfEmpty("w2l_projects", W2L_PROJECTS, () =>
    db.insert(w2lProjects).values(W2L_PROJECTS as never),
  );
  await seedIfEmpty("student_outcomes", OUTCOMES, () =>
    db.insert(studentOutcomes).values(OUTCOMES as never),
  );
  await seedIfEmpty("blog_posts", POSTS, () => db.insert(blogPosts).values(POSTS as never));
}

await main();
await raw.end();
console.log("content seed done.");
