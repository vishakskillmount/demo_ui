import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Bell, BookOpen, CalendarDays, Flame, House, ListChecks, Search, Trophy, UserRound, Video } from "lucide-react";
import { classes, student } from "../data/mock.js";
import { go } from "../state/router.js";
import { lessonState, useStore } from "../state/store.jsx";
import { Avatar, SPRING } from "./ui.jsx";

export const NAV = [
  { group: "Learn", items: [["dashboard", "Dashboard", House], ["courses", "My courses", BookOpen], ["schedule", "Schedule", CalendarDays], ["tasks", "Tasks", ListChecks]] },
  { group: "You", items: [["rank", "Leaderboard", Trophy], ["profile", "Profile", UserRound]] },
];
const ALL = NAV.flatMap((g) => g.items);
const activeKey = (route) => (route[0] === "learn" ? "courses" : route[0]);

export function Sidebar({ route }) {
  const { tasks, setOverlay } = useStore();
  const current = activeKey(route);
  const open = tasks.filter((t) => t.col !== "done").length;
  return (
    <aside className="sidebar">
      <a className="logo" href="#/dashboard"><img src="./logo-white.png" alt="Skillmount, go to dashboard" width="108" height="38" /></a>
      <nav aria-label="Primary">
        {NAV.map((g) => (
          <div className="nav-group" key={g.group}>
            <span className="nav-title">{g.group}</span>
            {g.items.map(([key, label, Icon]) => (
              <a key={key} href={`#/${key}`} className="nav-item" aria-current={current === key ? "page" : undefined} title={label}>
                {current === key ? <motion.span layoutId="nav-pill" className="nav-pill" transition={SPRING} /> : null}
                <Icon size={19} aria-hidden="true" />
                <span className="nav-label">{label}</span>
                {key === "tasks" && open ? <span className="nav-count">{open}</span> : null}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <button className="streak-chip press" onClick={() => setOverlay({ type: "streak" })} aria-label={`${student.streak} day streak, view details`}>
        <span className="streak-icon"><Flame size={20} aria-hidden="true" /></span>
        <span className="nav-label"><b>{student.streak} day streak</b><small>Study today to keep it</small></span>
      </button>
    </aside>
  );
}

export function TabBar({ route }) {
  const current = activeKey(route);
  return (
    <nav className="tabbar" aria-label="Primary mobile">
      {ALL.filter(([k]) => k !== "profile").map(([key, label, Icon]) => (
        <a key={key} href={`#/${key}`} aria-current={current === key ? "page" : undefined}>
          <Icon size={19} aria-hidden="true" /><span>{key === "courses" ? "Courses" : key === "rank" ? "Rank" : label}</span>
        </a>
      ))}
    </nav>
  );
}

function GlobalSearch() {
  const { courses } = useStore();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [cursor, setCursor] = useState(0);
  const input = useRef(null);
  useEffect(() => {
    const clear = () => setQ("");
    window.addEventListener("hashchange", clear);
    return () => window.removeEventListener("hashchange", clear);
  }, []);
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out = [];
    courses.forEach((c) => {
      if (`${c.title} ${c.sub} ${c.tutor}`.toLowerCase().includes(term)) out.push({ key: c.id, label: c.title, meta: "Course", to: `courses/${c.id}`, icon: BookOpen });
      c.lessons.forEach((l) => { if (l.title.toLowerCase().includes(term)) out.push({ key: l.id, label: l.title, meta: `${c.title} lesson`, to: lessonState(c, l) === "locked" ? `courses/${c.id}` : `learn/${c.id}/${l.id}`, icon: Video }); });
    });
    classes.forEach((k) => { if (k.title.toLowerCase().includes(term)) out.push({ key: k.id, label: k.title, meta: "Class", to: "schedule", icon: CalendarDays }); });
    return out.slice(0, 7);
  }, [q, courses]);

  const pick = (r) => { go(r.to); setQ(""); input.current?.blur(); };
  const show = focus && q.trim().length > 0;

  return (
    <div className="search">
      <Search size={18} aria-hidden="true" />
      <input ref={input} value={q} type="search" placeholder="Search courses, lessons, classes" aria-label="Search courses, lessons and classes"
        role="combobox" aria-expanded={show} aria-controls="search-results"
        onChange={(e) => { setQ(e.target.value); setCursor(0); }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setCursor((i) => Math.min(i + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setCursor((i) => Math.max(i - 1, 0)); }
          if (e.key === "Enter" && results[cursor]) pick(results[cursor]);
          if (e.key === "Escape") { setQ(""); input.current.blur(); }
        }} />
      {show ? (
        <ul className="search-results" id="search-results" role="listbox">
          {results.length ? results.map((r, i) => (
            <li key={r.key} role="option" aria-selected={i === cursor}>
              <button onPointerDown={(e) => e.preventDefault()} onClick={() => pick(r)} onPointerEnter={() => setCursor(i)}>
                <r.icon size={17} aria-hidden="true" /><span className="trunc">{r.label}</span><small>{r.meta}</small>
              </button>
            </li>
          )) : <li className="search-none">Nothing matches “{q}”. Try a course or lesson name.</li>}
        </ul>
      ) : null}
    </div>
  );
}

export function Topbar() {
  const { notices, setOverlay, notify } = useStore();
  const unread = notices.filter((n) => n.unread).length;
  return (
    <header className="topbar">
      <a className="topbar-logo" href="#/dashboard"><img src="./logo-white.png" alt="Skillmount" width="86" height="30" /></a>
      <GlobalSearch />
      <button className="btn primary press join" onClick={() => notify("Joining the live class room")}><Video size={18} aria-hidden="true" /> Join live class</button>
      <button className="icon-btn big press" onClick={() => setOverlay({ type: "notices" })} aria-label={`Notifications, ${unread} unread`}>
        <Bell size={19} />{unread ? <span className="dot" /> : null}
      </button>
      <a className="me press" href="#/profile" aria-label="Your profile">
        <Avatar name={student.name} img={47} size={40} />
        <span className="me-text"><b>{student.name}</b><small>{student.grade}</small></span>
      </a>
    </header>
  );
}
