import { useState } from "react";
import { Award, CalendarDays, Crown, GraduationCap, Mail, MapPin, Minus, Phone, ShieldCheck, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { badges, board, heat, student } from "../data/mock.js";
import { courseStats, useStore } from "../state/store.jsx";
import { Avatar, Bar, Card, Segmented, num } from "../components/ui.jsx";

export function Leaderboard() {
  const [period, setPeriod] = useState("week");
  const rows = board[period];
  const you = rows.findIndex((r) => r[0] === student.name);
  const suffix = ["st", "nd", "rd"][you] || "th";
  return (
    <>
      <header className="page-head rise" style={{ "--i": 0 }}>
        <div><h1 className="h1">Leaderboard</h1><p className="muted">You are {you + 1}{suffix} in {student.school}</p></div>
        <Segmented label="Period" value={period} onChange={setPeriod} options={[["week", "This week"], ["month", "This month"], ["all", "All time"]]} />
      </header>
      <ol className="podium rise" style={{ "--i": 1 }} key={period}>
        {[1, 0, 2].map((k) => {
          const [name, pts, img] = rows[k];
          return (
            <li key={name} className={`place-${k + 1}`}>
              {k === 0 ? <Crown size={26} className="crown" aria-hidden="true" /> : null}
              <Avatar name={name} img={img} size={k === 0 ? 88 : 68} />
              <b className="clamp2">{name}</b><span className="muted small">{num(pts)} XP</span>
              <span className={`step fill-${["lime", "sky", "butter"][k]}`}>{k + 1}</span>
            </li>
          );
        })}
      </ol>
      <Card className="rise" style={{ "--i": 2 }}>
        <ol className="rank-table">
          {rows.map(([name, pts, img, trend], i) => (
            <li key={name} className={name === student.name ? "me-row" : ""}>
              <span className="pos">{i + 1}</span><Avatar name={name} img={img} size={40} />
              <b className="trunc">{name}{name === student.name ? <span className="tag lime">You</span> : null}</b>
              <span className={`trend ${trend > 0 ? "up" : trend < 0 ? "down" : ""}`} aria-label={trend > 0 ? `Up ${trend}` : trend < 0 ? `Down ${-trend}` : "No change"}>
                {trend > 0 ? <TrendingUp size={16} /> : trend < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}{trend ? Math.abs(trend) : ""}
              </span>
              <span className="pts">{num(pts)} <small>XP</small></span>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}

const SETTINGS = [["remind", "Class reminders", "15 minutes before each live class"], ["streak", "Streak nudges", "A reminder if you have not studied by 8 PM"], ["email", "Weekly summary email", "Progress and upcoming deadlines"]];

export function Profile() {
  const { courses, xp, setOverlay } = useStore();
  const [prefs, setPrefs] = useState({ remind: true, streak: true, email: false });
  const done = courses.reduce((a, c) => a + courseStats(c).done, 0);
  const info = [[Mail, "Email", student.email], [Phone, "Phone", student.phone], [MapPin, "Location", student.location], [GraduationCap, "School", student.school], [CalendarDays, "Joined", student.joined]];
  return (
    <>
      <header className="profile-head rise" style={{ "--i": 0 }}>
        <Avatar name={student.name} img={47} size={96} />
        <div className="min0"><h1 className="h1">{student.name}</h1><p className="muted">{student.grade}</p></div>
        <span className="tag lime"><ShieldCheck size={15} aria-hidden="true" /> Verified student</span>
      </header>
      <div className="tiles four">
        {[["Courses", courses.length, "lime"], ["Lessons done", done, "sky"], ["Total XP", num(xp), "butter"], ["Weekly rank", `#${student.rank}`, "paper"]].map(([label, v, tone], i) => (
          <div key={label} className={`tile fill-${tone} rise`} style={{ "--i": i + 1 }}><span>{label}</span><b>{v}</b></div>
        ))}
      </div>
      <div className="split">
        <div className="stack min0">
          <Card className="rise" style={{ "--i": 5 }} title="Activity" sub="Lessons completed over the last 18 weeks"
            action={<span className="legend">Less {[0, 1, 2, 3, 4].map((l) => <i key={l} data-l={l} />)} More</span>}>
            <div className="heat" role="img" aria-label={`Activity over 18 weeks. ${heat.filter(Boolean).length} active days.`}>{heat.map((l, i) => <i key={i} data-l={l} />)}</div>
          </Card>
          <Card className="rise" style={{ "--i": 6 }} title="Badges" sub={`${badges.filter((b) => b.pct === 100).length} of ${badges.length} earned`}>
            <ul className="badges">
              {badges.map((b) => (
                <li key={b.name} className={b.pct === 100 ? "earned" : ""}>
                  <span className="badge-icon"><Award size={20} aria-hidden="true" /></span>
                  <b>{b.name}</b><small>{b.how}</small>
                  {b.pct === 100 ? <span className="tag lime">Earned</span> : <Bar value={b.pct} />}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <aside className="stack">
          <Card className="rise" style={{ "--i": 5 }} title="Contact">
            <ul className="rows">{info.map(([Icon, label, v]) => <li key={label}><Icon size={18} aria-hidden="true" /><span className="min0"><small>{label}</small><b className="wrap-any">{v}</b></span></li>)}</ul>
          </Card>
          <Card className="rise" style={{ "--i": 6 }} title="Notification settings">
            <ul className="rows">
              {SETTINGS.map(([k, title, body]) => (
                <li key={k}><span className="min0"><b id={`set-${k}`}>{title}</b><small>{body}</small></span>
                  <button className="switch" role="switch" aria-checked={prefs[k]} aria-labelledby={`set-${k}`} onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))} /></li>
              ))}
            </ul>
          </Card>
          <Card className="rise" style={{ "--i": 7 }} title="Delete account" sub="Permanently removes your progress and certificates">
            <button className="btn ghost danger-text press" onClick={() => setOverlay({ type: "delete" })}><Trash2 size={17} aria-hidden="true" /> Delete account</button>
          </Card>
        </aside>
      </div>
    </>
  );
}
