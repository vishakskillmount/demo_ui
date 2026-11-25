import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, Check, CircleCheck, FileText, Flame, Target, Trophy, Video } from "lucide-react";
import { initialCourses, quiz, student } from "../data/mock.js";
import { useStore } from "../state/store.jsx";
import { Dialog, Empty, SPRING } from "./ui.jsx";

const ICONS = { video: Video, trophy: Trophy, file: FileText, target: Target };

function Notices({ onClose }) {
  const { notices, readNotice } = useStore();
  return (
    <Dialog title="Notifications" onClose={onClose} side>
      <button className="link" onClick={() => readNotice()} disabled={!notices.some((n) => n.unread)}>Mark all as read</button>
      <ul className="notice-list">
        {notices.map((n) => {
          const Icon = ICONS[n.icon];
          return (
            <li key={n.id}>
              <button className={`notice press ${n.unread ? "unread" : ""}`} onClick={() => readNotice(n.id)}>
                <span className="notice-icon"><Icon size={18} aria-hidden="true" /></span>
                <span className="min0"><b>{n.title}</b><small>{n.body}</small></span>
                <time>{n.ago}</time>
              </button>
            </li>
          );
        })}
      </ul>
      {!notices.length ? <Empty title="You are all caught up" /> : null}
    </Dialog>
  );
}

function Streak({ onClose }) {
  return (
    <Dialog title="Your streak" onClose={onClose}>
      <div className="streak-hero">
        <Flame size={34} aria-hidden="true" />
        <div><b>{student.streak} days</b><small>Longest so far: {student.longest} days</small></div>
      </div>
      <div className="streak-days">
        {[10, 11, 12, 13, 14].map((d) => (
          <div key={d} className={d < student.streak ? "done" : d === student.streak ? "today" : ""}>
            <i>{d < student.streak ? <Check size={18} /> : d}</i><small>Day {d}</small>
          </div>
        ))}
      </div>
      <ul className="rows">
        {[[7, "Bronze flame"], [14, "Silver flame"], [30, "Gold flame"]].map(([d, name]) => (
          <li key={d}><Award size={20} aria-hidden="true" /><span className="min0"><b>{name}</b><small>{d} days in a row</small></span>
            <span className={`tag ${student.streak >= d ? "lime" : ""}`}>{student.streak >= d ? "Earned" : `${d - student.streak} to go`}</span></li>
        ))}
      </ul>
      <button className="btn primary block press" onClick={onClose}>Keep going</button>
    </Dialog>
  );
}

function Quiz({ onClose, courseId, lessonId }) {
  const { completeLesson } = useStore();
  const [pick, setPick] = useState(null);
  const [result, setResult] = useState(null);
  const course = initialCourses.find((c) => c.id === courseId);
  const check = () => {
    if (pick === quiz.answer) {
      setResult("right");
      setTimeout(() => { completeLesson(courseId, lessonId); onClose(); }, 700);
    } else setResult("wrong");
  };
  return (
    <Dialog title="End of lesson question" onClose={onClose}>
      <p className="muted">{course?.title}. Answer correctly to complete this lesson.</p>
      <p className="question">{quiz.question}</p>
      <div className="options" role="radiogroup" aria-label={quiz.question}>
        {quiz.options.map((o, i) => (
          <button key={o} role="radio" aria-checked={pick === i} className={`option press ${pick === i && result ? result : ""}`}
            onClick={() => { setPick(i); setResult(null); }} disabled={result === "right"}>
            <span className="radio" />{o}
          </button>
        ))}
      </div>
      <p className={`feedback ${result || ""}`} role="status">{result === "wrong" ? "Not quite. Pick another answer and try again." : result === "right" ? "Correct." : ""}</p>
      <button className="btn primary block press" disabled={pick === null || result === "right"} onClick={check}>Check answer</button>
    </Dialog>
  );
}

function Confirm({ onClose }) {
  return (
    <Dialog title="Delete your account?" onClose={onClose}>
      <p className="muted">This removes your progress, XP and certificates, and cannot be undone. This is a demo, so nothing is deleted.</p>
      <div className="dialog-actions">
        <button className="btn ghost press" onClick={onClose}>Keep account</button>
        <button className="btn danger press" onClick={onClose}>Delete account</button>
      </div>
    </Dialog>
  );
}

export default function Overlays() {
  const { overlay, setOverlay, toast } = useStore();
  const close = () => setOverlay(null);
  return (
    <>
      <AnimatePresence>
        {overlay?.type === "notices" ? <Notices key="notices" onClose={close} /> : null}
        {overlay?.type === "streak" ? <Streak key="streak" onClose={close} /> : null}
        {overlay?.type === "quiz" ? <Quiz key="quiz" onClose={close} courseId={overlay.courseId} lessonId={overlay.lessonId} /> : null}
        {overlay?.type === "delete" ? <Confirm key="delete" onClose={close} /> : null}
      </AnimatePresence>
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {toast ? (
            <motion.div key={toast.key} className="toast" initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }} transition={SPRING}>
              <CircleCheck size={18} aria-hidden="true" />{toast.message}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
