import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { demo } from "@/data/demo.js";
import { SCENARIOS } from "@/data/scenarios.js";
import { clampPct } from "./utils.js";

/* ---------- hash router ---------- */
const subscribe = (cb) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
export const useRoute = () => useSyncExternalStore(subscribe, () => window.location.hash.replace(/^#\/?/, "") || "today").split("/").filter(Boolean);
export const go = (path) => { window.location.hash = `/${path}`; };

/* ---------- scenario (development only) ---------- */
export const scenario = (() => {
  if (!import.meta.env.DEV) return "demo";
  const q = new URLSearchParams(window.location.search).get("data");
  return q && q in SCENARIOS ? q : "demo";
})();
const source = import.meta.env.DEV ? SCENARIOS[scenario]() : demo;

/* ---------- derived ---------- */
export function courseStats(course) {
  const total = course.lessons.length;
  const done = course.lessons.filter((l) => l.done).length;
  const partial = course.lessons.reduce((s, l) => s + (l.done ? 0 : l.watched / 100), 0);
  const pct = total ? clampPct(((done + partial) / total) * 100) : 0;
  const scored = course.lessons.filter((l) => l.score);
  return {
    total, done, pct,
    status: total && done === total ? "completed" : pct === 0 ? "new" : "active",
    next: course.lessons.find((l) => !l.done) ?? null,
    avg: scored.length ? Math.round(scored.reduce((s, l) => s + l.score, 0) / scored.length) : null,
    minsLeft: course.lessons.filter((l) => !l.done).reduce((s, l) => s + l.mins, 0),
  };
}
export const lessonState = (course, lesson) => (lesson.done ? "done" : course.lessons.find((l) => !l.done)?.id === lesson.id ? "open" : "locked");

const Store = createContext(null);
export const useStore = () => useContext(Store);

const readTheme = () => { try { return localStorage.getItem("theme") || "light"; } catch { return "light"; } };

export function StoreProvider({ children }) {
  const [courses, setCourses] = useState(source.courses);
  const [assignments, setAssignments] = useState(source.assignments);
  const [notices, setNotices] = useState(source.notices);
  const [theme, setTheme] = useState(readTheme);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const timer = useRef(0);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && media.matches));
    apply();
    try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  const notify = useCallback((message) => {
    clearTimeout(timer.current);
    setToast({ message, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3400);
  }, []);

  const completeLesson = useCallback((courseId, lessonId) => {
    setCourses((list) => list.map((c) => (c.id !== courseId ? c : { ...c, lessons: c.lessons.map((l) => (l.id === lessonId ? { ...l, done: true, watched: 100, score: l.score || 90 } : l)) })));
    notify("Lesson completed");
  }, [notify]);
  const submitAssignment = useCallback((id) => { setAssignments((list) => list.map((a) => (a.id === id ? { ...a, status: "submitted" } : a))); notify("Assignment submitted"); }, [notify]);
  const readNotice = useCallback((id) => setNotices((list) => list.map((n) => (!id || n.id === id ? { ...n, unread: false } : n))), []);
  const courseById = useCallback((id) => courses.find((c) => c.id === id), [courses]);

  const value = useMemo(
    () => ({ ...source, courses, assignments, notices, theme, setTheme, toast, notify, now, completeLesson, submitAssignment, readNotice, courseById }),
    [courses, assignments, notices, theme, toast, notify, now, completeLesson, submitAssignment, readNotice, courseById],
  );
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
