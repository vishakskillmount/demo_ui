import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, FileText, Lock, Play, Target } from "lucide-react";
import { go } from "../state/router.js";
import { courseStats, lessonState, useStore } from "../state/store.jsx";
import CourseArt from "../components/CourseArt.jsx";
import { Avatar, Card, Empty, Segmented } from "../components/ui.jsx";

function Tabs({ course, lesson }) {
  const { notify, setOverlay } = useStore();
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");
  return (
    <div className="lesson-tabs">
      <Segmented label="Lesson sections" value={tab} onChange={setTab} options={[["overview", "Overview"], ["notes", "Notes"], ["files", "Resources"], ["quiz", "Quiz"]]} />
      <div className="tab-body" key={tab}>
        {tab === "overview" ? <p className="prose">In this lesson {course.tutor} builds the core idea step by step, then works through two exam-style problems. Finish the video and answer one question to complete it.</p> : null}
        {tab === "notes" ? (
          <form onSubmit={(e) => { e.preventDefault(); notify("Note saved"); }}>
            <label className="field-label" htmlFor="note">Your note for this lesson</label>
            <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What do you want to remember?" />
            <button className="btn ghost press" disabled={!note.trim()}>Save note</button>
          </form>
        ) : null}
        {tab === "files" ? (
          <ul className="rows">{["Lesson slides", `Worksheet ${lesson.n}`].map((f) => (
            <li key={f}><FileText size={19} aria-hidden="true" /><span className="min0"><b>{f}</b><small>PDF</small></span>
              <button className="icon-btn press" onClick={() => notify(`${f} download started`)} aria-label={`Download ${f}`}><Download size={17} /></button></li>
          ))}</ul>
        ) : null}
        {tab === "quiz" ? (
          <ul className="rows"><li><Target size={19} aria-hidden="true" /><span className="min0"><b>End of lesson question</b><small>{lesson.done ? `Completed with ${lesson.score}%` : "One question, retry as often as you need"}</small></span>
            <button className="btn ghost press" disabled={lesson.done} onClick={() => setOverlay({ type: "quiz", courseId: course.id, lessonId: lesson.id })}>Start</button></li></ul>
        ) : null}
      </div>
    </div>
  );
}

export default function Lesson({ courseId, lessonId }) {
  const { courses, notify, setOverlay } = useStore();
  const [playing, setPlaying] = useState(false);
  const course = courses.find((c) => c.id === courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);
  if (!lesson || lessonState(course, lesson) === "locked") {
    return <Card><Empty icon={Lock} title="This lesson is not available yet" body="Complete the earlier lessons to unlock it." action={<button className="btn ghost press" onClick={() => go(course ? `courses/${course.id}` : "courses")}>Back to lessons</button>} /></Card>;
  }
  const s = courseStats(course);
  const following = course.lessons[lesson.n];
  return (
    <>
      <button className="back press rise" style={{ "--i": 0 }} onClick={() => go(`courses/${course.id}`)}><ArrowLeft size={17} aria-hidden="true" /> {course.title}</button>
      <div className="split wide">
        <div className="min0">
          <div className="player rise" style={{ "--i": 1 }}>
            {playing ? (
              <iframe src={`https://www.youtube-nocookie.com/embed/${course.yt}?autoplay=1&rel=0&modestbranding=1`} title={`Video: ${lesson.title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            ) : (
              <button className="poster" onClick={() => setPlaying(true)} aria-label={`Play ${lesson.title}`}>
                <CourseArt course={course} />
                <span className="play-badge big"><Play size={32} aria-hidden="true" /></span>
              </button>
            )}
          </div>
          <div className="lesson-head rise" style={{ "--i": 2 }}>
            <div className="min0">
              <h1 className="h1">{lesson.title}</h1>
              <div className="tutor"><Avatar name={course.tutor} img={course.face} size={36} /><span className="muted">{course.tutor}, {lesson.mins} minutes</span></div>
            </div>
            <div className="lesson-actions">
              <button className={`btn press ${lesson.done ? "ghost" : "primary"}`} disabled={lesson.done} onClick={() => setOverlay({ type: "quiz", courseId: course.id, lessonId: lesson.id })}>
                <Check size={17} aria-hidden="true" /> {lesson.done ? "Completed" : "Mark complete"}
              </button>
              {following ? <button className="btn ghost press" onClick={() => (lesson.done ? go(`learn/${course.id}/${following.id}`) : notify("Complete this lesson to unlock the next one"))}>Next lesson <ArrowRight size={17} aria-hidden="true" /></button> : null}
            </div>
          </div>
          <Tabs course={course} lesson={lesson} />
        </div>
        <Card className="rise playlist-card" style={{ "--i": 3 }} title="Course lessons" sub={`${s.done} of ${s.total} complete`}>
          <ol className="playlist">
            {course.lessons.map((l) => {
              const state = lessonState(course, l);
              return (
                <li key={l.id} className={`${state} ${l.id === lesson.id ? "current" : ""}`}>
                  <button className="press" aria-current={l.id === lesson.id ? "true" : undefined} aria-disabled={state === "locked"}
                    onClick={() => (state === "locked" ? notify("Complete the previous lesson to unlock this one") : go(`learn/${course.id}/${l.id}`))}>
                    <span className="node">{state === "done" ? <Check size={15} strokeWidth={2.6} /> : state === "locked" ? <Lock size={14} /> : l.n}</span>
                    <span className="min0"><b className="clamp2">{l.title}</b><small>{l.mins} min</small></span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </>
  );
}
