import { useState } from "react";
import { Award, GraduationCap, Mail, MapPin, Minus, Trash2, TrendingDown, TrendingUp, Trophy, CalendarDays } from "lucide-react";
import { courseStats, useStore } from "@/lib/store.jsx";
import { cn, num, ordinal, plural, short } from "@/lib/utils.js";
import { Avatar, Badge, Button, Card, CardHeader, Dialog, Empty, Progress, Segmented, Switch } from "@/components/ui/index.jsx";
import { PageHeader } from "./Courses.jsx";

export function Leaderboard() {
  const { board, student } = useStore();
  const [period, setPeriod] = useState("week");
  const [limit, setLimit] = useState(20);
  const rows = board[period];
  const mine = rows.findIndex((r) => r[0] === student.name);
  const visible = rows.slice(0, limit).map((r, i) => ({ r, i }));
  if (mine >= limit) visible.push({ r: rows[mine], i: mine });
  const lead = rows[0]?.[1] || 1;
  return (
    <>
      <PageHeader title="Leaderboard" description={mine >= 0 ? `You are ${ordinal(mine + 1)} of ${plural(rows.length, "student")}` : "Finish lessons to earn XP and join the board"}
        action={<Segmented label="Period" value={period} onValueChange={(v) => { setPeriod(v); setLimit(20); }} items={[["week", "This week"], ["month", "This month"], ["all", "All time"]]} />} />
      {rows.length ? (
        <>
          <ol className="mb-6 grid gap-4 sm:grid-cols-3">
            {rows.slice(0, 3).map(([name, xp, img], i) => (
              <li key={`${name}-${i}`} className={cn("flex min-w-0 items-center gap-4 rounded-2xl border p-5", i === 0 ? "border-primary bg-tint text-tint-ink" : "border-line bg-surface")}>
                <Avatar name={name} img={img} size={i === 0 ? 60 : 52} />
                <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold opacity-75">{ordinal(i + 1)} place</p><p dir="auto" title={name} className="line-clamp-2 font-semibold break-words">{name}</p><p className="text-sm">{num(xp)} XP</p></div>
                {i === 0 ? <Trophy size={22} className="shrink-0" aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
          <Card className="p-2">
            <ol>
              {visible.map(({ r: [name, xp, img, trend], i }) => (
                <li key={`${name}-${i}`} className={cn("grid grid-cols-[40px_40px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2.5 sm:grid-cols-[44px_40px_minmax(0,1fr)_160px_64px_110px]", i === mine ? "bg-tint text-tint-ink" : "hover:bg-sunken", i === mine && mine >= limit && "mt-2 border-t border-line")}>
                  <span className="text-center text-sm font-semibold">{num(i + 1)}</span><Avatar name={name} img={img} size={36} />
                  <span className="flex min-w-0 items-center gap-2"><span dir="auto" title={name} className="truncate font-semibold">{name}</span>{i === mine ? <Badge tone="good" className="border border-current">You</Badge> : null}</span>
                  <Progress value={(xp / lead) * 100} label={`${name} compared with first place`} className="max-sm:hidden" />
                  <span className={cn("flex items-center gap-1 text-[13px] font-semibold max-sm:hidden", trend > 0 ? "text-primary" : trend < 0 ? "text-bad" : "text-muted")}>{trend > 0 ? <TrendingUp size={15} aria-label="Up" /> : trend < 0 ? <TrendingDown size={15} aria-label="Down" /> : <Minus size={15} aria-label="No change" />}{trend ? short(Math.abs(trend)) : null}</span>
                  <span className="text-right text-sm font-semibold whitespace-nowrap">{short(xp)} XP</span>
                </li>
              ))}
            </ol>
            {rows.length > limit ? <div className="p-3 text-center"><Button variant="outline" onClick={() => setLimit((n) => n + 20)}>Show 20 more</Button></div> : null}
          </Card>
        </>
      ) : <Card><Empty icon={Trophy} title="No ranking yet" body="Finish lessons to earn XP and appear here." /></Card>}
    </>
  );
}

const SETTINGS = [["remind", "Class reminders", "15 minutes before each live class"], ["streak", "Streak reminder", "If you have not studied by 8 PM"], ["email", "Weekly summary", "Progress and upcoming work by email"]];
const BADGES = [["Early bird", "5 lessons before 8 AM", 100], ["Quiz ace", "Score 90% or more three times", 100], ["Two weeks", "Study 14 days in a row", 86], ["Finisher", "Complete 3 courses", 66]];

export function Profile() {
  const { student, courses, theme, setTheme } = useStore();
  const [prefs, setPrefs] = useState({ remind: true, streak: true, email: false });
  const [confirm, setConfirm] = useState(false);
  const done = courses.reduce((n, c) => n + courseStats(c).done, 0);
  const info = [[Mail, "Email", student.email], [GraduationCap, "School", student.school], [MapPin, "Location", student.location], [CalendarDays, "Joined", student.joined]];
  return (
    <>
      <PageHeader title="Profile" />
      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={student.name} img={student.img} size={80} />
          <div className="min-w-0 flex-[1_1_240px]"><h2 dir="auto" className="text-2xl leading-snug font-semibold tracking-[-0.02em] break-words">{student.name}</h2><p className="text-muted">{student.grade}</p></div>
          <Badge tone="good">Level {student.level}</Badge>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 md:grid-cols-4">
          {[["Lessons done", num(done)], ["Total XP", short(student.xp)], ["Current streak", plural(student.streak, "day")], ["Longest streak", plural(student.longest, "day")]].map(([k, v]) => <div key={k} className="min-w-0"><dt className="text-[13px] text-muted">{k}</dt><dd className="truncate text-2xl font-semibold tracking-[-0.02em]" title={v}>{v}</dd></div>)}
        </dl>
      </Card>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Account details" />
          <ul className="px-5 pb-3">{info.map(([Icon, k, v]) => <li key={k} className="flex items-center gap-3 border-t border-line py-3 first:border-0"><Icon size={18} className="shrink-0 text-muted" aria-hidden="true" /><div className="min-w-0"><p className="text-xs text-muted">{k}</p><p className="text-sm font-semibold [overflow-wrap:anywhere]">{v}</p></div></li>)}</ul>
        </Card>
        <div className="grid gap-6">
          <Card>
            <CardHeader title="Preferences" />
            <div className="px-5 pb-5">
              <p className="mb-2 text-sm font-semibold">Appearance</p>
              <Segmented label="Appearance" value={theme} onValueChange={setTheme} items={[["light", "Light"], ["dark", "Dark"], ["system", "System"]]} />
              <ul className="mt-4">{SETTINGS.map(([k, t, d]) => <li key={k} className="flex items-center justify-between gap-4 border-t border-line py-3"><label htmlFor={k} className="min-w-0"><span className="block text-sm font-semibold">{t}</span><span className="block text-[13px] text-muted">{d}</span></label><Switch id={k} checked={prefs[k]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: v }))} /></li>)}</ul>
            </div>
          </Card>
          <Card>
            <CardHeader title="Achievements" />
            <ul className="grid gap-3 px-5 pb-5 sm:grid-cols-2">{BADGES.map(([name, how, pct]) => <li key={name} className="rounded-xl border border-line p-3"><div className="flex items-center gap-2"><Award size={18} className={cn("shrink-0", pct === 100 ? "text-streak" : "text-muted")} aria-hidden="true" /><p className="text-sm font-semibold">{name}</p></div><p className="mt-1 mb-2 text-xs text-muted">{how}</p>{pct === 100 ? <Badge tone="good">Earned</Badge> : <Progress value={pct} label={`${name} progress`} />}</li>)}</ul>
          </Card>
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="min-w-0"><p className="font-semibold">Delete account</p><p className="text-[13px] text-muted">Removes your progress and certificates.</p></div><Button variant="outline" className="text-bad" onClick={() => setConfirm(true)}><Trash2 size={16} aria-hidden="true" />Delete account</Button></Card>
        </div>
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm} title="Delete your account?" description="This removes your progress and certificates and cannot be undone. This is a demo, so nothing is deleted.">
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirm(false)}>Keep account</Button><Button variant="danger" onClick={() => setConfirm(false)}>Delete account</Button></div>
      </Dialog>
    </>
  );
}
