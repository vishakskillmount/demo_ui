import { useState } from "react";
import { ArrowLeft, BookOpen, Check, Download, FileText, LayoutGrid, List, Lock, MessageSquare, Play, Search } from "lucide-react";
import { go, courseStats, lessonState, useStore } from "@/lib/store.jsx";
import { cn, duration, num, plural } from "@/lib/utils.js";
import { Avatar, Badge, Button, Card, CardHeader, Dialog, Empty, Input, Photo, Progress, Segmented } from "@/components/ui/index.jsx";
import { CourseCard, CourseRow } from "@/components/study.jsx";

export const PageHeader = ({ title, description, action }) => (
  <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0"><h1 className="text-[28px] leading-tight font-semibold tracking-[-0.028em] md:text-[32px]">{title}</h1>{description ? <p className="mt-1 break-words text-muted">{description}</p> : null}</div>
    {action}
  </header>
);

export function Courses() {
  const { courses } = useStore();
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(12);
  const tagged = courses.map((c) => ({ c, status: courseStats(c).status }));
  const count = (k) => (k === "all" ? tagged.length : tagged.filter((x) => x.status === k).length);
  const term = q.trim().toLowerCase();
  const list = tagged.filter((x) => (filter === "all" || x.status === filter) && `${x.c.title} ${x.c.sub} ${x.c.tutor}`.toLowerCase().includes(term));
  return (
    <>
      <PageHeader title="Courses" description={`${plural(courses.length, "course")}, ${num(count("completed"))} completed`} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Segmented label="Filter by progress" value={filter} onValueChange={(v) => { setFilter(v); setLimit(12); }} items={[["all", "All", count("all")], ["active", "In progress", count("active")], ["completed", "Completed", count("completed")], ["new", "Not started", count("new")]]} />
        <div className="relative ml-auto w-full sm:w-64"><Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden="true" /><Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by course or tutor" aria-label="Filter by course or tutor" className="pl-9" /></div>
        <Segmented label="Layout" value={view} onValueChange={setView} items={[["grid", <LayoutGrid key="g" size={16} aria-hidden="true" />], ["list", <List key="l" size={16} aria-hidden="true" />]]} />
      </div>
      {!list.length ? (
        <Card><Empty icon={BookOpen} title={courses.length ? "No courses match" : "No courses yet"} body={courses.length ? "Try another filter or clear your search." : "When your school enrols you, your courses appear here."} action={courses.length ? <Button variant="outline" onClick={() => { setFilter("all"); setQ(""); }}>Reset filters</Button> : null} /></Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-5">{list.slice(0, limit).map((x) => <CourseCard key={x.c.id} course={x.c} />)}</div>
      ) : <Card className="p-2">{list.slice(0, limit).map((x) => <CourseRow key={x.c.id} course={x.c} />)}</Card>}
      {list.length > limit ? <div className="mt-6 text-center"><Button variant="outline" onClick={() => setLimit((n) => n + 12)}>Show more ({num(list.length - limit)} left)</Button></div> : null}
    </>
  );
}

export function CourseDetail({ id }) {
  const { courseById, notify } = useStore();
  const [asking, setAsking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const course = courseById(id);
  if (!course) return <Card><Empty icon={BookOpen} title="Course not found" action={<Button variant="outline" onClick={() => go("courses")}>Back to courses</Button>} /></Card>;
  const s = courseStats(course);
  const send = (e) => { e.preventDefault(); if (!message.trim()) return setError(true); setAsking(false); setMessage(""); notify("Question sent to your tutor"); };
  return (
    <>
      <Button variant="ghost" size="sm" className="mb-3 -ml-3" onClick={() => go("courses")}><ArrowLeft size={16} aria-hidden="true" />Courses</Button>
      <Card className="mb-6 grid overflow-hidden md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div className="flex min-w-0 flex-col gap-4 p-6 md:p-8">
          <div>
            <div className="flex flex-wrap gap-2"><Badge>{course.level}</Badge><Badge>{plural(course.weeks, "week")}</Badge></div>
            <h1 dir="auto" className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.028em] break-words md:text-4xl">{course.title}</h1>
            {course.sub ? <p className="mt-2 break-words text-muted">{course.sub}</p> : null}
          </div>
          <dl className="grid grid-cols-3 gap-4 border-y border-line py-4">
            {[["Lessons", num(s.total)], [course.students === 1 ? "Student" : "Students", num(course.students)], ["Rating", course.rating]].map(([k, v]) => <div key={k} className="min-w-0"><dt className="text-xs text-muted">{k}</dt><dd className="truncate text-xl font-semibold" title={String(v)}>{v}</dd></div>)}
          </dl>
          <div className="mt-auto flex flex-wrap gap-3">
            {s.next ? <Button onClick={() => go(`lesson/${course.id}/${s.next.id}`)}><Play size={16} className="fill-current" aria-hidden="true" />{s.next.watched ? "Resume" : "Start"} lesson {s.next.n}</Button>
              : <Button onClick={() => notify("Certificate download started")}><Download size={16} aria-hidden="true" />Download certificate</Button>}
            <Button variant="outline" onClick={() => setAsking(true)}><MessageSquare size={16} aria-hidden="true" />Ask your tutor</Button>
          </div>
        </div>
        <div className="group max-md:order-first"><Photo course={course} className="h-full min-h-52 w-full" /></div>
      </Card>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title="Syllabus" description={`${s.done} of ${plural(s.total, "lesson")} complete`} />
          <ol className="px-2 pb-2">
            {course.lessons.map((l) => {
              const state = lessonState(course, l);
              return (
                <li key={l.id}>
                  <button aria-disabled={state === "locked"} onClick={() => (state === "locked" ? notify("Complete the previous lesson to unlock this one") : go(`lesson/${course.id}/${l.id}`))}
                    className={cn("press flex w-full items-center gap-4 rounded-xl p-3 text-left", state === "locked" ? "cursor-not-allowed" : "hover:bg-sunken", state === "open" && "bg-tint/60")}>
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold", state === "done" ? "bg-primary text-primary-ink" : state === "open" ? "border-2 border-primary text-ink" : "bg-sunken text-muted")}>{state === "done" ? <Check size={18} strokeWidth={2.6} aria-label="Done" /> : state === "locked" ? <Lock size={15} aria-label="Locked" /> : l.n}</span>
                    <span className="min-w-0 flex-1"><span dir="auto" className={cn("line-clamp-2 font-semibold break-words", state === "locked" && "text-muted")}>{l.title}</span><span className="block text-[13px] text-muted">{duration(l.mins)}{state === "open" && l.watched ? `, ${l.watched}% watched` : ""}</span></span>
                    {state === "done" ? <Badge tone="good">{l.score}%</Badge> : state === "open" ? <Badge tone="good">{l.watched ? "Resume" : "Start"}</Badge> : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
        <aside className="grid gap-6">
          <Card className="p-5">
            <p className="flex items-baseline justify-between gap-3"><span className="text-sm text-muted">Progress</span><span className="text-3xl font-semibold tracking-[-0.025em]">{s.pct}%</span></p>
            <Progress value={s.pct} label="Course progress" className="mt-2 h-2" />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted">Average score</dt><dd className="font-semibold">{s.avg ? `${s.avg}%` : "No scores yet"}</dd></div><div><dt className="text-muted">Time left</dt><dd className="font-semibold">{s.minsLeft ? duration(s.minsLeft) : "None"}</dd></div></dl>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3"><Avatar name={course.tutor} img={course.tutorImg} size={48} /><div className="min-w-0"><p dir="auto" className="font-semibold break-words">{course.tutor}</p><p className="text-[13px] text-muted">Course tutor</p></div></div>
          </Card>
          <Card>
            <CardHeader title="Resources" />
            <ul className="px-2 pb-2">{["Course syllabus", "Formula sheet", "Practice set"].map((f) => <li key={f}><button onClick={() => notify(`${f} download started`)} className="press flex h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-sunken"><FileText size={17} className="shrink-0 text-muted" aria-hidden="true" /><span className="flex-1 truncate">{f}</span><Download size={16} className="shrink-0 text-muted" aria-label="Download PDF" /></button></li>)}</ul>
          </Card>
        </aside>
      </div>
      <Dialog open={asking} onOpenChange={(v) => { setAsking(v); setError(false); }} title="Ask your tutor" description={`${course.tutor} usually replies within a day.`}>
        <form onSubmit={send} noValidate>
          <label htmlFor="question" className="text-sm font-semibold">Your question</label>
          <textarea id="question" value={message} onChange={(e) => { setMessage(e.target.value); setError(false); }} maxLength={600} aria-invalid={error} aria-describedby={error ? "question-error" : undefined} placeholder="Which part of the lesson is unclear?" className="mt-1.5 min-h-28 w-full resize-y rounded-[10px] border border-line-strong bg-surface p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 aria-invalid:border-bad" />
          {error ? <p id="question-error" role="alert" className="mt-1 text-[13px] text-bad">Write your question before sending it.</p> : null}
          <div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setAsking(false)}>Cancel</Button><Button type="submit">Send question</Button></div>
        </form>
      </Dialog>
    </>
  );
}
