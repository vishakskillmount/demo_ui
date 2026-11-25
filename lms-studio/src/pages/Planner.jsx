import { useState } from "react";
import { ChevronLeft, ChevronRight, ClipboardCheck } from "lucide-react";
import { useStore } from "@/lib/store.jsx";
import { addDays, cn, dueLabel, fmtDay, num, plural } from "@/lib/utils.js";
import { Badge, Button, Card, CardHeader, CourseDot, Dialog, Empty, Segmented } from "@/components/ui/index.jsx";
import { DayRibbon } from "@/components/study.jsx";
import { PageHeader } from "./Courses.jsx";

export function Schedule() {
  const { agendaFor, courseById, now } = useStore();
  const [offset, setOffset] = useState(0);
  const weekday = (now.getDay() + 6) % 7;
  const weekStart = Math.floor((offset + weekday) / 7) * 7 - weekday;
  const days = Array.from({ length: 7 }, (_, i) => weekStart + i);
  const selected = addDays(offset);
  return (
    <>
      <PageHeader title="Schedule" description={`${fmtDay(addDays(days[0]), { day: "numeric", month: "long" })} to ${fmtDay(addDays(days[6]), { day: "numeric", month: "long", year: "numeric" })}`}
        action={<div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous week" onClick={() => setOffset(offset - 7)}><ChevronLeft size={18} /></Button><Button variant="outline" onClick={() => setOffset(0)} disabled={offset === 0}>Today</Button><Button variant="outline" size="icon" aria-label="Next week" onClick={() => setOffset(offset + 7)}><ChevronRight size={18} /></Button></div>} />
      <div role="group" aria-label="Choose a day" className="mb-6 grid grid-cols-7 gap-1.5 md:gap-3">
        {days.map((o) => {
          const d = addDays(o);
          const slots = agendaFor(o).filter((s) => courseById(s.course));
          return (
            <button key={o} onClick={() => setOffset(o)} aria-pressed={o === offset} aria-label={`${fmtDay(d, { weekday: "long", day: "numeric", month: "long" })}, ${plural(slots.length, "item")}`}
              className={cn("press flex min-w-0 flex-col items-center gap-1 rounded-xl border py-3", o === offset ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface hover:bg-sunken", o === 0 && o !== offset && "border-primary")}>
              <span className="text-xs font-semibold opacity-75">{fmtDay(d, { weekday: "short" })}</span>
              <span className="text-xl font-semibold">{d.getDate()}</span>
              <span className="flex h-1.5 gap-1">{slots.slice(0, 4).map((s) => <span key={s.id} className={cn("size-1.5 rounded-full", o === offset ? "bg-primary-ink" : "bg-muted")} />)}</span>
            </button>
          );
        })}
      </div>
      <Card><CardHeader title={offset === 0 ? "Today" : fmtDay(selected, { weekday: "long", day: "numeric", month: "long" })} description="Choose a block to see the details" /><DayRibbon offset={offset} /></Card>
    </>
  );
}

const TONE = { todo: "neutral", overdue: "bad", submitted: "warn", graded: "good" };
const LABEL = { todo: "To do", overdue: "Overdue", submitted: "Submitted", graded: "Graded" };

export function Assignments() {
  const { assignments, courseById, submitAssignment } = useStore();
  const [filter, setFilter] = useState("open");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const rows = assignments.filter((a) => courseById(a.course)).map((a) => ({ ...a, state: a.status === "todo" && a.due < 0 ? "overdue" : a.status }));
  const match = (a, f) => f === "all" || (f === "open" ? a.status === "todo" : a.status === f);
  const list = rows.filter((a) => match(a, filter)).sort((a, b) => (filter === "graded" || filter === "submitted" ? b.due - a.due : a.due - b.due));
  const size = 10;
  const pages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(page, pages);
  const shown = list.slice((current - 1) * size, current * size);
  const close = () => { setActive(null); setAnswer(""); setError(false); };
  const submit = (e) => { e.preventDefault(); if (!answer.trim()) return setError(true); submitAssignment(active.id); close(); };
  const count = (f) => rows.filter((a) => match(a, f)).length;
  return (
    <>
      <PageHeader title="Assignments" description={`${num(count("open"))} open, ${num(rows.filter((a) => a.state === "overdue").length)} overdue`} />
      <div className="mb-4"><Segmented label="Filter assignments" value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }} items={[["open", "Open", count("open")], ["submitted", "Submitted", count("submitted")], ["graded", "Graded", count("graded")], ["all", "All", count("all")]]} /></div>
      <Card className="overflow-hidden">
        {shown.length ? (
          <table className="w-full table-fixed text-left text-sm max-md:block">
            <thead className="border-b border-line text-xs text-muted max-md:sr-only"><tr><th className="px-5 py-3 font-semibold">Assignment</th><th className="w-40 px-3 py-3 font-semibold">Due</th><th className="w-32 px-3 py-3 font-semibold">Status</th><th className="w-32 px-5 py-3"><span className="sr-only">Action</span></th></tr></thead>
            <tbody className="max-md:block">
              {shown.map((a) => {
                const c = courseById(a.course);
                return (
                  <tr key={a.id} className="border-b border-line last:border-0 hover:bg-sunken/60 max-md:flex max-md:flex-wrap max-md:items-center max-md:gap-x-3 max-md:gap-y-2 max-md:p-4">
                    <td className="px-5 py-3 max-md:w-full max-md:min-w-0 max-md:basis-full max-md:p-0"><p dir="auto" title={a.title} className="line-clamp-2 font-semibold break-words [overflow-wrap:anywhere]">{a.title}</p><p className="mt-0.5 flex items-center gap-2 text-[13px] text-muted"><CourseDot course={c} /><span className="truncate">{c.title}</span></p></td>
                    <td className="px-3 py-3 text-muted max-md:order-3 max-md:p-0 max-md:text-[13px]">{dueLabel(a.due)}</td>
                    <td className="px-3 py-3 max-md:order-2 max-md:p-0"><Badge tone={TONE[a.state]}>{LABEL[a.state]}</Badge></td>
                    <td className="px-5 py-3 text-right max-md:order-4 max-md:ml-auto max-md:p-0">{a.status === "todo" ? <Button size="sm" variant="outline" onClick={() => setActive(a)}>Submit</Button> : a.status === "graded" ? <span className="font-semibold">{a.score}%</span> : <span className="text-[13px] text-muted">In review</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty icon={ClipboardCheck} title={rows.length ? "Nothing in this view" : "No assignments yet"} body={rows.length ? "Choose another filter." : "Work set by your tutors appears here."} />}
        {list.length > size ? (
          <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
            <p className="text-[13px] text-muted">{num((current - 1) * size + 1)} to {num(Math.min(current * size, list.length))} of {num(list.length)}</p>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button><span className="text-[13px]">Page {num(current)} of {num(pages)}</span><Button variant="outline" size="sm" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</Button></div>
          </nav>
        ) : null}
      </Card>
      <Dialog open={Boolean(active)} onOpenChange={(v) => !v && close()} title="Submit assignment" description={active?.title}>
        <form onSubmit={submit} noValidate>
          <label htmlFor="answer" className="text-sm font-semibold">Your answer or a link to your work</label>
          <textarea id="answer" value={answer} onChange={(e) => { setAnswer(e.target.value); setError(false); }} maxLength={2000} aria-invalid={error} aria-describedby={error ? "answer-error" : undefined} className="mt-1.5 min-h-32 w-full resize-y rounded-[10px] border border-line-strong bg-surface p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 aria-invalid:border-bad" />
          {error ? <p id="answer-error" role="alert" className="mt-1 text-[13px] text-bad">Add your answer or a link before submitting.</p> : null}
          <div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={close}>Cancel</Button><Button type="submit">Submit</Button></div>
        </form>
      </Dialog>
    </>
  );
}
