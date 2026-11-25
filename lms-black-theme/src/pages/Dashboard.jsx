import { useState } from "react";
import { ArrowRight, Check, Megaphone, Play } from "lucide-react";
import { announcements, board, months, student, week } from "../data/mock.js";
import { go } from "../state/router.js";
import { courseStats, useStore } from "../state/store.jsx";
import { Avatar, Card, DAYS, Ring, Segmented, num } from "../components/ui.jsx";
import CourseArt from "../components/CourseArt.jsx";
import { Agenda, CourseCard, Countdown, HoursChart, MonthCalendar } from "../components/widgets.jsx";

const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

export default function Dashboard() {
  const { courses, tasks, xp, moveTask } = useStore();
  const [range, setRange] = useState("week");
  const [date, setDate] = useState(() => new Date());
  const stats = courses.map((c) => ({ c, ...courseStats(c) }));
  const resume = stats.find((s) => s.next && s.next.watched > 0) || stats.find((s) => s.next);
  const lessonsDone = stats.reduce((a, s) => a + s.done, 0);
  const lessonsTotal = stats.reduce((a, s) => a + s.total, 0);
  const scored = stats.filter((s) => s.avg);
  const avg = Math.round(scored.reduce((a, s) => a + s.avg, 0) / scored.length);
  const doneTasks = tasks.filter((t) => t.col === "done").length;
  const doingTasks = tasks.filter((t) => t.col === "doing").length;
  const segments = [["Done", doneTasks, "lime"], ["In progress", doingTasks, "sky"], ["To do", tasks.length - doneTasks - doingTasks, "hatch"]];
  const series = range === "week" ? week : months;
  const total = series.reduce((a, d) => a + d.h, 0);
  const checklist = [...tasks].sort((a, b) => (a.col === "done") - (b.col === "done") || a.due - b.due).slice(0, 5);

  return (
    <div className="dash">
      <div className="dash-main">
        <section className="hero rise" style={{ "--i": 0 }}>
          <div className="min0">
            <p className="muted">{greeting()}, {student.first}</p>
            <h1 className="display">What will you learn today?</h1>
          </div>
          <dl className="big-stats">
            <div><dd>{courses.length}</dd><dt>Courses</dt></div>
            <div><dd>{lessonsDone}</dd><dt>Lessons done</dt></div>
            <div><dd>{student.streak}</dd><dt>Day streak</dt></div>
          </dl>
        </section>

        <section className="segments rise" style={{ "--i": 1 }} aria-label="Task progress this week">
          {segments.map(([label, count, tone]) => (
            <button key={label} className="segment press" style={{ flexGrow: Math.max(count, 1) }} onClick={() => go("tasks")}>
              <span className="segment-label">{label}</span>
              <span className={`segment-pill ${tone}`}>{count} {count === 1 ? "task" : "tasks"}</span>
            </button>
          ))}
        </section>

        <div className="tiles">
          <button className="tile fill-lime press rise" style={{ "--i": 2 }} onClick={() => go("courses")}>
            <span>Lessons completed</span><b>{lessonsDone}<small>/{lessonsTotal}</small></b><em>{Math.round((lessonsDone / lessonsTotal) * 100)}% of your syllabus</em>
          </button>
          <button className="tile fill-sky press rise" style={{ "--i": 3 }} onClick={() => go("profile")}>
            <span>Average quiz score</span><b>{avg}<small>%</small></b><em>Up 4 points this month</em>
          </button>
          <button className="tile fill-butter press rise" style={{ "--i": 4 }} onClick={() => go("rank")}>
            <span>Experience points</span><b>{num(xp)}</b><em>Level {student.level}, rank {student.rank} this week</em>
          </button>
        </div>

        <div className="row-2">
          {resume ? (
            <article className="resume rise" style={{ "--i": 5 }}>
              <button className="resume-media" onClick={() => go(`learn/${resume.c.id}/${resume.next.id}`)} aria-label={`Resume ${resume.next.title}`}>
                <CourseArt course={resume.c} />
                <span className="play-badge"><Play size={24} aria-hidden="true" /></span>
              </button>
              <div className="resume-body">
                <div className="min0">
                  <p className="muted small">{resume.c.title}, lesson {resume.next.n} of {resume.total}</p>
                  <h2 className="h2 clamp2">{resume.next.title}</h2>
                </div>
                <Ring value={resume.next.watched} size={62} stroke={6} label={`${resume.next.watched}% watched`}><small>{resume.next.watched}%</small></Ring>
              </div>
              <button className="btn primary block press" onClick={() => go(`learn/${resume.c.id}/${resume.next.id}`)}>Resume lesson <ArrowRight size={17} aria-hidden="true" /></button>
            </article>
          ) : null}
          <Card className="rise" style={{ "--i": 6 }} title="Study time" sub={`${total.toFixed(1)} hours, ${range === "week" ? "this week" : "last 8 weeks"}`}
            action={<Segmented label="Range" value={range} onChange={setRange} options={[["week", "7d"], ["month", "8w"]]} />}>
            <HoursChart key={range} data={series} />
          </Card>
        </div>

        <section className="rise" style={{ "--i": 7 }}>
          <header className="section-head"><h2 className="h2">Your courses</h2><button className="link" onClick={() => go("courses")}>View all <ArrowRight size={15} aria-hidden="true" /></button></header>
          <div className="course-grid three">{stats.slice(0, 3).map((s, i) => <CourseCard key={s.c.id} course={s.c} index={8 + i} />)}</div>
        </section>

        <div className="row-2">
          <Card className="rise" style={{ "--i": 8 }} title="This week's tasks" sub={`${doneTasks} of ${tasks.length} complete`} onOpen={() => go("tasks")}>
            <ul className="checklist">
              {checklist.map((t) => {
                const done = t.col === "done";
                const course = courses.find((c) => c.id === t.course);
                return (
                  <li key={t.id}>
                    <button role="checkbox" aria-checked={done} onClick={() => moveTask(t.id, done ? "todo" : "done")}>
                      <span className="check"><Check size={14} strokeWidth={3} aria-hidden="true" /></span>
                      <span className="min0"><b className="clamp1">{t.title}</b><small>{course.title}, {done ? "done" : t.due <= 1 ? "due tomorrow" : `due in ${t.due} days`}</small></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card className="rise" style={{ "--i": 9 }} title="Leaderboard" sub="Top of your school this week" onOpen={() => go("rank")}>
            <ol className="leaders">
              {board.week.slice(0, 5).map(([name, pts, img], i) => (
                <li key={name} className={name === student.name ? "me-row" : ""}>
                  <span className="pos">{i + 1}</span><Avatar name={name} img={img} size={36} />
                  <b className="trunc">{name}</b><span className="muted small">{num(pts)} XP</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <aside className="dash-side">
        <Card className="rise" style={{ "--i": 2 }} title="Next class" sub={`Today, ${DAYS[new Date().getDay()]}`}><Countdown /></Card>
        <Card className="rise" style={{ "--i": 4 }}>
          <MonthCalendar selected={date} onSelect={setDate} />
          <Agenda date={date} />
        </Card>
        <Card className="rise" style={{ "--i": 6 }} title="Announcements">
          <ul className="rows">
            {announcements.map((a) => (
              <li key={a.id}><Megaphone size={18} aria-hidden="true" /><span className="min0"><b>{a.title}</b><small>{a.tag}, {a.when}. {a.body}</small></span></li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
