import { useEffect, useState } from "react";
import { BookOpen, CalendarOff, ChevronRight, PlayCircle, Radio } from "lucide-react";
import { go, courseStats, useStore } from "@/lib/store.jsx";
import { cn, duration, plural, short, toClock, toMinutes } from "@/lib/utils.js";
import { Avatar, Badge, Button, CourseDot, Empty, Photo, Progress, Tooltip } from "./ui/index.jsx";

const hueStyle = (course) => ({ "--cl": course.color[0], "--cd": course.color[1] });

/** Where a slot stands relative to the clock. */
export function slotStatus(slot, now) {
  if (slot.offset < 0) return "past";
  if (slot.offset > 0) return "later";
  const t = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(slot.start);
  if (t >= start + slot.mins) return "past";
  return t >= start - 15 ? "open" : "later";
}

function SlotAction({ slot, course, status }) {
  const { notify } = useStore();
  if (slot.kind === "study") {
    const next = courseStats(course).next;
    return <Button onClick={() => go(next ? `lesson/${course.id}/${next.id}` : `courses/${course.id}`)}><BookOpen size={17} aria-hidden="true" />Start studying</Button>;
  }
  if (status === "past") return <Button variant="outline" onClick={() => notify("Opening the class recording")}><PlayCircle size={17} aria-hidden="true" />Watch recording</Button>;
  if (status === "open") return <Button onClick={() => notify("Opening the live class room")}><Radio size={17} aria-hidden="true" />Join class</Button>;
  return <Button variant="outline" disabled>Opens at {toClock(toMinutes(slot.start) - 15)}</Button>;
}

/**
 * The day ribbon: a school day drawn to scale. Blocks sit at their real time and length,
 * a marker shows the current time, and choosing a block shows its details underneath.
 */
export function DayRibbon({ offset = 0 }) {
  const { agendaFor, courseById, now } = useStore();
  const slots = agendaFor(offset).filter((s) => courseById(s.course)).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [offset]);

  if (!slots.length) return <Empty icon={CalendarOff} title="Nothing scheduled" body="Classes and study blocks appear here once they are planned." />;

  const selected = slots.find((s) => s.id === picked) ?? slots.find((s) => slotStatus(s, now) !== "past") ?? slots[slots.length - 1];
  const from = Math.min(8 * 60, ...slots.map((s) => Math.floor(toMinutes(s.start) / 60) * 60));
  const to = Math.max(20 * 60, ...slots.map((s) => Math.ceil((toMinutes(s.start) + s.mins) / 60) * 60));
  const pct = (m) => ((m - from) / (to - from)) * 100;
  // Overlapping slots stack into lanes. Very short slots keep a minimum drawn length.
  const laneEnds = [];
  const placed = slots.map((s) => {
    const start = toMinutes(s.start);
    let lane = laneEnds.findIndex((end) => end <= start);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = start + Math.max(s.mins, 40);
    return { ...s, lane, startMin: start };
  });
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow = offset === 0 && nowMin >= from && nowMin <= to;
  const step = to - from > 13 * 60 ? 180 : 120;
  const ticks = Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
  const course = courseById(selected.course);
  const status = slotStatus(selected, now);

  return (
    <div>
      {/* Timeline on wider screens */}
      <div className="relative px-5 pt-7 pb-8 max-lg:hidden">
        <div className="relative" style={{ height: laneEnds.length * 64 - 8 }}>
          {ticks.map((t) => <span key={t} aria-hidden="true" className="absolute -top-1 -bottom-1 w-px bg-line" style={{ left: `${pct(t)}%` }} />)}
          {placed.map((s, i) => {
            const c = courseById(s.course);
            const st = slotStatus(s, now);
            const on = s.id === selected.id;
            return (
              <Tooltip key={s.id} label={`${s.title}, ${s.start}, ${duration(s.mins)}`}>
                <button onClick={() => setPicked(s.id)} aria-pressed={on} aria-label={`${c.title}: ${s.title}, ${s.start}, ${duration(s.mins)}`}
                  className={cn("hue ribbon-block press absolute flex h-14 min-w-11 flex-col justify-center overflow-hidden rounded-lg border px-2 text-left",
                    s.kind === "live" ? "border-transparent bg-(--c) text-white dark:text-[#08110e]" : "border-dashed border-(--c) bg-surface text-ink",
                    st === "past" && !on && "opacity-45", on && "z-10 ring-2 ring-ink ring-offset-2 ring-offset-surface")}
                  style={{ ...hueStyle(c), "--i": i, left: `${pct(s.startMin)}%`, width: `${Math.min((s.mins / (to - from)) * 100, 100 - pct(s.startMin))}%`, top: s.lane * 64 }}>
                  <span className="truncate text-[13px] leading-tight font-semibold">{c.code}</span>
                  <span className="truncate text-[11px] leading-tight opacity-85">{s.start}</span>
                </button>
              </Tooltip>
            );
          })}
          {showNow ? (
            <div className="pointer-events-none absolute -top-5 -bottom-2 z-20 w-0" style={{ left: `${pct(nowMin)}%` }}>
              <span className="absolute -top-1 -translate-x-1/2 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-primary-ink">Now {toClock(nowMin)}</span>
              <span className="absolute top-4 bottom-0 -ml-px w-0.5 rounded bg-primary" />
            </div>
          ) : null}
        </div>
        <div aria-hidden="true" className="relative mt-3 h-0">
          {ticks.map((t, i) => <span key={t} className={cn("absolute text-xs text-muted", i === 0 ? "" : i === ticks.length - 1 && pct(t) > 96 ? "-translate-x-full" : "-translate-x-1/2")} style={{ left: `${pct(t)}%` }}>{toClock(t)}</span>)}
        </div>
      </div>

      {/* List on narrow screens */}
      <ol className="flex flex-col gap-1 px-3 pb-2 lg:hidden">
        {slots.map((s) => {
          const c = courseById(s.course);
          const on = s.id === selected.id;
          return (
            <li key={s.id}>
              <button onClick={() => setPicked(s.id)} aria-pressed={on} className={cn("press flex min-h-14 w-full items-center gap-3 rounded-xl px-2 text-left", on ? "bg-sunken" : "hover:bg-sunken", slotStatus(s, now) === "past" && !on && "opacity-55")}>
                <span className="w-12 shrink-0 text-sm font-semibold">{s.start}</span>
                <span className="hue h-9 w-1 shrink-0 rounded-full bg-(--c)" style={hueStyle(c)} />
                <span className="min-w-0 flex-1"><span dir="auto" className="block truncate text-sm font-semibold">{s.title}</span><span className="block truncate text-xs text-muted">{c.title}, {s.kind === "live" ? "live class" : "study block"}</span></span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-5 py-4" aria-live="polite">
        <div className="min-w-0 flex-[1_1_260px]">
          <p className="flex items-center gap-2 text-[13px] text-muted"><CourseDot course={course} /><span className="truncate">{course.title}</span></p>
          <p dir="auto" className="mt-1 text-base font-semibold break-words">{selected.title}</p>
          <p className="text-[13px] text-muted">{selected.start} to {toClock(toMinutes(selected.start) + selected.mins)}, {selected.kind === "live" ? `with ${course.tutor}` : "self study"}</p>
        </div>
        <Badge tone={status === "open" ? "good" : "neutral"}>{status === "past" ? "Finished" : status === "open" ? "Open now" : "Upcoming"}</Badge>
        <SlotAction slot={selected} course={course} status={status} />
      </div>
    </div>
  );
}

export function CourseCard({ course }) {
  const s = courseStats(course);
  return (
    <button onClick={() => go(`courses/${course.id}`)} className="press group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left hover:border-line-strong hover:shadow-lg">
      <Photo course={course} className="aspect-[16/9] w-full" />
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="min-w-0">
          <span className="flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-muted"><CourseDot course={course} /><span className="truncate">{course.level}</span></span>{s.status === "completed" ? <Badge tone="good">Completed</Badge> : s.status === "new" ? <Badge>Not started</Badge> : null}</span>
          <span dir="auto" title={course.title} className="mt-2 line-clamp-2 text-[17px] leading-snug font-semibold tracking-[-0.012em] break-words">{course.title}</span>
          <span className="mt-1 line-clamp-1 text-[13px] text-muted">{course.sub || plural(s.total, "lesson")}</span>
        </span>
        <span className="mt-auto flex items-center gap-3"><Progress value={s.pct} label={`${course.title} progress`} /><span className="w-10 shrink-0 text-right text-[13px] font-semibold">{s.pct}%</span></span>
        <span className="flex min-w-0 items-center gap-2 border-t border-line pt-3 text-[13px] text-muted">
          <Avatar name={course.tutor} img={course.tutorImg} size={26} /><span dir="auto" title={course.tutor} className="truncate">{course.tutor}</span>
          <span className="ml-auto shrink-0">{s.done}/{s.total}</span>
        </span>
      </span>
    </button>
  );
}

export function CourseRow({ course }) {
  const s = courseStats(course);
  return (
    <button onClick={() => go(`courses/${course.id}`)} className="press group grid w-full grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-x-4 rounded-xl p-3 text-left hover:bg-sunken sm:grid-cols-[72px_minmax(0,1fr)_180px_auto]">
      <Photo course={course} className="aspect-[4/3] w-full rounded-lg" />
      <span className="min-w-0">
        <span dir="auto" title={course.title} className="block truncate font-semibold">{course.title}</span>
        <span className="block truncate text-[13px] text-muted">{s.next ? `Next: ${s.next.title}` : "All lessons complete"}</span>
      </span>
      <span className="flex items-center gap-3 max-sm:hidden"><Progress value={s.pct} course label={`${course.title} progress`} className="hue" /><span className="w-10 shrink-0 text-right text-[13px] font-semibold">{s.pct}%</span></span>
      <span className="flex items-center gap-1 text-muted"><span className="text-[13px] font-semibold text-ink sm:hidden">{s.pct}%</span><ChevronRight size={18} aria-hidden="true" /></span>
    </button>
  );
}

/** Single-series bar chart of study hours with a value on hover and focus. */
export function HoursChart({ data, goal }) {
  const total = data.reduce((sum, [, h]) => sum + h, 0);
  const max = Math.max(2, Math.ceil(Math.max(0, ...data.map(([, h]) => h)) / 2) * 2);
  const today = (new Date().getDay() + 6) % 7;
  const [active, setActive] = useState(null);
  const shown = active ?? today;
  return (
    <div className="px-5 pb-5">
      <p className="flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-semibold tracking-[-0.025em]">{total.toFixed(1)}</span><span className="text-sm text-muted">of {short(goal)} hours</span></p>
      <Progress value={goal ? (total / goal) * 100 : 0} label="Weekly study goal" className="mt-2" />
      <p className="mt-4 mb-2 text-[13px] text-muted" aria-live="polite">{data[shown][0]}: <span className="font-semibold text-ink">{data[shown][1]} h</span></p>
      <div className="flex h-28 items-end gap-2 border-b border-line" onPointerLeave={() => setActive(null)}>
        {data.map(([day, h], i) => (
          <button key={day} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(i)} aria-label={`${day}: ${h} hours`} className="flex h-full min-w-0 flex-1 items-end justify-center">
            <span className={cn("rise-bar w-full max-w-6 rounded-t-[4px] transition-colors", i === shown ? "bg-primary" : "bg-line-strong")} style={{ height: `${(h / max) * 100}%`, "--i": i }} />
          </button>
        ))}
      </div>
      <div aria-hidden="true" className="mt-1.5 flex gap-2">{data.map(([day], i) => <span key={day} className={cn("flex-1 text-center text-xs", i === today ? "font-semibold text-ink" : "text-muted")}>{day.slice(0, 1)}</span>)}</div>
    </div>
  );
}
