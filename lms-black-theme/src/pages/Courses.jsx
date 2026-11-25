import { useState } from "react";
import { ArrowLeft, BookOpen, Check, Download, FileText, Lock, MessageSquare, Play, Search } from "lucide-react";
import { go } from "../state/router.js";
import { courseStats, lessonState, useStore } from "../state/store.jsx";
import CourseArt from "../components/CourseArt.jsx";
import { Avatar, Bar, Card, Empty, Ring, Segmented, num, plural } from "../components/ui.jsx";
import { CourseCard } from "../components/widgets.jsx";

export function Courses() {
  const { courses } = useStore();
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const withStatus = courses.map((c) => ({ c, status: courseStats(c).status }));
  const count = (k) => (k === "all" ? withStatus.length : withStatus.filter((x) => x.status === k).length);
  const list = withStatus.filter((x) => (filter === "all" || x.status === filter) && `${x.c.title} ${x.c.sub} ${x.c.tutor}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <header className="page-head rise" style={{ "--i": 0 }}>
        <div><h1 className="h1">My courses</h1><p className="muted">{plural(courses.length, "course", "courses")}, {count("completed")} completed</p></div>
      </header>
      <div className="toolbar rise" style={{ "--i": 1 }}>
        <Segmented label="Filter courses" value={filter} onChange={setFilter}
          options={[["all", "All", count("all")], ["active", "In progress", count("active")], ["completed", "Completed", count("completed")], ["new", "Not started", count("new")]]} />
        <label className="field"><Search size={17} aria-hidden="true" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name or tutor" aria-label="Filter by name or tutor" /></label>
      </div>
      {list.length ? <div className="course-grid">{list.map((x, i) => <CourseCard key={x.c.id} course={x.c} index={i + 2} />)}</div>
        : <Card><Empty icon={BookOpen} title="No courses match" body="Try another filter or clear your search." action={<button className="btn ghost press" onClick={() => { setQ(""); setFilter("all"); }}>Reset filters</button>} /></Card>}
    </>
  );
}

export function CourseDetail({ id }) {
  const { courses, notify } = useStore();
  const course = courses.find((c) => c.id === id);
  if (!course) return <Card><Empty icon={BookOpen} title="Course not found" action={<button className="btn ghost press" onClick={() => go("courses")}>Back to courses</button>} /></Card>;
  const s = courseStats(course);
  return (
    <>
      <button className="back press rise" style={{ "--i": 0 }} onClick={() => go("courses")}><ArrowLeft size={17} aria-hidden="true" /> My courses</button>
      <section className={`course-hero fill-${course.tone} rise`} style={{ "--i": 1 }}>
        <div className="course-hero-text">
          <h1 className="display">{course.title}</h1>
          <p>{course.sub}</p>
          <dl className="hero-facts">
            <div><dd>{s.total}</dd><dt>Lessons</dt></div><div><dd>{course.weeks}</dd><dt>Weeks</dt></div>
            <div><dd>{num(course.enrolled)}</dd><dt>Students</dt></div><div><dd>{course.rating}</dd><dt>Rating</dt></div>
          </dl>
          {s.next ? <button className="btn dark press" onClick={() => go(`learn/${course.id}/${s.next.id}`)}><Play size={16} aria-hidden="true" /> {s.next.watched ? "Resume" : "Start"} lesson {s.next.n}</button>
            : <button className="btn dark press" onClick={() => notify("Certificate download started")}><Download size={16} aria-hidden="true" /> Get certificate</button>}
        </div>
        <CourseArt course={course} />
      </section>
      <div className="split">
        <Card className="rise" style={{ "--i": 2 }} title="Lessons" sub={`${s.done} of ${s.total} complete`}>
          <ol className="path">
            {course.lessons.map((l) => {
              const state = lessonState(course, l);
              return (
                <li key={l.id} className={state}>
                  <button className="path-row press" aria-disabled={state === "locked"}
                    onClick={() => (state === "locked" ? notify("Complete the previous lesson to unlock this one") : go(`learn/${course.id}/${l.id}`))}>
                    <span className="node">{state === "done" ? <Check size={18} strokeWidth={2.6} /> : state === "locked" ? <Lock size={16} /> : l.n}</span>
                    <span className="min0">
                      <b className="clamp2">{l.title}</b>
                      <small>{l.mins} min{state === "done" ? `, score ${l.score}%` : state === "open" ? (l.watched ? `, ${l.watched}% watched` : ", ready to start") : ", locked"}</small>
                      {state === "open" && l.watched ? <Bar value={l.watched} tone={course.tone} /> : null}
                    </span>
                    {state !== "locked" ? <span className={`tag ${state === "open" ? "lime" : ""}`}>{state === "done" ? "Rewatch" : l.watched ? "Resume" : "Start"}</span> : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
        <aside className="stack">
          <Card className="rise" style={{ "--i": 3 }}>
            <div className="progress-summary">
              <Ring value={s.pct} size={132} stroke={11} tone={course.tone}><b>{s.pct}%</b><small>complete</small></Ring>
              <dl><div><dt>Average score</dt><dd>{s.avg ? `${s.avg}%` : "No quiz yet"}</dd></div><div><dt>Time left</dt><dd>{(s.minsLeft / 60).toFixed(1)} h</dd></div></dl>
            </div>
          </Card>
          <Card className="rise" style={{ "--i": 4 }} title="Your tutor">
            <div className="tutor"><Avatar name={course.tutor} img={course.face} size={52} /><span className="min0"><b className="trunc">{course.tutor}</b><small>Replies within a day</small></span></div>
            <button className="btn ghost block press" onClick={() => notify("Message sent to your tutor")}><MessageSquare size={17} aria-hidden="true" /> Ask a question</button>
          </Card>
          <Card className="rise" style={{ "--i": 5 }} title="Resources">
            <ul className="rows">
              {["Course syllabus", "Formula sheet", "Practice set 1"].map((f) => (
                <li key={f}><FileText size={19} aria-hidden="true" /><span className="min0"><b>{f}</b><small>PDF</small></span>
                  <button className="icon-btn press" onClick={() => notify(`${f} download started`)} aria-label={`Download ${f}`}><Download size={17} /></button></li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
