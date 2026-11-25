import { ArrowRight, BookOpen, ClipboardCheck, Flame, Play } from "lucide-react";
import { go, courseStats, useStore } from "@/lib/store.jsx";
import { cn, dueLabel, fmtDay, plural, short, duration } from "@/lib/utils.js";
import { Avatar, Badge, Button, Card, CardHeader, CourseDot, Empty, Photo, Progress } from "@/components/ui/index.jsx";
import { CourseRow, DayRibbon, HoursChart } from "@/components/study.jsx";

const greeting = (d) => (d.getHours() < 12 ? "Good morning" : d.getHours() < 17 ? "Good afternoon" : "Good evening");
const More = ({ to, children }) => <Button variant="link" size="link" onClick={() => go(to)}>{children}<ArrowRight size={14} aria-hidden="true" /></Button>;

export default function Today() {
  const { student, courses, assignments, board, announcements, hours, agendaFor, courseById, now } = useStore();
  const stats = courses.map((c) => ({ c, s: courseStats(c) }));
  const resume = stats.find((x) => x.s.next?.watched > 0) ?? stats.find((x) => x.s.next);
  const due = assignments.filter((a) => a.status === "todo" && courseById(a.course)).sort((a, b) => a.due - b.due);
  const classCount = agendaFor(0).filter((s) => s.kind === "live").length;
  const ranking = board.week;
  const mine = ranking.findIndex((r) => r[0] === student.name);
  const rows = ranking.slice(0, 3).map((r, i) => ({ r, i }));
  if (mine > 2) rows.push({ r: ranking[mine], i: mine });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-[1_1_280px]">
          <h1 dir="auto" className="text-[28px] leading-tight font-semibold tracking-[-0.028em] break-words md:text-[34px]">{greeting(now)}, {student.first}</h1>
          <p className="mt-1 text-muted">{fmtDay(now, { weekday: "long", day: "numeric", month: "long" })}. {classCount ? `${plural(classCount, "live class", "live classes")} today` : "No live classes today"}{due.length ? `, ${plural(due.length, "assignment")} open.` : "."}</p>
        </div>
        <button onClick={() => go("profile")} className="press flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-3 text-sm font-semibold hover:bg-sunken">
          <Flame size={18} className="fill-streak text-streak" aria-hidden="true" />{plural(student.streak, "day")} streak
          <span className="font-medium text-muted">{short(student.xp)} XP</span>
        </button>
      </header>

      <Card aria-label="Today's timetable">
        <CardHeader title="Your day" description="Solid blocks are live classes. Dashed blocks are study time." action={<More to="schedule">Full week</More>} />
        <DayRibbon />
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          {resume ? (
            <Card className="group grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
              <button onClick={() => go(`lesson/${resume.c.id}/${resume.s.next.id}`)} aria-label={`Play ${resume.s.next.title}`} className="relative block min-h-48">
                <Photo course={resume.c} className="absolute inset-0" />
                <span className="absolute inset-0 grid place-items-center"><span className="grid size-14 place-items-center rounded-full bg-white/95 text-[#0d1512] shadow-lg transition-transform duration-200 ease-out-strong group-hover:scale-105"><Play size={22} className="ml-0.5 fill-current" aria-hidden="true" /></span></span>
              </button>
              <div className="flex min-w-0 flex-col gap-4 p-5 md:p-6">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[13px] text-muted"><CourseDot course={resume.c} /><span className="truncate">{resume.c.title}, lesson {resume.s.next.n} of {resume.s.total}</span></p>
                  <h2 dir="auto" className="mt-2 line-clamp-3 text-xl leading-snug font-semibold tracking-[-0.018em] break-words md:text-2xl">{resume.s.next.title}</h2>
                  <p className="mt-1 text-sm text-muted">{duration(resume.s.next.mins)} with {resume.c.tutor}</p>
                </div>
                <div className="mt-auto flex items-center gap-3"><Progress value={resume.s.next.watched} label="Lesson watched" /><span className="shrink-0 text-[13px] font-semibold">{resume.s.next.watched}%</span></div>
                <Button className="self-start" onClick={() => go(`lesson/${resume.c.id}/${resume.s.next.id}`)}>{resume.s.next.watched ? "Resume lesson" : "Start lesson"}<ArrowRight size={16} aria-hidden="true" /></Button>
              </div>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="Your courses" description={courses.length ? plural(courses.length, "course") : undefined} action={courses.length ? <More to="courses">All courses</More> : null} />
            {courses.length ? <div className="px-2 pb-2">{courses.slice(0, 5).map((c) => <CourseRow key={c.id} course={c} />)}</div>
              : <Empty icon={BookOpen} title="No courses yet" body="When your school enrols you, your courses appear here." />}
          </Card>
        </div>

        <aside className="grid min-w-0 gap-6 md:grid-cols-2 xl:grid-cols-1">
          <Card>
            <CardHeader title="Due next" action={due.length ? <More to="assignments">All</More> : null} />
            {due.length ? (
              <ul className="px-2 pb-2">
                {due.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <button onClick={() => go("assignments")} className="press flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-sunken">
                      <CourseDot course={courseById(a.course)} />
                      <span className="min-w-0 flex-1"><span dir="auto" title={a.title} className="line-clamp-2 text-sm font-semibold break-words">{a.title}</span><span className="block truncate text-xs text-muted">{courseById(a.course).title}</span></span>
                      <Badge tone={a.due < 0 ? "bad" : a.due <= 1 ? "warn" : "neutral"}>{a.due < 0 ? "Overdue" : dueLabel(a.due)}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <Empty icon={ClipboardCheck} title="Nothing due" body="New assignments from your tutors show up here." />}
          </Card>

          <Card><CardHeader title="Study time this week" /><HoursChart data={hours} goal={student.goalHours} /></Card>

          <Card>
            <CardHeader title="School leaderboard" action={ranking.length ? <More to="leaderboard">View</More> : null} />
            {ranking.length ? (
              <ol className="px-3 pb-3">
                {rows.map(({ r: [name, xp, img], i }) => (
                  <li key={`${name}-${i}`} className={cn("flex items-center gap-3 rounded-xl px-2 py-2", i === mine && "bg-tint text-tint-ink")}>
                    <span className="w-6 shrink-0 text-center text-sm font-semibold">{i + 1}</span><Avatar name={name} img={img} size={32} />
                    <span dir="auto" title={name} className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span><span className="shrink-0 text-[13px]">{short(xp)} XP</span>
                  </li>
                ))}
              </ol>
            ) : <Empty title="No ranking yet" body="Earn XP by finishing lessons." />}
          </Card>

          <Card>
            <CardHeader title="Announcements" />
            {announcements.length ? (
              <ul className="px-5 pb-3">{announcements.map((a) => <li key={a.id} className="border-t border-line py-3 first:border-0 first:pt-0"><p dir="auto" className="line-clamp-3 text-sm font-semibold break-words">{a.title}</p><p className="mt-0.5 text-[13px] text-muted">{a.when}. {a.body}</p></li>)}</ul>
            ) : <Empty title="No announcements" />}
          </Card>
        </aside>
      </div>
    </div>
  );
}
