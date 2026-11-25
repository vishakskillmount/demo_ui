// Static mock data only. No network calls, no auth.

export const student = {
  name: "Aanya Menon", first: "Aanya", school: "Govt. HSS Calicut", grade: "Class 12, Science",
  email: "aanya.menon@student.example", phone: "+91 00000 00000", location: "Kozhikode, Kerala", joined: "June 2025",
  xp: 12480, level: 14, streak: 12, longest: 21, rank: 4, weeklyGoal: 8,
};

export const face = (id) => `https://i.pravatar.cc/96?img=${id}`;

const lesson = (title, mins) => ({ title, mins });

const rawCourses = [
  { id: "math", title: "Mathematics", sub: "Calculus and Linear Algebra", tutor: "Dr. Ravi Shankar", face: 12, tone: "lime", art: "waves", level: "Advanced", weeks: 14, enrolled: 482, rating: 4.9, yt: "rfscVS0vtbw", done: 5, watched: 42,
    lessons: [lesson("Limits and continuity", 42), lesson("Differentiation rules", 38), lesson("Applications of derivatives", 46), lesson("Integration basics", 40), lesson("Definite integrals", 44), lesson("Matrices and determinants", 48), lesson("Linear equations", 40), lesson("Vectors in three dimensions", 52)] },
  { id: "phy", title: "Physics", sub: "Electromagnetism and Optics", tutor: "Meera Nambiar", face: 47, tone: "sky", art: "orbit", level: "Advanced", weeks: 12, enrolled: 441, rating: 4.8, yt: "PkZNo7MFNFg", done: 3, watched: 70,
    lessons: [lesson("Electric charges and fields", 45), lesson("Gauss's law", 36), lesson("Electric potential", 41), lesson("Capacitors", 33), lesson("Moving charges", 47), lesson("Magnetism and matter", 39), lesson("Ray optics", 44), lesson("Wave optics", 50)] },
  { id: "chem", title: "Chemistry", sub: "Physical and Organic", tutor: "Dr. Farhan Ali", face: 53, tone: "butter", art: "hex", level: "Intermediate", weeks: 12, enrolled: 398, rating: 4.7, yt: "qz0aGYrrlhU", done: 6, watched: 0,
    lessons: [lesson("Solutions and colligative properties", 40), lesson("Electrochemistry", 46), lesson("Chemical kinetics", 38), lesson("Haloalkanes", 35), lesson("Alcohols, phenols and ethers", 42), lesson("Aldehydes and ketones", 44)] },
  { id: "bio", title: "Biology", sub: "Genetics and Evolution", tutor: "Dr. Sreeja Pillai", face: 32, tone: "lime", art: "cells", level: "Intermediate", weeks: 10, enrolled: 367, rating: 4.8, yt: "kqtD5dpn9C8", done: 1, watched: 20,
    lessons: [lesson("Reproduction in organisms", 34), lesson("Human reproduction", 40), lesson("Principles of inheritance", 48), lesson("Molecular basis of inheritance", 52), lesson("Evolution", 36), lesson("Biotechnology", 41)] },
  { id: "cs", title: "Computer Science", sub: "Python and Data Structures", tutor: "Arjun Kurian", face: 15, tone: "sky", art: "grid", level: "Beginner", weeks: 10, enrolled: 529, rating: 4.9, yt: "rfscVS0vtbw", done: 0, watched: 0,
    lessons: [lesson("Functions and recursion", 43), lesson("File handling", 31), lesson("Stacks and queues", 47), lesson("Sorting algorithms", 45), lesson("SQL fundamentals", 50), lesson("Capstone project", 60)] },
  { id: "eng", title: "English Core", sub: "Writing and Literature", tutor: "Lakshmi Varma", face: 25, tone: "butter", art: "pages", level: "Beginner", weeks: 8, enrolled: 610, rating: 4.6, yt: "PkZNo7MFNFg", done: 4, watched: 0,
    lessons: [lesson("Reading comprehension", 28), lesson("Formal letter writing", 30), lesson("Poetry: Keeping Quiet", 35), lesson("Prose: The Last Lesson", 37)] },
];

const scores = [92, 88, 76, 95, 81, 90, 84, 87];

export const initialCourses = rawCourses.map((c) => ({
  ...c,
  lessons: c.lessons.map((l, i) => ({
    ...l,
    id: `${c.id}-${i + 1}`,
    n: i + 1,
    done: i < c.done,
    watched: i < c.done ? 100 : i === c.done ? c.watched : 0,
    score: i < c.done ? scores[i % scores.length] : null,
  })),
}));

export const week = [
  { d: "Mon", h: 3.2 }, { d: "Tue", h: 4.1 }, { d: "Wed", h: 2.4 }, { d: "Thu", h: 5.0 },
  { d: "Fri", h: 3.6 }, { d: "Sat", h: 6.2 }, { d: "Sun", h: 1.8 },
];
export const months = [18, 22, 15, 26, 21, 29, 24, 31].map((h, i) => ({ d: `W${i + 1}`, h }));

const day = (off) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + off); return d; };
const klass = (id, course, title, off, start, mins, state) => ({ id, course, title, off, date: day(off), start, mins, state });

// state: soon | locked | done | missed
export const classes = [
  klass("k1", "math", "Applications of derivatives", 0, "18:30", 60, "soon"),
  klass("k2", "eng", "Letter writing clinic", 0, "09:00", 45, "done"),
  klass("k3", "phy", "Gauss's law problem session", 1, "17:00", 45, "locked"),
  klass("k4", "bio", "Human reproduction", 2, "10:30", 50, "locked"),
  klass("k5", "cs", "Functions and recursion", 3, "14:00", 60, "locked"),
  klass("k6", "math", "Integration doubt clearing", 5, "11:00", 40, "locked"),
  klass("k7", "phy", "Electric potential", -1, "17:00", 41, "done"),
  klass("k8", "math", "Differentiation rules", -2, "13:30", 38, "done"),
  klass("k9", "bio", "Reproduction in organisms", -3, "16:00", 34, "missed"),
];

export const initialTasks = [
  { id: "t1", title: "Limits worksheet, problems 1 to 20", course: "math", due: 4, mins: 130, col: "todo" },
  { id: "t2", title: "Gauss's law practical write-up", course: "phy", due: 7, mins: 105, col: "doing" },
  { id: "t3", title: "Electrochemistry mock quiz", course: "chem", due: -3, mins: 55, col: "done" },
  { id: "t4", title: "Pedigree chart practice", course: "bio", due: 2, mins: 40, col: "todo" },
  { id: "t5", title: "Recursion exercises 3 and 4", course: "cs", due: 6, mins: 75, col: "todo" },
  { id: "t6", title: "Draft a letter to the editor", course: "eng", due: -1, mins: 30, col: "done" },
  { id: "t7", title: "Matrices revision sheet", course: "math", due: 1, mins: 50, col: "doing" },
  { id: "t8", title: "Ray optics diagrams", course: "phy", due: 9, mins: 45, col: "todo" },
];

export const board = {
  week: [["Ishaan Nair", 2140, 68, 2], ["Fathima Rasheed", 2055, 44, 0], ["Devika Suresh", 1980, 20, -1], ["Aanya Menon", 1870, 47, 1], ["Rohan Pillai", 1790, 59, -2], ["Neha George", 1710, 5, 3], ["Adil Muhammed", 1655, 11, 0], ["Sneha Krishnan", 1590, 9, 1]],
  month: [["Fathima Rasheed", 8420, 44, 1], ["Ishaan Nair", 8310, 68, -1], ["Aanya Menon", 7960, 47, 3], ["Devika Suresh", 7740, 20, 0], ["Neha George", 7320, 5, 2], ["Rohan Pillai", 7105, 59, -2], ["Sneha Krishnan", 6890, 9, 0], ["Adil Muhammed", 6610, 11, -1]],
  all: [["Ishaan Nair", 41200, 68, 0], ["Fathima Rasheed", 39880, 44, 0], ["Devika Suresh", 36140, 20, 1], ["Neha George", 33500, 5, -1], ["Aanya Menon", 31020, 47, 0], ["Rohan Pillai", 29770, 59, 2], ["Adil Muhammed", 27340, 11, 0], ["Sneha Krishnan", 25100, 9, 0]],
};

export const initialNotices = [
  { id: "n1", title: "Mathematics live class starts soon", body: "Applications of derivatives with Dr. Ravi Shankar", ago: "2m", unread: true, icon: "video" },
  { id: "n2", title: "You moved up to rank 4 this week", body: "You passed Rohan Pillai with 310 XP", ago: "3h", unread: true, icon: "trophy" },
  { id: "n3", title: "Physics worksheet 6 is available", body: "Gauss's law, due Friday", ago: "1d", unread: true, icon: "file" },
  { id: "n4", title: "Quiz result: Differentiation rules", body: "You scored 88%. Two questions to review.", ago: "2d", unread: false, icon: "target" },
];

export const announcements = [
  { id: "a1", tag: "Exam", title: "Mid-term revision timetable is out", body: "Maths, Physics and Chemistry slots for next week.", when: "Today" },
  { id: "a2", tag: "Event", title: "Careers in data science, guest session", body: "Saturday at 11:00 with Priya Raman.", when: "Sat" },
  { id: "a3", tag: "Update", title: "New practice bank in Biology", body: "240 questions grouped by chapter.", when: "Mon" },
];

export const badges = [
  { name: "Early bird", how: "5 lessons before 8 AM", pct: 100 },
  { name: "Quiz ace", how: "Score 90% or more three times", pct: 100 },
  { name: "Streak 14", how: "Study 14 days in a row", pct: 86 },
  { name: "Night owl", how: "10 lessons after 10 PM", pct: 40 },
  { name: "Course finisher", how: "Complete 3 courses", pct: 66 },
  { name: "Top three", how: "Reach top 3 on the weekly board", pct: 70 },
];

// 18 weeks of activity, 0 to 4, deterministic
export const heat = Array.from({ length: 18 * 7 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  return v < 0.26 ? 0 : v < 0.5 ? 1 : v < 0.72 ? 2 : v < 0.9 ? 3 : 4;
});

export const quiz = {
  question: "Which statement is true?",
  options: ["The derivative gives the slope of the tangent", "A continuous function is always differentiable", "Every limit exists at every point"],
  answer: 0,
};
