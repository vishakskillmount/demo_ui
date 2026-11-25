import { useEffect, useMemo, useState } from "react";
import { Dialog as D } from "radix-ui";
import { Bell, BookOpen, CalendarDays, CircleCheck, ClipboardList, Moon, Search, Sun, Trophy, UserRound, LayoutDashboard, CornerDownLeft, PlayCircle } from "lucide-react";
import { go, lessonState, scenario, useStore } from "@/lib/store.jsx";
import { SCENARIOS } from "@/data/scenarios.js";
import { cn } from "@/lib/utils.js";
import { Avatar, Button, Empty, Popover, Tooltip } from "./ui/index.jsx";

export const NAV = [["today", "Today", LayoutDashboard], ["courses", "Courses", BookOpen], ["schedule", "Schedule", CalendarDays], ["assignments", "Assignments", ClipboardList], ["leaderboard", "Leaderboard", Trophy], ["profile", "Profile", UserRound]];
const current = (route) => (route[0] === "lesson" ? "courses" : route[0]);

/** Full logo: navy wordmark in light mode, white wordmark in dark mode. */
const Wordmark = ({ className }) => (
  <>
    <img src="./logo-light.png" alt="" width="137" height="40" className={cn("block w-auto max-w-none dark:hidden", className)} />
    <img src="./logo-dark.png" alt="" width="137" height="40" className={cn("hidden w-auto max-w-none dark:block", className)} />
  </>
);

/** `compact` shows the mark alone below the xl breakpoint, where the sidebar has no room for the wordmark. */
const Logo = ({ compact = false, className }) => (
  <a href="#/today" aria-label="Skillmount, go to Today" className={cn("press inline-flex h-11 shrink-0 items-center rounded-[10px]", className)}>
    {compact ? (
      <>
        <img src="./logo-icon.png" alt="" width="36" height="34" className="h-9 w-9 object-contain xl:hidden" />
        <span className="max-xl:hidden"><Wordmark className="h-10" /></span>
      </>
    ) : <Wordmark className="h-8" />}
  </a>
);

export function Sidebar({ route }) {
  const { assignments, student } = useStore();
  const open = assignments.filter((a) => a.status === "todo").length;
  const active = current(route);
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-line bg-surface px-3 py-4 md:flex xl:px-4">
      <Logo compact className="self-center xl:self-start xl:px-2" />
      <nav aria-label="Primary" className="flex flex-col gap-1">
        {NAV.map(([key, label, Icon]) => (
          <a key={key} href={`#/${key}`} title={label} aria-current={active === key ? "page" : undefined}
            className="press relative flex h-11 items-center gap-3 rounded-[10px] px-3 text-sm font-semibold text-muted hover:bg-sunken hover:text-ink aria-[current=page]:bg-tint aria-[current=page]:text-tint-ink max-xl:w-11 max-xl:justify-center max-xl:px-0">
            <Icon size={19} aria-hidden="true" />
            <span className="max-xl:sr-only">{label}</span>
            {key === "assignments" && open ? <span className="ml-auto rounded-md bg-sunken px-1.5 text-xs text-ink max-xl:absolute max-xl:-top-1 max-xl:-right-1">{open > 99 ? "99+" : open}</span> : null}
          </a>
        ))}
      </nav>
      <a href="#/profile" className="press mt-auto flex items-center gap-3 rounded-xl border border-line p-2 hover:bg-sunken max-xl:justify-center max-xl:border-0 max-xl:p-0">
        <Avatar name={student.name} img={student.img} size={40} />
        <span className="min-w-0 max-xl:sr-only">
          <span dir="auto" title={student.name} className="block truncate text-sm font-semibold">{student.name}</span>
          <span title={student.grade} className="block truncate text-xs text-muted">{student.grade}</span>
        </span>
      </a>
    </aside>
  );
}

export function MobileNav({ route }) {
  const active = current(route);
  return (
    <nav aria-label="Primary mobile" className="glass fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-surface/90 px-1 pt-1 pb-[max(4px,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      {NAV.filter(([k]) => k !== "profile").map(([key, label, Icon]) => (
        <a key={key} href={`#/${key}`} aria-current={active === key ? "page" : undefined} className="press flex h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold text-muted aria-[current=page]:bg-tint aria-[current=page]:text-tint-ink">
          <Icon size={19} aria-hidden="true" /><span className="max-w-full truncate px-0.5">{key === "assignments" ? "Tasks" : key === "leaderboard" ? "Rank" : label}</span>
        </a>
      ))}
    </nav>
  );
}

/** Ctrl/Cmd+K. Opened from the keyboard many times a day, so it appears instantly with no animation. */
function CommandMenu({ open, onOpenChange }) {
  const { courses } = useStore();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    const pages = NAV.map(([key, label, Icon]) => ({ id: key, label, hint: "Page", to: key, Icon }));
    if (!term) return pages;
    const out = pages.filter((p) => p.label.toLowerCase().includes(term));
    for (const c of courses) {
      if (`${c.title} ${c.sub} ${c.tutor}`.toLowerCase().includes(term)) out.push({ id: c.id, label: c.title, hint: "Course", to: `courses/${c.id}`, Icon: BookOpen });
      for (const l of c.lessons) if (l.title.toLowerCase().includes(term)) out.push({ id: l.id, label: l.title, hint: c.code, to: lessonState(c, l) === "locked" ? `courses/${c.id}` : `lesson/${c.id}/${l.id}`, Icon: PlayCircle });
      if (out.length > 30) break;
    }
    return out.slice(0, 8);
  }, [q, courses]);
  useEffect(() => { if (!open) { setQ(""); setCursor(0); } }, [open]);
  const pick = (item) => { onOpenChange(false); go(item.to); };
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-black/45" />
        <D.Content className="fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl outline-none">
          <D.Title className="sr-only">Search</D.Title>
          <D.Description className="sr-only">Search pages, courses and lessons</D.Description>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <input autoFocus value={q} role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={items[cursor] ? `cmd-${items[cursor].id}` : undefined} aria-label="Search pages, courses and lessons" placeholder="Search pages, courses and lessons" className="h-14 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
              onChange={(e) => { setQ(e.target.value); setCursor(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setCursor((i) => Math.min(i + 1, items.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setCursor((i) => Math.max(i - 1, 0)); }
                if (e.key === "Enter" && items[cursor]) pick(items[cursor]);
              }} />
            <kbd className="rounded-md border border-line px-1.5 text-xs text-muted">Esc</kbd>
          </div>
          <ul id="cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
            {items.map((item, i) => (
              <li key={item.id} id={`cmd-${item.id}`} role="option" aria-selected={i === cursor}>
                <button tabIndex={-1} onClick={() => pick(item)} onPointerMove={() => setCursor(i)} className={cn("flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm", i === cursor && "bg-sunken")}>
                  <item.Icon size={17} className="shrink-0 text-muted" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                  <span className="max-w-[35%] shrink-0 truncate text-xs text-muted">{item.hint}</span>
                  <CornerDownLeft size={14} className={cn("shrink-0 text-muted", i !== cursor && "invisible")} aria-hidden="true" />
                </button>
              </li>
            ))}
            {!items.length ? <li><Empty title="No matches" body={`Nothing matches “${q}”. Try a course or lesson name.`} /></li> : null}
          </ul>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

export function Topbar() {
  const { notices, readNotice, theme, setTheme } = useStore();
  const [search, setSearch] = useState(false);
  const unread = notices.filter((n) => n.unread).length;
  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch((v) => !v); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const dark = typeof document !== "undefined" && (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches));
  return (
    <header className="glass sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-2 px-4 md:px-8">
        <Logo className="md:hidden" />
        <button onClick={() => setSearch(true)} aria-label="Search" className="press flex h-11 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3 text-sm text-muted hover:bg-sunken max-md:ml-auto max-md:w-11 max-md:justify-center max-md:px-0 md:w-[min(360px,100%)]">
          <Search size={17} aria-hidden="true" />
          <span className="max-md:hidden">Search courses and lessons</span>
          <kbd className="ml-auto rounded-md border border-line px-1.5 text-xs max-md:hidden">Ctrl K</kbd>
        </button>
        <div className="flex items-center gap-1 md:ml-auto">
          <Tooltip label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            <Button variant="ghost" size="icon" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun size={19} /> : <Moon size={19} />}</Button>
          </Tooltip>
          <Popover trigger={<Button variant="ghost" size="icon" aria-label={`Notifications, ${unread} unread`} className="relative"><Bell size={19} />{unread ? <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary ring-2 ring-bg" /> : null}</Button>}>
            <div className="flex items-center justify-between gap-2 px-3 pt-1 pb-2">
              <h2 className="font-semibold">Notifications</h2>
              <Button variant="link" size="link" disabled={!unread} onClick={() => readNotice()}>Mark all as read</Button>
            </div>
            {notices.length ? (
              <ul className="max-h-[60vh] overflow-y-auto">
                {notices.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => readNotice(n.id)} className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-sunken">
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} aria-label={n.unread ? "Unread" : "Read"} />
                      <span className="min-w-0 flex-1"><span className="line-clamp-2 text-sm font-semibold break-words">{n.title}</span><span className="line-clamp-2 text-[13px] text-muted">{n.body}</span></span>
                      <span className="shrink-0 text-xs whitespace-nowrap text-muted">{n.ago}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <Empty icon={CircleCheck} title="You are all caught up" body="Class reminders and results appear here." />}
          </Popover>
        </div>
      </div>
      <CommandMenu open={search} onOpenChange={setSearch} />
    </header>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 md:bottom-6">
      {toast ? <div key={toast.key} className="toast flex max-w-full items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-bg shadow-xl"><CircleCheck size={18} className="shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{toast.message}</span></div> : null}
    </div>
  );
}

/** Development-only data switch for stress testing. Not included in production builds. */
export function ScenarioSwitch() {
  const labels = { demo: "Demo data", worst: "Worst case", empty: "Empty", one: "One", many: "1,000+ rows" };
  const set = (k) => { const u = new URL(window.location.href); if (k === "demo") u.searchParams.delete("data"); else u.searchParams.set("data", k); window.location.assign(u.toString()); };
  return (
    <div role="group" aria-label="Test data" className="fixed bottom-20 left-1/2 z-40 flex max-w-[calc(100vw-16px)] -translate-x-1/2 gap-0.5 overflow-x-auto rounded-lg bg-neutral-200 p-0.5 font-[system-ui] text-xs shadow-lg md:bottom-3">
      {Object.keys(SCENARIOS).map((k) => <button key={k} onClick={() => set(k)} aria-pressed={scenario === k} className="h-7 rounded-md px-2.5 whitespace-nowrap text-neutral-600 aria-pressed:bg-white aria-pressed:text-neutral-900">{labels[k]}</button>)}
    </div>
  );
}
