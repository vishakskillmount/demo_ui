// Dashboard and page widgets shared across screens.
import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Play, Star, Video } from "lucide-react";
import { classes } from "../data/mock.js";
import { go } from "../state/router.js";
import { courseStats, useStore } from "../state/store.jsx";
import CourseArt from "./CourseArt.jsx";
import { Avatar, Bar, DAYS, MONTHS, Segmented, plural, sameDay } from "./ui.jsx";

export function CourseCard({ course, index = 0 }) {
  const s = courseStats(course);
  const label = s.status === "completed" ? "Completed" : s.status === "new" ? "Not started" : `${s.pct}% done`;
  return (
    <button className="course-card press rise" style={{ "--i": index }} onClick={() => go(`courses/${course.id}`)}>
      <span className="course-art">
        <CourseArt course={course} />
        <span className="art-tag">{label}</span>
      </span>
      <span className="course-body">
        <span className="min0"><b className="course-title">{course.title}</b><span className="muted small clamp1">{course.sub}</span></span>
        <span className="meta">
          <span>{plural(s.total, "lesson", "lessons")}</span><span>{course.level}</span>
          <span><Star size={13} aria-hidden="true" /> {course.rating}</span>
        </span>
        <Bar value={s.pct} tone={course.tone} />
        <span className="course-foot"><Avatar name={course.tutor} img={course.face} size={28} /><span className="muted small trunc">{course.tutor}</span></span>
      </span>
    </button>
  );
}

/** Dot-capped bar chart. Values show on hover and keyboard focus, and the selected day is labelled. */
export function HoursChart({ data }) {
  const max = Math.max(...data.map((d) => d.h), 1);
  const todayIndex = data.length === 7 ? (new Date().getDay() + 6) % 7 : data.length - 1;
  const [active, setActive] = useState(null);
  const shown = active ?? todayIndex;
  return (
    <div className="chart" role="group" aria-label="Hours studied">
      {data.map((d, i) => (
        <button key={d.d} className={`chart-col ${i === shown ? "on" : ""}`} onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} aria-label={`${d.d}: ${d.h} hours`}>
          <span className="chart-track">
            <span className="chart-bar" style={{ "--h": d.h / max, "--i": i }} />
            <span className="chart-tip" style={{ bottom: `calc(${(d.h / max) * 100}% + 10px)` }}>{d.h}h</span>
          </span>
          <span className="chart-dot" />
          <span className="chart-label">{d.d}</span>
        </button>
      ))}
    </div>
  );
}

export function Countdown() {
  const { countdown, notify } = useStore();
  const next = classes.find((c) => c.state === "soon");
  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");
  const ticks = 48;
  const lit = Math.round((countdown / 3600) * ticks);
  return (
    <div className="countdown">
      <div className="dial" role="timer" aria-label={`Next class starts in ${Math.floor(countdown / 60)} minutes`}>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {Array.from({ length: ticks }, (_, i) => (
            <line key={i} x1="100" y1="10" x2="100" y2={i < lit ? 28 : 21} transform={`rotate(${(360 / ticks) * i} 100 100)`} className={i < lit ? "tick on" : "tick"} />
          ))}
        </svg>
        <div className="dial-center"><b>{mm}:{ss}</b><small>until class</small></div>
      </div>
      <div className="countdown-meta">
        <b className="clamp1">{next.title}</b>
        <span className="muted small">{next.start}, {next.mins} minutes</span>
      </div>
      <button className="btn light block press" onClick={() => notify("Opening the live class room")}><Video size={17} aria-hidden="true" /> Open class</button>
    </div>
  );
}

export function MonthCalendar({ selected, onSelect }) {
  const [view, setView] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const lead = (view.getDay() + 6) % 7;
  const length = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const today = new Date();
  const shift = (by) => setView(new Date(view.getFullYear(), view.getMonth() + by, 1));
  return (
    <div className="calendar">
      <div className="calendar-head">
        <button className="icon-btn press" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button>
        <b aria-live="polite">{MONTHS[view.getMonth()]} {view.getFullYear()}</b>
        <button className="icon-btn press" onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={18} /></button>
      </div>
      <div className="calendar-grid">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d} className="dow">{d}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`x${i}`} />)}
        {Array.from({ length }, (_, i) => {
          const date = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const has = classes.some((c) => sameDay(c.date, date));
          return (
            <button key={i} className={`cal-day ${sameDay(date, today) ? "today" : ""}`} aria-pressed={sameDay(date, selected)}
              aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]}${has ? ", has classes" : ""}`} onClick={() => onSelect(date)}>
              {i + 1}{has ? <i /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Agenda({ date }) {
  const { courses, notify } = useStore();
  const list = classes.filter((c) => sameDay(c.date, date)).sort((a, b) => a.start.localeCompare(b.start));
  return (
    <div className="agenda">
      <b className="agenda-title">{DAYS[date.getDay()]}, {date.getDate()} {MONTHS[date.getMonth()]}</b>
      {list.length ? list.map((k) => {
        const course = courses.find((c) => c.id === k.course);
        return (
          <button key={k.id} className={`event press ${k.state === "soon" ? `solid fill-${course.tone}` : ""}`}
            onClick={() => notify(k.state === "locked" ? "This class opens 15 minutes before it starts" : k.state === "soon" ? "Opening the live class room" : "Opening the recording")}>
            <span className={`event-icon ${k.state === "soon" ? "" : `text-${course.tone}`}`}>{k.state === "locked" ? <Lock size={17} /> : k.state === "soon" ? <Video size={17} /> : <Play size={17} />}</span>
            <span className="min0"><b className="clamp1">{k.title}</b><small>{k.start} · {course.title}</small></span>
          </button>
        );
      }) : <p className="muted small">No classes on this day.</p>}
    </div>
  );
}

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

/** Week timeline: classes placed by start time and length. */
export function WeekGrid() {
  const { courses, notify } = useStore();
  const [offset, setOffset] = useState("this");
  const monday = new Date(); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + (offset === "next" ? 7 : offset === "last" ? -7 : 0));
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  const today = new Date();
  return (
    <>
      <Segmented label="Week" value={offset} onChange={setOffset} options={[["last", "Last week"], ["this", "This week"], ["next", "Next week"]]} />
      <div className="week-scroll">
        <div className="week" style={{ "--rows": HOURS.length }}>
          <span />
          {days.map((d) => <span key={d.toISOString()} className={`week-day ${sameDay(d, today) ? "today" : ""}`}><small>{DAYS[d.getDay()]}</small><b>{d.getDate()}</b></span>)}
          <div className="week-hours">{HOURS.map((h) => <span key={h}>{String(h).padStart(2, "0")}:00</span>)}</div>
          {days.map((d) => (
            <div key={d.toISOString()} className="week-col">
              {classes.filter((c) => sameDay(c.date, d)).map((k) => {
                const [h, m] = k.start.split(":").map(Number);
                const course = courses.find((c) => c.id === k.course);
                return (
                  <button key={k.id} className={`block-event press fill-${course.tone} ${k.state === "done" || k.state === "missed" ? "past" : ""}`}
                    style={{ top: `calc(var(--row) * ${h - HOURS[0] + m / 60})`, height: `max(44px, calc(var(--row) * ${k.mins / 60}))` }}
                    onClick={() => notify(`${k.title}, ${k.start}`)} title={`${k.title}, ${k.start}`}>
                    <b>{course.title}</b><small>{k.start}</small>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
