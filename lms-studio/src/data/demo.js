// Static mock data only. No network calls are made for content; photos, avatars and videos are public placeholders.
const photo = (id) => `https://images.unsplash.com/photo-${id}?w=960&q=70&auto=format&fit=crop`;
export const face = (n) => `https://i.pravatar.cc/96?img=${n}`;

const scores = [92, 88, 76, 95, 81, 90, 84, 87];
function course(base, done, watched, lessons) {
  return {
    ...base,
    lessons: lessons.map(([title, mins], i) => ({
      id: `${base.id}-${i + 1}`, n: i + 1, title, mins, done: i < done,
      watched: i < done ? 100 : i === done ? watched : 0, score: i < done ? scores[i % scores.length] : null,
    })),
  };
}

const courses = [
  course({ id: "math", code: "Maths", title: "Mathematics", sub: "Calculus and linear algebra", tutor: "Dr. Ravi Shankar", tutorImg: 12, photo: photo("1635070041078-e363dbe005cb"), video: "WUvTyaaNkzM", color: ["#2a58cc", "#86a8ff"], level: "Advanced", weeks: 14, students: 482, rating: 4.9 }, 5, 42,
    [["Limits and continuity", 42], ["Differentiation rules", 38], ["Applications of derivatives", 46], ["Integration basics", 40], ["Definite integrals", 44], ["Matrices and determinants", 48], ["Linear equations", 40], ["Vectors in three dimensions", 52]]),
  course({ id: "phy", code: "Physics", title: "Physics", sub: "Electromagnetism and optics", tutor: "Meera Nambiar", tutorImg: 47, photo: photo("1636466497217-26a8cbeaf0aa"), video: "mc979OhitAg", color: ["#0e7480", "#5cc8d4"], level: "Advanced", weeks: 12, students: 441, rating: 4.8 }, 3, 70,
    [["Electric charges and fields", 45], ["Gauss's law", 36], ["Electric potential", 41], ["Capacitors", 33], ["Moving charges", 47], ["Magnetism and matter", 39], ["Ray optics", 44], ["Wave optics", 50]]),
  course({ id: "chem", code: "Chemistry", title: "Chemistry", sub: "Physical and organic", tutor: "Dr. Farhan Ali", tutorImg: 53, photo: photo("1532094349884-543bc11b234d"), video: "IV4IUsholjg", color: ["#9a5b0c", "#e7b05c"], level: "Intermediate", weeks: 12, students: 398, rating: 4.7 }, 6, 0,
    [["Solutions and colligative properties", 40], ["Electrochemistry", 46], ["Chemical kinetics", 38], ["Haloalkanes", 35], ["Alcohols, phenols and ethers", 42], ["Aldehydes and ketones", 44]]),
  course({ id: "bio", code: "Biology", title: "Biology", sub: "Genetics and evolution", tutor: "Dr. Sreeja Pillai", tutorImg: 32, photo: photo("1576086213369-97a306d36557"), video: "8kK2zwjRV0M", color: ["#0f6b55", "#4cc7a3"], level: "Intermediate", weeks: 10, students: 367, rating: 4.8 }, 1, 20,
    [["Reproduction in organisms", 34], ["Human reproduction", 40], ["Principles of inheritance", 48], ["Molecular basis of inheritance", 52], ["Evolution", 36], ["Biotechnology", 41]]),
  course({ id: "cs", code: "Computing", title: "Computer Science", sub: "Python and data structures", tutor: "Arjun Kurian", tutorImg: 15, photo: photo("1515879218367-8466d910aaa4"), video: "rfscVS0vtbw", color: ["#475569", "#a8b6c8"], level: "Beginner", weeks: 10, students: 529, rating: 4.9 }, 0, 0,
    [["Functions and recursion", 43], ["File handling", 31], ["Stacks and queues", 47], ["Sorting algorithms", 45], ["SQL fundamentals", 50], ["Capstone project", 60]]),
  course({ id: "eng", code: "English", title: "English Core", sub: "Writing and literature", tutor: "Lakshmi Varma", tutorImg: 25, photo: photo("1481627834876-b7833e8f5570"), video: "MSYw502dJNY", color: ["#a63f52", "#ee93a3"], level: "Beginner", weeks: 8, students: 610, rating: 4.6 }, 4, 0,
    [["Reading comprehension", 28], ["Formal letter writing", 30], ["Poetry: Keeping Quiet", 35], ["Prose: The Last Lesson", 37]]),
];

const slot = (course, title, start, mins, kind) => ({ course, title, start, mins, kind });
const timetables = [
  [slot("eng", "Letter writing clinic", "09:00", 45, "live"), slot("phy", "Worksheet: Gauss's law", "11:00", 60, "study"), slot("chem", "Revision: electrochemistry", "13:45", 45, "study"), slot("bio", "Lab recap", "16:00", 50, "live"), slot("math", "Applications of derivatives", "18:30", 60, "live")],
  [slot("phy", "Gauss's law problem session", "10:00", 45, "live"), slot("math", "Practice: integrals", "15:30", 60, "study"), slot("cs", "Recursion walkthrough", "18:00", 60, "live")],
  [slot("bio", "Human reproduction", "10:30", 50, "live"), slot("eng", "Read: The Last Lesson", "16:00", 40, "study")],
  [slot("cs", "Functions and recursion", "14:00", 60, "live"), slot("chem", "Doubt clearing", "17:00", 45, "live")],
  [slot("math", "Integration doubt clearing", "11:00", 40, "live"), slot("phy", "Optics diagrams", "15:00", 45, "study")],
  [slot("chem", "Mock test", "09:30", 90, "live")],
  [],
];
export const agendaFor = (offset) => timetables[((offset % 7) + 7) % 7].map((s, i) => ({ ...s, id: `e${offset}-${i}`, offset }));

const task = (id, title, course, due, status, score = null) => ({ id, title, course, due, status, score });

export const demo = {
  student: { name: "Aanya Menon", first: "Aanya", img: 47, school: "Govt. HSS Calicut", grade: "Class 12, Science", email: "aanya.menon@student.example.com", location: "Kozhikode, Kerala", joined: "June 2025", xp: 12480, level: 14, streak: 12, longest: 21, rank: 4, goalHours: 30 },
  courses,
  agendaFor,
  hours: [["Mon", 3.2], ["Tue", 4.1], ["Wed", 2.4], ["Thu", 5.0], ["Fri", 3.6], ["Sat", 6.2], ["Sun", 1.8]],
  assignments: [
    task("a1", "Limits worksheet, problems 1 to 20", "math", 1, "todo"), task("a2", "Gauss's law practical write-up", "phy", 3, "todo"), task("a3", "Pedigree chart practice", "bio", 4, "todo"),
    task("a4", "Recursion exercises 3 and 4", "cs", 6, "todo"), task("a5", "Draft a letter to the editor", "eng", -1, "todo"), task("a6", "Electrochemistry mock quiz", "chem", -3, "graded", 86),
    task("a7", "Ray optics diagrams", "phy", 9, "todo"), task("a8", "Matrices revision sheet", "math", -2, "submitted"), task("a9", "Kinetics problem set", "chem", -8, "graded", 91), task("a10", "Poetry appreciation", "eng", -12, "graded", 78),
  ],
  board: {
    week: [["Ishaan Nair", 2140, 68, 2], ["Fathima Rasheed", 2055, 44, 0], ["Devika Suresh", 1980, 20, -1], ["Aanya Menon", 1870, 47, 1], ["Rohan Pillai", 1790, 59, -2], ["Neha George", 1710, 5, 3], ["Adil Muhammed", 1655, 11, 0], ["Sneha Krishnan", 1590, 9, 1]],
    month: [["Fathima Rasheed", 8420, 44, 1], ["Ishaan Nair", 8310, 68, -1], ["Aanya Menon", 7960, 47, 3], ["Devika Suresh", 7740, 20, 0], ["Neha George", 7320, 5, 2], ["Rohan Pillai", 7105, 59, -2], ["Sneha Krishnan", 6890, 9, 0], ["Adil Muhammed", 6610, 11, -1]],
    all: [["Ishaan Nair", 41200, 68, 0], ["Fathima Rasheed", 39880, 44, 0], ["Devika Suresh", 36140, 20, 1], ["Neha George", 33500, 5, -1], ["Aanya Menon", 31020, 47, 0], ["Rohan Pillai", 29770, 59, 2], ["Adil Muhammed", 27340, 11, 0], ["Sneha Krishnan", 25100, 9, 0]],
  },
  notices: [
    { id: "n1", title: "Mathematics live class is at 18:30 today", body: "Applications of derivatives with Dr. Ravi Shankar", ago: "2 min", unread: true },
    { id: "n2", title: "You moved up to 4th this week", body: "You passed Rohan Pillai with 310 XP", ago: "3 h", unread: true },
    { id: "n3", title: "Physics worksheet 6 is available", body: "Gauss's law, due Friday", ago: "1 day", unread: false },
  ],
  announcements: [
    { id: "an1", title: "Mid-term revision timetable is out", body: "Maths, Physics and Chemistry slots for next week.", when: "Today" },
    { id: "an2", title: "Guest session: careers in data science", body: "Saturday at 11:00 with Priya Raman.", when: "Saturday" },
  ],
  quiz: { question: "Which statement is true?", options: ["The derivative gives the slope of the tangent", "A continuous function is always differentiable", "Every limit exists at every point"], answer: 0 },
};
