import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, FileText, Lock, Play } from "lucide-react";
import { go, courseStats, lessonState, useStore } from "@/lib/store.jsx";
import { cn, duration } from "@/lib/utils.js";
import { Avatar, Button, Card, CardHeader, Dialog, Empty, Photo, Progress, TabPanel, Tabs } from "@/components/ui/index.jsx";

function Quiz({ open, onOpenChange, onPass }) {
  const { quiz } = useStore();
  const [pick, setPick] = useState(null);
  const [result, setResult] = useState(null);
  const check = () => {
    if (pick !== quiz.answer) return setResult("wrong");
    setResult("right");
    setTimeout(() => { onPass(); onOpenChange(false); }, 650);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setPick(null); setResult(null); } }} title="Check your understanding" description="Answer correctly to complete this lesson. You can retry.">
      <fieldset>
        <legend className="mb-3 font-semibold">{quiz.question}</legend>
        <div className="grid gap-2">
          {quiz.options.map((o, i) => (
            <label key={o} className={cn("press flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium has-focus-visible:outline-2 has-focus-visible:outline-primary",
              pick !== i ? "border-line hover:bg-sunken" : result === "wrong" ? "border-bad bg-bad-tint" : "border-primary bg-tint")}>
              <input type="radio" name="quiz" checked={pick === i} onChange={() => { setPick(i); setResult(null); }} className="size-4 shrink-0 accent-(--primary)" />{o}
            </label>
          ))}
        </div>
      </fieldset>
      <p role="status" className={cn("mt-3 min-h-5 text-sm font-semibold", result === "wrong" ? "text-bad" : "text-primary")}>{result === "wrong" ? "Not quite. Choose another answer." : result === "right" ? "Correct." : ""}</p>
      <Button className="mt-2 w-full" disabled={pick === null || result === "right"} onClick={check}>Check answer</Button>
    </Dialog>
  );
}

export default function Lesson({ courseId, lessonId }) {
  const { courseById, completeLesson, notify } = useStore();
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState("about");
  const [quizOpen, setQuizOpen] = useState(false);
  const [note, setNote] = useState("");
  const course = courseById(courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);
  if (!lesson || lessonState(course, lesson) === "locked") {
    return <Card><Empty icon={Lock} title="This lesson is not available yet" body="Complete the earlier lessons to unlock it." action={<Button variant="outline" onClick={() => go(course ? `courses/${course.id}` : "courses")}>Back to the syllabus</Button>} /></Card>;
  }
  const s = courseStats(course);
  const previous = course.lessons[lesson.n - 2];
  const following = course.lessons[lesson.n];
  return (
    <>
      <Button variant="ghost" size="sm" className="mb-3 -ml-3 max-w-full" onClick={() => go(`courses/${course.id}`)}><ArrowLeft size={16} className="shrink-0" aria-hidden="true" /><span className="truncate">{course.title}</span></Button>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="group relative aspect-video overflow-hidden rounded-2xl bg-black">
            {playing ? <iframe className="absolute inset-0 size-full" src={`https://www.youtube-nocookie.com/embed/${course.video}?autoplay=1&rel=0`} title={`Video for ${lesson.title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : (
              <button onClick={() => setPlaying(true)} aria-label={`Play video for ${lesson.title}`} className="absolute inset-0">
                <Photo course={course} className="absolute inset-0" />
                <span className="absolute inset-0 bg-black/30" />
                <span className="absolute inset-0 grid place-items-center"><span className="grid size-20 place-items-center rounded-full bg-white/95 text-[#0d1512] shadow-2xl transition-transform duration-200 ease-out-strong group-hover:scale-105 group-active:scale-95"><Play size={30} className="ml-1 fill-current" aria-hidden="true" /></span></span>
              </button>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-[1_1_300px]">
              <h1 dir="auto" className="text-2xl leading-snug font-semibold tracking-[-0.022em] break-words md:text-[28px]">{lesson.title}</h1>
              <div className="mt-2 flex items-center gap-2.5 text-sm text-muted"><Avatar name={course.tutor} img={course.tutorImg} size={30} /><span className="min-w-0 break-words">{course.tutor}, {duration(lesson.mins)}</span></div>
            </div>
            <Button variant={lesson.done ? "outline" : "primary"} disabled={lesson.done} onClick={() => setQuizOpen(true)}><Check size={17} aria-hidden="true" />{lesson.done ? "Completed" : "Mark complete"}</Button>
          </div>
          <Tabs value={tab} onValueChange={setTab} items={[["about", "About"], ["notes", "Notes"], ["files", "Resources"]]} className="mt-5">
            <TabPanel value="about"><p className="max-w-[65ch] text-muted">{course.tutor} builds the idea step by step and then works two exam-style problems. Watch to the end and answer one question to complete the lesson.</p></TabPanel>
            <TabPanel value="notes">
              <form onSubmit={(e) => { e.preventDefault(); notify("Note saved"); }}>
                <label htmlFor="note" className="text-sm font-semibold">Note for this lesson</label>
                <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder="What do you want to remember?" className="mt-1.5 mb-3 min-h-32 w-full resize-y rounded-[10px] border border-line-strong bg-surface p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" />
                <Button type="submit" variant="outline" disabled={!note.trim()}>Save note</Button>
              </form>
            </TabPanel>
            <TabPanel value="files"><ul className="grid gap-2">{["Lesson slides", `Worksheet ${lesson.n}`].map((f) => <li key={f} className="flex items-center gap-3 rounded-xl border border-line bg-surface py-2 pr-2 pl-4"><FileText size={18} className="shrink-0 text-muted" aria-hidden="true" /><span className="min-w-0 flex-1 truncate text-sm font-semibold">{f}</span><Button variant="ghost" size="sm" onClick={() => notify(`${f} download started`)}><Download size={16} aria-hidden="true" />PDF</Button></li>)}</ul></TabPanel>
          </Tabs>
          <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-line pt-5">
            <Button variant="outline" disabled={!previous} onClick={() => go(`lesson/${course.id}/${previous.id}`)}><ArrowLeft size={16} aria-hidden="true" />Previous</Button>
            {following ? <Button variant="outline" onClick={() => (lesson.done ? go(`lesson/${course.id}/${following.id}`) : notify("Complete this lesson to unlock the next one"))}>Next lesson<ArrowRight size={16} aria-hidden="true" /></Button> : null}
          </div>
        </div>
        <Card>
          <CardHeader title="In this course" description={`${s.done} of ${s.total} complete`} />
          <div className="px-5 pb-3"><Progress value={s.pct} label="Course progress" /></div>
          <ol className="max-h-[520px] overflow-y-auto px-2 pb-2">
            {course.lessons.map((l) => {
              const state = lessonState(course, l);
              const on = l.id === lesson.id;
              return (
                <li key={l.id}>
                  <button aria-current={on ? "true" : undefined} aria-disabled={state === "locked"} onClick={() => (state === "locked" ? notify("Complete the previous lesson to unlock this one") : go(`lesson/${course.id}/${l.id}`))}
                    className={cn("press flex w-full items-center gap-3 rounded-xl p-2.5 text-left", on ? "bg-tint text-tint-ink" : state === "locked" ? "cursor-not-allowed text-muted" : "hover:bg-sunken")}>
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold", state === "done" ? "bg-primary text-primary-ink" : "bg-sunken text-ink")}>{state === "done" ? <Check size={15} strokeWidth={2.6} aria-label="Done" /> : state === "locked" ? <Lock size={13} aria-label="Locked" /> : l.n}</span>
                    <span className="min-w-0 flex-1"><span dir="auto" className="line-clamp-2 text-sm leading-snug font-semibold break-words">{l.title}</span><span className="block text-xs opacity-75">{duration(l.mins)}</span></span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
      <Quiz open={quizOpen} onOpenChange={setQuizOpen} onPass={() => completeLesson(course.id, lesson.id)} />
    </>
  );
}
