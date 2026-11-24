/* Static mock data. No network, no auth. */
const D = (() => {
  const student = {
    name: "Aanya Menon", first: "Aanya", school: "Govt. HSS Calicut", grade: "Class 12 · Science",
    email: "aanya.menon@student.skillmount.in", phone: "+91 98470 12345", joined: "June 2025",
    location: "Kozhikode, Kerala", xp: 12480, level: 14, streak: 12, longest: 21, activeToday: false, rank: 4,
  };

  const covers = {
    math: ["#2b57cf", "#5b93ff"], phy: ["#25607f", "#5aa7cf"], chem: ["#4a4db0", "#8088ea"],
    bio: ["#1f6f62", "#52b8a2"], eng: ["#34589e", "#82a6e6"], cs: ["#383c86", "#7378d4"],
  };

  const mod = (t, mins, extra = {}) => ({ title: t, mins, ...extra });
  const courses = [
    { id: "math12", title: "Mathematics", sub: "Calculus & Linear Algebra", tutor: "Dr. Ravi Shankar", cover: "math", level: "Advanced", weeks: 14, enrolled: 482, rating: 4.9,
      modules: [mod("Limits and continuity", 42), mod("Differentiation rules", 38), mod("Applications of derivatives", 46), mod("Integration basics", 40), mod("Definite integrals", 44, { quiz: true }), mod("Matrices and determinants", 48), mod("Linear equations", 40), mod("Vectors in 3D", 52)], done: 5, resume: 5, resumePct: 0.42 },
    { id: "phy12", title: "Physics", sub: "Electromagnetism & Optics", tutor: "Meera Nambiar", cover: "phy", level: "Advanced", weeks: 12, enrolled: 441, rating: 4.8,
      modules: [mod("Electric charges and fields", 45), mod("Gauss's law", 36), mod("Electric potential", 41), mod("Capacitors", 33), mod("Moving charges", 47), mod("Magnetism and matter", 39), mod("Ray optics", 44), mod("Wave optics", 50)], done: 3, resume: 3, resumePct: 0.7 },
    { id: "chem12", title: "Chemistry", sub: "Physical & Organic", tutor: "Dr. Farhan Ali", cover: "chem", level: "Intermediate", weeks: 12, enrolled: 398, rating: 4.7,
      modules: [mod("Solutions and colligative properties", 40), mod("Electrochemistry", 46), mod("Chemical kinetics", 38), mod("Haloalkanes", 35), mod("Alcohols, phenols, ethers", 42), mod("Aldehydes and ketones", 44)], done: 6, resume: -1, resumePct: 0 },
    { id: "bio12", title: "Biology", sub: "Genetics & Evolution", tutor: "Dr. Sreeja Pillai", cover: "bio", level: "Intermediate", weeks: 10, enrolled: 367, rating: 4.8,
      modules: [mod("Reproduction in organisms", 34), mod("Human reproduction", 40), mod("Principles of inheritance", 48), mod("Molecular basis of inheritance", 52), mod("Evolution", 36), mod("Biotechnology", 41)], done: 1, resume: 1, resumePct: 0.2 },
    { id: "cs12", title: "Computer Science", sub: "Python & Data Structures", tutor: "Arjun Kurian", cover: "cs", level: "Beginner", weeks: 10, enrolled: 529, rating: 4.9,
      modules: [mod("Functions and recursion", 43), mod("File handling", 31), mod("Stacks and queues", 47), mod("Sorting algorithms", 45), mod("SQL fundamentals", 50), mod("Capstone project", 60)], done: 0, resume: -2, resumePct: 0 },
    { id: "eng12", title: "English Core", sub: "Writing & Literature", tutor: "Lakshmi Varma", cover: "eng", level: "Beginner", weeks: 8, enrolled: 610, rating: 4.6,
      modules: [mod("Reading comprehension", 28), mod("Formal letter writing", 30), mod("Poetry: Keeping Quiet", 35), mod("Prose: The Last Lesson", 37)], done: 4, resume: -1, resumePct: 0 },
  ];

  const media = { math12: ["rfscVS0vtbw", "mathboard"], phy12: ["PkZNo7MFNFg", "physlab"], chem12: ["qz0aGYrrlhU", "chemlab"], bio12: ["kqtD5dpn9C8", "biolab"], cs12: ["rfscVS0vtbw", "codedesk"], eng12: ["PkZNo7MFNFg", "booksread"] };
  courses.forEach((c) => { c.yt = media[c.id][0]; c.img = "https://picsum.photos/seed/" + media[c.id][1] + "/640/420"; });
  // Derive per-course progress + module status
  courses.forEach((c) => {
    c.total = c.modules.length;
    c.pct = Math.round(((c.done + (c.resume >= 0 ? c.resumePct : 0)) / c.total) * 100);
    c.modules.forEach((m, i) => {
      m.id = c.id + "-" + (i + 1);
      m.n = i + 1;
      if (i < c.done) m.state = "done";
      else if (i === c.done) m.state = "open";
      else if (i === c.done + 1 && c.id !== "cs12") m.state = "scheduled";
      else m.state = "locked";
      m.pct = m.state === "done" ? 100 : m.state === "open" ? Math.round((c.resume === i ? c.resumePct : 0) * 100) : 0;
      m.score = m.state === "done" ? [92, 88, 76, 95, 81, 90][i % 6] : null;
    });
    c.status = c.done >= c.total ? "completed" : c.done === 0 && !c.resumePct ? "new" : "active";
  });
  courses.find((c) => c.id === "chem12").done = 6; // fully done
  const chem = courses.find((c) => c.id === "chem12");
  chem.modules.forEach((m) => { m.state = "done"; m.pct = 100; m.score = m.score || 87; });
  chem.pct = 100; chem.status = "completed";
  const eng = courses.find((c) => c.id === "eng12");
  eng.modules.forEach((m) => { m.state = "done"; m.pct = 100; m.score = m.score || 90; });
  eng.pct = 100; eng.status = "completed";

  const today = new Date();
  const dayLabel = (off) => { const d = new Date(today); d.setDate(d.getDate() + off); return d; };
  const classes = [
    { id: "c1", course: "math12", title: "Applications of derivatives", tutor: "Dr. Ravi Shankar", off: 0, time: "18:30", mins: 60, kind: "live", state: "soon", in: 47 * 60 + 12 },
    { id: "c2", course: "phy12", title: "Gauss's law · problem session", tutor: "Meera Nambiar", off: 1, time: "17:00", mins: 45, kind: "live", state: "locked" },
    { id: "c3", course: "bio12", title: "Human reproduction", tutor: "Dr. Sreeja Pillai", off: 2, time: "16:30", mins: 50, kind: "live", state: "locked" },
    { id: "c4", course: "cs12", title: "Functions and recursion", tutor: "Arjun Kurian", off: 3, time: "19:00", mins: 60, kind: "live", state: "locked" },
    { id: "c5", course: "math12", title: "Integration basics · doubt clearing", tutor: "Dr. Ravi Shankar", off: 5, time: "18:00", mins: 40, kind: "live", state: "locked" },
    { id: "c6", course: "phy12", title: "Electric potential", tutor: "Meera Nambiar", off: -1, time: "17:00", mins: 41, kind: "recorded", state: "done" },
    { id: "c7", course: "math12", title: "Differentiation rules", tutor: "Dr. Ravi Shankar", off: -2, time: "18:30", mins: 38, kind: "recorded", state: "done" },
    { id: "c8", course: "bio12", title: "Reproduction in organisms", tutor: "Dr. Sreeja Pillai", off: -4, time: "16:30", mins: 34, kind: "recorded", state: "missed" },
  ].map((c) => ({ ...c, date: dayLabel(c.off) }));

  const week = [3.2, 4.1, 2.4, 5.0, 3.6, 6.2, 1.8];            // hours, Mon-Sun
  const month = [18, 22, 15, 26, 21, 29, 24, 31];              // weekly hours, 8 weeks
  const heat = Array.from({ length: 17 * 7 }, (_, i) => { const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1; return v < 0.28 ? 0 : v < 0.5 ? 1 : v < 0.72 ? 2 : v < 0.9 ? 3 : 4; });

  const board = {
    week:  [["Ishaan Nair", 2140], ["Fathima Rasheed", 2055], ["Devika Suresh", 1980], ["Aanya Menon", 1870], ["Rohan Pillai", 1790], ["Neha George", 1710], ["Adil Muhammed", 1655], ["Sneha Krishnan", 1590], ["Kiran Das", 1512], ["Maya Thomas", 1440]],
    month: [["Fathima Rasheed", 8420], ["Ishaan Nair", 8310], ["Aanya Menon", 7960], ["Devika Suresh", 7740], ["Neha George", 7320], ["Rohan Pillai", 7105], ["Sneha Krishnan", 6890], ["Adil Muhammed", 6610], ["Maya Thomas", 6240], ["Kiran Das", 5980]],
    all:   [["Ishaan Nair", 41200], ["Fathima Rasheed", 39880], ["Devika Suresh", 36140], ["Neha George", 33500], ["Aanya Menon", 31020], ["Rohan Pillai", 29770], ["Adil Muhammed", 27340], ["Sneha Krishnan", 25100], ["Maya Thomas", 23990], ["Kiran Das", 21860]],
  };

  const notices = [
    { id: "n1", t: "Mathematics live class starts in 47 minutes", s: "Applications of derivatives · Dr. Ravi Shankar", ago: "2m", unread: true, type: "class" },
    { id: "n2", t: "You moved up to rank 4 this week", s: "Overtook Rohan Pillai with +310 XP", ago: "3h", unread: true, type: "rank" },
    { id: "n3", t: "Physics worksheet 6 is available", s: "Gauss's law · due Friday", ago: "Yesterday", unread: true, type: "file" },
    { id: "n4", t: "Quiz result: Differentiation rules", s: "You scored 88% · 2 questions to review", ago: "2d", unread: false, type: "quiz" },
    { id: "n5", t: "Keep your 12-day streak alive", s: "Open any lesson today before midnight", ago: "2d", unread: false, type: "streak" },
  ];

  const announcements = [
    { tag: "Exam", t: "Mid-term revision schedule published", s: "Download the timetable for Maths, Physics and Chemistry.", when: "Today" },
    { tag: "Event", t: "Guest session on careers in data science", s: "Saturday, 11:00 with Priya Raman, ML Engineer.", when: "Sat" },
    { tag: "Update", t: "New practice bank added to Biology", s: "240 NEET-style questions grouped by chapter.", when: "Mon" },
  ];

  const badges = [
    { n: "Early bird", d: "5 lessons before 8 AM", got: true }, { n: "Quiz ace", d: "Score 90%+ three times", got: true },
    { n: "Streak 14", d: "14 days in a row", got: false, p: 86 }, { n: "Night owl", d: "10 lessons after 10 PM", got: false, p: 40 },
    { n: "Course finisher", d: "Complete 3 courses", got: false, p: 66 }, { n: "Top 3", d: "Reach top 3 on the weekly board", got: false, p: 70 },
  ];

  return { student, courses, classes, week, month, heat, board, notices, announcements, badges, covers };
})();

/* Worst-case + empty variants (dev only), applied at the data boundary. */
function applyDataMode(mode) {
  if (mode === "demo") return D;
  const c = structuredClone(D);
  c.classes.forEach((x) => { x.date = new Date(x.date); });
  if (mode === "worst") {
    c.student.name = "Aleksandra Wiśniewska-Kowalczyk-Montgomery III";
    c.student.first = "Aleksandra";
    c.student.school = "Government Higher Secondary School for Girls, Kozhikode North";
    c.student.email = "aleksandra.wisniewska-kowalczyk@northwind-industries-holdings.example.com";
    c.courses[0].title = "Advanced Mathematics for Engineering Entrance Examinations";
    c.courses[0].sub = "Calculus, Linear Algebra, Vectors and Three-Dimensional Geometry";
    c.courses[0].tutor = "Dr. Venkatachalapathy Ramasubramanian";
    c.courses[0].modules[0].title = "Limits, continuity and differentiability of piecewise-defined functions in several variables";
    c.courses[1].modules = c.courses[1].modules.slice(0, 1); c.courses[1].total = 1; c.courses[1].done = 0; c.courses[1].pct = 0;
    c.courses[1].modules[0].state = "open"; c.courses[1].modules[0].pct = 0;
    c.courses[4].title = "CS"; c.courses[4].tutor = "Jo";
    c.classes[0].title = "Applications of derivatives: maxima, minima and optimisation word problems";
    c.board.week[0][0] = "Bartholomew Fitzgerald-Okonkwo"; c.board.week[0][1] = 1234567;
    c.board.week[1][0] = "Jo"; c.board.week[2][0] = "李小龍 Wei";
    c.student.xp = 1234567;
    c.notices[0].t = "Mathematics live class for Advanced Engineering Entrance Examinations starts in 47 minutes — please join early";
    c.announcements[0].t = "Mid-term revision schedule for all Science stream sections across both campuses has been published";
  }
  if (mode === "empty") {
    c.courses = []; c.classes = []; c.notices = []; c.announcements = []; c.week = [0, 0, 0, 0, 0, 0, 0]; c.month = [0, 0, 0, 0, 0, 0, 0, 0]; c.heat = c.heat.map(() => 0); c.student.streak = 0; c.student.longest = 0; c.student.xp = 0;
  }
  return c;
}
