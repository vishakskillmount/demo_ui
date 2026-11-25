import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Clock, ListChecks, Plus } from "lucide-react";
import { useStore } from "../state/store.jsx";
import { Card, Empty, SPRING } from "../components/ui.jsx";
import { Agenda, MonthCalendar, WeekGrid } from "../components/widgets.jsx";

export function Schedule() {
  const [date, setDate] = useState(() => new Date());
  return (
    <>
      <header className="page-head rise" style={{ "--i": 0 }}><div><h1 className="h1">Schedule</h1><p className="muted">Live classes and recordings from your tutors</p></div></header>
      <div className="split">
        <Card className="rise min0" style={{ "--i": 1 }}><WeekGrid /></Card>
        <Card className="rise" style={{ "--i": 2 }}><MonthCalendar selected={date} onSelect={setDate} /><Agenda date={date} /></Card>
      </div>
    </>
  );
}

const COLS = [["todo", "To do"], ["doing", "In progress"], ["done", "Done"]];

export function Tasks() {
  const { tasks, courses, moveTask, addTask } = useStore();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState(courses[0].id);
  const [error, setError] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setError(true);
    addTask(title.trim(), course);
    setTitle("");
  };
  return (
    <>
      <header className="page-head rise" style={{ "--i": 0 }}><div><h1 className="h1">Tasks</h1><p className="muted">{tasks.filter((t) => t.col !== "done").length} open, {tasks.filter((t) => t.col === "done").length} done</p></div></header>
      <form className="add-task rise" style={{ "--i": 1 }} onSubmit={submit} noValidate>
        <div className="add-field">
          <label className="field-label" htmlFor="task-title">New task</label>
          <input id="task-title" value={title} onChange={(e) => { setTitle(e.target.value); setError(false); }} placeholder="Revise integration formulas" aria-invalid={error} aria-describedby={error ? "task-error" : undefined} maxLength={120} />
          {error ? <p id="task-error" className="field-error">Enter what you need to do, then add it.</p> : null}
        </div>
        <div className="add-field narrow">
          <label className="field-label" htmlFor="task-course">Course</label>
          <select id="task-course" value={course} onChange={(e) => setCourse(e.target.value)}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
        </div>
        <button className="btn primary press"><Plus size={17} aria-hidden="true" /> Add task</button>
      </form>
      <LayoutGroup>
        <div className="kanban">
          {COLS.map(([key, label], ci) => {
            const list = tasks.filter((t) => t.col === key);
            return (
              <section key={key} className="column rise" style={{ "--i": ci + 2 }}>
                <header><h2 className="h2">{label}</h2><span className="tag">{list.length}</span></header>
                {list.map((t) => {
                  const c = courses.find((x) => x.id === t.course);
                  return (
                    <motion.article key={t.id} layout layoutId={t.id} transition={SPRING} className="task">
                      <span className={`task-course fill-${c.tone}`}>{c.title}</span>
                      <b className="clamp2">{t.title}</b>
                      <div className="task-foot">
                        <span className="muted small"><Clock size={14} aria-hidden="true" /> {t.mins} min, {key === "done" ? "submitted" : t.due <= 1 ? "due tomorrow" : `due in ${t.due} days`}</span>
                        <span className="task-moves">
                          {ci > 0 ? <button className="icon-btn press" onClick={() => moveTask(t.id, COLS[ci - 1][0])} aria-label={`Move "${t.title}" to ${COLS[ci - 1][1]}`}><ArrowLeft size={16} /></button> : null}
                          {ci < 2 ? <button className="icon-btn press" onClick={() => moveTask(t.id, COLS[ci + 1][0])} aria-label={`Move "${t.title}" to ${COLS[ci + 1][1]}`}><ArrowRight size={16} /></button> : null}
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
                {!list.length ? <Empty icon={ListChecks} title="Nothing here" body="Move a task into this column with its arrows." /> : null}
              </section>
            );
          })}
        </div>
      </LayoutGroup>
    </>
  );
}
