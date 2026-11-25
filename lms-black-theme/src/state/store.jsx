import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { initialCourses, initialNotices, initialTasks, student } from "../data/mock.js";

const Store = createContext(null);
export const useStore = () => useContext(Store);

/** Lesson state is derived: finished, the next one to take, or locked. */
export function lessonState(course, lesson) {
  if (lesson.done) return "done";
  const next = course.lessons.find((l) => !l.done);
  return next && next.id === lesson.id ? "open" : "locked";
}

export function courseStats(course) {
  const done = course.lessons.filter((l) => l.done).length;
  const total = course.lessons.length;
  const partial = course.lessons.reduce((sum, l) => sum + (l.done ? 0 : l.watched / 100), 0);
  const pct = Math.round(((done + partial) / total) * 100);
  const status = done === total ? "completed" : pct === 0 ? "new" : "active";
  const scored = course.lessons.filter((l) => l.score);
  const avg = scored.length ? Math.round(scored.reduce((a, l) => a + l.score, 0) / scored.length) : null;
  const minsLeft = course.lessons.filter((l) => !l.done).reduce((a, l) => a + l.mins, 0);
  return { done, total, pct, status, avg, minsLeft, next: course.lessons.find((l) => !l.done) || null };
}

export function StoreProvider({ children }) {
  const [courses, setCourses] = useState(initialCourses);
  const [tasks, setTasks] = useState(initialTasks);
  const [notices, setNotices] = useState(initialNotices);
  const [xp, setXp] = useState(student.xp);
  const [toast, setToast] = useState(null);
  const [overlay, setOverlay] = useState(null); // { type, ...props }
  const [countdown, setCountdown] = useState(47 * 60 + 12);
  const toastTimer = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const completeLesson = useCallback((courseId, lessonId) => {
    setCourses((list) => list.map((c) => c.id !== courseId ? c : {
      ...c,
      lessons: c.lessons.map((l) => (l.id === lessonId ? { ...l, done: true, watched: 100, score: l.score || 90 } : l)),
    }));
    setXp((v) => v + 40);
    notify("Lesson complete. You earned 40 XP.");
  }, [notify]);

  const moveTask = useCallback((id, col) => setTasks((list) => list.map((t) => (t.id === id ? { ...t, col } : t))), []);
  const addTask = useCallback((title, course) => {
    setTasks((list) => [{ id: `t${Date.now()}`, title, course, due: 7, mins: 30, col: "todo" }, ...list]);
    notify("Task added to To do");
  }, [notify]);
  const readNotice = useCallback((id) => setNotices((list) => list.map((n) => (!id || n.id === id ? { ...n, unread: false } : n))), []);

  const value = useMemo(
    () => ({ courses, tasks, notices, xp, toast, overlay, countdown, notify, completeLesson, moveTask, addTask, readNotice, setOverlay }),
    [courses, tasks, notices, xp, toast, overlay, countdown, notify, completeLesson, moveTask, addTask, readNotice],
  );
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
