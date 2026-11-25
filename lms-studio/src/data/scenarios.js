// Stress-test datasets. Same shape as the demo data, swapped at the data boundary. Used in development only.
import { demo } from "./demo.js";

function worst() {
  const c = structuredClone({ ...demo, agendaFor: undefined });
  Object.assign(c.student, {
    name: "Aleksandra Wiśniewska-Kowalczyk-Montgomery III", first: "Aleksandra",
    email: "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
    school: "Government Higher Secondary School for Girls, Kozhikode North Educational Sub-District",
    grade: "Class 12, Science with Computer Applications and Mathematics", img: null, xp: 12345678, streak: 1, longest: 1, rank: 1284,
  });
  Object.assign(c.courses[0], { title: "Advanced Mathematics for Engineering Entrance Examinations", code: "Advanced Mathematics", sub: "Calculus, linear algebra, vectors and three-dimensional coordinate geometry", tutor: "Dr. Venkatachalapathy Ramasubramanian Iyer", students: 1000000 });
  c.courses[0].lessons[5].title = "Limits, continuity and differentiability of piecewise-defined functions in several variables";
  c.courses[1].lessons = c.courses[1].lessons.slice(0, 1); c.courses[1].lessons[0] = { ...c.courses[1].lessons[0], done: false, watched: 0, score: null };
  Object.assign(c.courses[2], { photo: "https://images.example.com/missing.jpg", tutorImg: null });
  Object.assign(c.courses[3], { title: "Benachrichtigungseinstellungen", tutor: "Đặng Thị Ngọc Hân" });
  Object.assign(c.courses[4], { title: "CS", code: "CS", sub: "", tutor: "Jo" });
  c.assignments[0].title = "Submit: https://example.com/classes/12/physics/worksheets/9f8e7d6c5b4a?tab=comments&filter=unresolved";
  c.assignments[1].title = "<script>alert(1)</script> & **bold** practical write-up with a very long description that keeps going";
  c.assignments[4].due = -400;
  c.assignments[5].score = 100;
  const names = ["Bartholomew Fitzgerald-Okonkwo", "王秀英", "نور الهدى عبد الرحمن", "Aleksandra Wiśniewska-Kowalczyk-Montgomery III", "J", "👩🏽‍💻 Priya", "dana", "  Sam   Lee "];
  for (const k of Object.keys(c.board)) c.board[k] = c.board[k].map((r, i) => [names[i], i === 0 ? 12345678 : r[1], i % 2 ? null : r[2], i === 1 ? 1284 : r[3]]);
  c.notices[0].title = "Mathematics live class for Advanced Engineering Entrance Examinations starts at half past six today, please join early";
  c.announcements[0].title = "Mid-term revision timetable for every Science stream section across both campuses has now been published";
  c.agendaFor = (offset) => {
    const day = demo.agendaFor(offset);
    // overlapping, very short and out-of-hours slots
    return [...day, ...(offset === 0 ? [{ id: "w1", offset, course: "math", title: "Overlapping extra doubt-clearing session for entrance examinations", start: "18:45", mins: 15, kind: "live" }, { id: "w2", offset, course: "cs", title: "Early", start: "06:15", mins: 20, kind: "study" }, { id: "w3", offset, course: "phy", title: "Late revision", start: "21:30", mins: 90, kind: "study" }] : [])];
  };
  return c;
}

function empty() {
  return {
    ...demo, courses: [], assignments: [], notices: [], announcements: [], agendaFor: () => [],
    student: { ...demo.student, xp: 0, streak: 0, longest: 0, rank: 0 },
    hours: demo.hours.map(([d]) => [d, 0]), board: { week: [], month: [], all: [] },
  };
}

function one() {
  const c = demo.courses[0];
  return {
    ...demo, courses: [{ ...c, students: 1, weeks: 1, lessons: [{ ...c.lessons[0], done: false, watched: 0, score: null }] }],
    assignments: [{ ...demo.assignments[0], due: 0 }], notices: demo.notices.slice(0, 1), announcements: demo.announcements.slice(0, 1),
    agendaFor: (o) => demo.agendaFor(o).filter((s) => s.course === "math").slice(0, 1),
    student: { ...demo.student, streak: 1, longest: 1, rank: 1, xp: 1 },
    board: { week: [["Aanya Menon", 1, 47, 0]], month: [["Aanya Menon", 1, 47, 0]], all: [["Aanya Menon", 1, 47, 0]] },
  };
}

function many() {
  const list = Array.from({ length: 1200 }, (_, i) => ({ ...demo.assignments[i % 10], id: `m${i}`, title: `${demo.assignments[i % 10].title} (set ${i + 1})`, due: (i % 40) - 20 }));
  const rows = Array.from({ length: 1284 }, (_, i) => [i === 3 ? "Aanya Menon" : `Student ${i + 1}`, 50000 - i * 31, (i % 60) + 1, (i % 5) - 2]);
  const courses = Array.from({ length: 48 }, (_, i) => { const c = demo.courses[i % 6]; const id = `${c.id}${i}`; return i < 6 ? c : { ...c, id, title: `${c.title} ${Math.floor(i / 6) + 1}`, lessons: c.lessons.map((l) => ({ ...l, id: `${id}-${l.n}` })) }; });
  return { ...demo, assignments: list, courses, board: { week: rows, month: rows, all: rows } };
}

export const SCENARIOS = { demo: () => demo, worst, empty, one, many };
