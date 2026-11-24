/* Skillmount Learn — static UI demo. All state is local. No network. */
(() => {
  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const P = {
    home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10", book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 002 2h13", cal: "M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
    trophy: "M8 4h8v5a4 4 0 01-8 0V4zM8 6H4v1a3 3 0 003 3M16 6h4v1a3 3 0 01-3 3M12 13v4M8 21h8M10 17h4", user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
    bell: "M6 16v-5a6 6 0 1112 0v5l2 2H4l2-2zM10 21h4", flame: "M12 3c1 3 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z", play: "M7 4l13 8-13 8V4z", pause: "M7 4h4v16H7zM13 4h4v16h-4z",
    lock: "M6 11h12v9H6zM8 11V8a4 4 0 118 0v3", check: "M5 12.5l4.5 4.5L19 7.5", clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2", search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
    chevR: "M9 6l6 6-6 6", chevL: "M15 6l-6 6 6 6", chevD: "M6 9l6 6 6-6", x: "M6 6l12 12M18 6L6 18", star: "M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z",
    file: "M7 3h7l5 5v13H7zM14 3v5h5", download: "M12 4v11M7 11l5 5 5-5M5 20h14", msg: "M4 5h16v11H9l-5 4V5z", zap: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
    target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8z", award: "M12 15a6 6 0 100-12 6 6 0 000 12zM8.5 14L7 21l5-3 5 3-1.5-7", video: "M3 6h12v12H3zM15 10l6-3v10l-6-3",
    sidebar: "M4 5h16v14H4zM9 5v14", arrowR: "M5 12h14M13 6l6 6-6 6", arrowL: "M19 12H5M11 6l-6 6 6 6", mail: "M4 6h16v12H4zM4 7l8 6 8-6",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z", pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
    crown: "M3 8l5 4 4-7 4 7 5-4-2 11H5L3 8z", trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13", shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z", trend: "M4 16l5-5 4 4 7-8M15 7h5v5",
    plus: "M12 5v14M5 12h14", fwd: "M5 6l7 6-7 6V6zM13 6l7 6-7 6V6z", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z", wand: "M5 19L16 8M15 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM19 12l.7 1.3L21 14l-1.3.7L19 16l-.7-1.3L17 14l1.3-.7L19 12z", cog: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 000 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 002 1.2l.4 2.6h4l.4-2.6a7 7 0 002-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z", layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5", code: "M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14", dots: "M5 12h.01M12 12h.01M19 12h.01", sun: "M12 17a5 5 0 100-10 5 5 0 000 10zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4", moon: "M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z", school: "M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5", up: "M6 14l6-6 6 6", down: "M6 10l6 6 6-6", minus: "M6 12h12",
  };
  const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;
  const initials = (name) => {
    const words = name.trim().split(/\s+/).filter((w) => !/^(jr|sr|ii|iii|iv|dr)\.?$/i.test(w));
    const seg = (s) => { try { return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(s)][0]?.segment || ""; } catch { return [...s][0] || ""; } };
    const a = seg(words[0] || ""), b = words.length > 1 ? seg(words[words.length - 1]) : "";
    return (a + b).toUpperCase() || "?";
  };
  const plural = (n, one, many) => `${n.toLocaleString()} ${new Intl.PluralRules("en").select(n) === "one" ? one : many}`;
  const num = (n) => n.toLocaleString("en-IN");
  const clock = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = String(s % 60).padStart(2, "0"); return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`; };
  const grad = (c) => `linear-gradient(135deg, ${D.covers[c][0]}, ${D.covers[c][1]})`;
  const dayN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- state ---------- */
  const url = new URLSearchParams(location.search);
  let mode = ["worst", "empty"].includes(url.get("data")) ? url.get("data") : "demo";
  let DATA = applyDataMode(mode);
  const S = { wk: 0, selDay: null, taskF: "prog", dark: true, filter: "all", q: "", collapsed: false, tab: "overview", period: "week", chart: "week", cDay: null, cTab: "upcoming", cd: 47 * 60 + 12, pl: null, notifs: null, popover: null, hovered: -1, settings: { remind: true, streak: true, email: false } };
  const course = (id) => DATA.courses.find((c) => c.id === id);
  const view = $("#view");

  /* ---------- chrome ---------- */
  const NAV = [["#/dashboard", "home", "Dashboard"], ["#/courses", "book", "My Courses"], ["#/classes", "cal", "Classes"], ["#/rank", "trophy", "Rank"], ["#/profile", "user", "Profile"]];
  function renderChrome(route) {
    const unread = (S.notifs || DATA.notices).filter((n) => n.unread).length;
    const cur = (h) => (route.startsWith(h.slice(1)) || (h === "#/courses" && route.startsWith("/learn")) ? ' aria-current="page"' : "");
    $("#nav").innerHTML = NAV.map(([h, i, l]) => `<a href="${h}" class="press"${cur(h)} title="${l}">${ic(i)}<span class="lbl">${l}</span>${h === "#/classes" && DATA.classes.some((c) => c.state === "soon") ? '<span class="badge">1</span>' : ""}</a>`).join("");
    $("#tabbar").innerHTML = NAV.map(([h, i, l]) => `<a href="${h}"${cur(h)}>${ic(i)}${l.replace("My ", "")}</a>`).join("");
    
    $("#searchIco").innerHTML = ic("search"); $("#setBtn").innerHTML = ic("cog");
    $("#bellBtn").innerHTML = ic("bell") + (unread ? '<span class="dot"></span>' : "");
    $("#miniStreak").innerHTML = ic("flame") + `<span class="rb-n">${DATA.student.streak}</span>`;
    $("#meBtn").innerHTML = `<img src="https://i.pravatar.cc/120?img=47" alt="" onerror="this.remove()"><span class="avatar">${esc(initials(DATA.student.name))}</span>`;
    const cats = [["All courses", ""], ...DATA.courses.slice(0, 2).map((c) => [c.title, c.title])];
    $("#cats").innerHTML = cats.map(([l, q], i) => `<button class="cat press ${(S.q || "") === q && route.startsWith("/courses") ? "on" : ""}" data-cat="${esc(q)}"><span class="trunc">${esc(l)}</span></button>`).join("") + `<button class="cat more press" data-nav="#/courses" aria-label="All courses">${ic("chevR")}</button>`;
    $("#theme").innerHTML = `<button class="${S.dark ? "" : "on"}" data-theme="light" aria-label="Light">${ic("sun")}</button><button class="${S.dark ? "on" : ""}" data-theme="dark" aria-label="Dark">${ic("moon")}</button>`;
    const names = { dashboard: "Dashboard", courses: "My Courses", classes: "Classes", rank: "Rank", profile: "Profile", learn: "My Courses" };
    const seg = route.split("/").filter(Boolean);
    const c = seg[0] === "courses" && seg[1] ? course(seg[1]) : seg[0] === "learn" ? course(seg[1]) : null;
    $("#crumb").innerHTML = `<span>Learn</span>${ic("chevR")}<b>${names[seg[0]] || "Dashboard"}</b>${c ? `${ic("chevR")}<span class="trunc">${esc(c.title)}</span>` : ""}`;
  }

  /* ---------- views ---------- */
  const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const fmtCd = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60; return [h, m, r].map((v) => String(v).padStart(2, "0")); };

  function resumeTarget() {
    for (const c of DATA.courses) { const m = c.modules.find((x) => x.state === "open" && x.pct > 0); if (m) return { c, m }; }
    for (const c of DATA.courses) { const m = c.modules.find((x) => x.state === "open"); if (m) return { c, m }; }
    return null;
  }

  const TASKS = [
    { tag: "Assignment", tone: "y", title: "Limits worksheet: problems 1–20", desc: "Solve every limit problem and upload a photo of your working before the deadline. Show each step, not just the answer.", log: "2h 10m", range: "24 Nov – 29 Nov", st: "prog" },
    { tag: "Lab report", tone: "o", title: "Gauss's law practical write-up", desc: "Write up observations from the virtual lab, plot the flux table and add two sources of error with fixes.", log: "1h 45m", range: "26 Nov – 02 Dec", st: "prog" },
    { tag: "Revision", tone: "g", title: "Electrochemistry mock quiz", desc: "Ten timed questions on cells, Nernst equation and conductivity. Score 80% or more to unlock the next chapter.", log: "55m", range: "18 Nov – 21 Nov", st: "done" },
  ];
  const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const av = (n) => `https://i.pravatar.cc/96?img=${n}`;
  const wave = (pct) => Array.from({ length: 38 }, (_, i) => { const h = 22 + Math.abs(Math.sin(i * 1.7) * 52 + Math.sin(i * 0.6) * 26); return `<i class="${i / 38 * 100 < pct ? "on" : ""}" style="height:${Math.min(100, h)}%"></i>`; }).join("");
  const stars = (n) => `<span class="stars" aria-label="${n} out of 5">${"★".repeat(Math.round(n))}${"☆".repeat(5 - Math.round(n))}</span>`;

  function vDashboard() {
    const st = DATA.student, r = resumeTarget(), same = (a, b) => a.toDateString() === b.toDateString();
    const now = new Date(), base = new Date(now); base.setDate(now.getDate() - ((now.getDay() + 6) % 7) + S.wk * 7);
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
    const sel = S.selDay ? new Date(S.selDay) : now;
    const evs = DATA.classes.filter((c) => same(c.date, sel));
    const done = DATA.courses.filter((c) => c.status === "completed");
    const rec = DATA.courses.filter((c) => !r || c.id !== r.c.id).slice(0, 2);
    const tasks = TASKS.filter((t) => t.st === S.taskF);
    const lastDone = DATA.courses.flatMap((c) => c.modules.filter((m) => m.state === "done").map((m) => ({ c, m }))).pop();
    const empty = !DATA.courses.length;

    const greeting = `<section class="q-card q-greet" data-s>
      <div class="q-greet-top"><div style="min-width:0"><h1 class="q-h1 clamp2">Hello, ${esc(st.first)} <span class="wave-hand">👋</span></h1><p class="muted">What do you want to learn today?</p></div>
        <div class="q-actions"><button class="pill-btn press" data-toast="Weekly plan rolled over to next week">Roll over</button><button class="pill-btn press" data-toast="Goal added: finish 5 lessons this week">${ic("plus")} Add your goal</button></div></div>
      <div class="q-greet-row">${r ? `<div class="q-now"><button class="q-thumb press" data-nav="#/learn/${r.c.id}/${r.m.id}" aria-label="Resume ${esc(r.m.title)}"><img src="${ytThumb(r.c.yt)}" alt="" loading="lazy" onerror="this.remove()"></button>
          <div class="q-now-info"><div class="q-now-top"><div style="min-width:0"><div class="h3 trunc">${esc(r.m.title)}</div><div class="muted small trunc">${esc(r.c.tutor)}</div></div><span class="q-time">${clock(Math.round(r.m.mins * 60 * (1 - r.m.pct / 100)))}</span></div>
          <div class="q-wave-row"><div class="q-wave" aria-hidden="true">${wave(r.m.pct)}</div><button class="q-play press" data-nav="#/learn/${r.c.id}/${r.m.id}" aria-label="Play">${ic("play")}</button></div></div></div>
        <button class="q-tile press" data-nav="${lastDone ? `#/learn/${lastDone.c.id}/${lastDone.m.id}` : "#/courses"}"><span class="q-tile-ico">${ic("fwd")}</span><span>Previous</span></button>
        <button class="q-tile press" data-nav="#/courses"><span class="q-faces">${[12, 32, 47].map((n) => `<img src="${av(n)}" alt="" loading="lazy" onerror="this.remove()">`).join("")}</span><span>Recommend</span></button>`
        : `<div class="q-now empty"><div class="muted">No lesson in progress. Pick a course to start learning.</div></div><button class="q-tile press" data-nav="#/courses"><span class="q-tile-ico">${ic("book")}</span><span>Browse</span></button>`}</div></section>`;

    const calendar = `<section class="q-card q-cal" data-s><div class="q-cal-head"><h2 class="q-h2">${mon[days[3].getMonth()]} ${days[3].getFullYear()}</h2><div style="display:flex;gap:8px"><button class="round-btn press" data-wk="-1" aria-label="Previous week">${ic("chevL")}</button><button class="round-btn press" data-wk="1" aria-label="Next week">${ic("chevR")}</button></div></div>
      <div class="q-week" role="group" aria-label="Week">${days.map((d) => `<button class="q-day press ${same(d, sel) ? "sel" : ""} ${same(d, now) ? "today" : ""}" data-sel="${d.toISOString()}" aria-pressed="${same(d, sel)}"><small>${dayN[d.getDay()]}</small><b>${d.getDate()}</b>${DATA.classes.some((c) => same(c.date, d)) ? "<i></i>" : ""}</button>`).join("")}</div>
      <div class="q-events">${evs.length ? evs.map((c) => `<div class="q-event"><span class="q-ev-ico">${ic("video")}</span><div style="min-width:0;flex:1"><div class="h3 trunc">${esc(c.title)}</div><div class="muted small trunc">${c.time} – ${esc(c.tutor)}${c.state === "soon" ? " · starts soon" : ""}</div></div><button class="round-btn sm press" data-nav="#/classes" aria-label="Open schedule">${ic("chevR")}</button></div>`).join("") : `<div class="q-event muted small">${ic("cal")}<span>Nothing scheduled this day</span></div>`}</div></section>`;

    const video = `<section class="q-card q-video" data-s>${r ? `<div class="q-video-head"><div style="min-width:0"><h2 class="q-h2 clamp2">${esc(r.m.title)}</h2><p class="muted small trunc">${esc(r.c.title)} · ${esc(r.c.sub)}</p></div><div style="display:flex;gap:8px"><button class="round-btn press" data-nav="#/learn/${r.c.id}/${r.m.id}" aria-label="Open notes">${ic("file")}</button><button class="round-btn press" data-toast="Lesson saved for offline" aria-label="Save lesson">${ic("download")}</button></div></div>
      <div class="q-video-body"><div class="q-player" id="inlinePlayer"><img src="${ytThumb(r.c.yt)}" alt="" loading="lazy" onerror="this.remove()"><span class="q-chip-float"><i></i>${esc(r.c.tutor.split(" ").slice(-1)[0])} Live</span><button class="q-big press" data-act="inlineplay" data-yt="${r.c.yt}" aria-label="Play video">${ic("play")}</button><div class="q-prog"><i style="width:${Math.max(r.m.pct, 6)}%"></i></div></div>
        <div class="q-video-side"><div><div class="h3">Lesson ${r.m.n}</div><div class="muted small" style="margin-top:8px;display:flex;align-items:center;gap:8px"><span class="q-faces sm">${[5, 15, 25, 35].map((n) => `<img src="${av(n)}" alt="" loading="lazy" onerror="this.remove()">`).join("")}</span></div><div class="muted small" style="margin-top:8px">${num(r.c.enrolled)} people watching</div></div>
        <div style="display:flex;flex-direction:column;gap:10px"><button class="pill-btn wide press" data-toast="Comment box opened below the video">${ic("msg")} Leave comment</button><button class="pill-btn wide press" data-nav="#/courses/${r.c.id}">${ic("eye")} View description</button></div></div></div>`
      : `<div class="empty"><span class="ill">${ic("video")}</span><b>No lesson to resume</b><p>Pick a course and your lesson video will appear here.</p><button class="btn primary press" data-nav="#/courses">Browse courses</button></div>`}</section>`;

    const tiles = `<div class="q-tiles" data-s>${DATA.courses.slice(0, 3).map((c, i) => `<button class="q-card q-prog-tile press ${c.id === (r && r.c.id) ? "dark" : ""}" data-nav="#/courses/${c.id}"><span class="q-pt-ico">${ic(["wand", "layers", "code"][i % 3])}</span><span style="min-width:0;flex:1"><small>${c.modules.filter((m) => m.state === "done").length}/${c.total} watched</small><b class="trunc" style="display:block">${esc(c.title)}</b></span><span class="dots" aria-hidden="true">⋮</span></button>`).join("") || `<div class="q-card empty"><b>No courses yet</b></div>`}</div>`;

    const board = `<section class="q-card q-tasks" data-s><div class="q-cal-head"><h2 class="q-h2">Tasks board</h2><div style="display:flex;gap:8px;position:relative"><button class="pill-btn press" data-act="taskmenu" aria-haspopup="menu">${S.taskF === "prog" ? "In progress" : "Completed"} ${ic("chevD")}</button><button class="round-btn press" data-toast="Task options" aria-label="More">${ic("dots")}</button>${S.popover === "task" ? `<div class="pop" role="menu" style="top:46px;left:0;right:auto;min-width:170px;transform-origin:top left">${[["prog", "In progress"], ["done", "Completed"]].map(([k, l]) => `<button role="menuitemradio" aria-checked="${S.taskF === k}" data-taskf="${k}">${l}${S.taskF === k ? ic("check") : ""}</button>`).join("")}</div>` : ""}</div></div>
      <div class="q-task-list">${empty ? `<div class="empty"><b>No tasks</b><p>Assignments from your tutors show up here.</p></div>` : tasks.length ? tasks.map((t) => `<article class="q-task"><div class="q-task-top"><h3 class="clamp2">${esc(t.title)}</h3><span class="tag ${t.tone}">${t.tag}</span></div><p class="clamp3">${esc(t.desc)}</p><div class="q-task-foot"><span class="log">${ic("clock")} Log: ${t.log}</span><span class="muted small">${t.range}</span></div></article>`).join("") : `<div class="empty"><b>Nothing here yet</b><p>Finished tasks will be listed here.</p></div>`}</div></section>`;

    const bottom = (rec.length ? rec : []).map((c) => `<button class="q-card q-course press" data-s data-nav="#/courses/${c.id}"><div style="min-width:0;display:flex;flex-direction:column;gap:6px;text-align:left"><h3 class="clamp2">${esc(c.title)}</h3><p class="muted small trunc">By ${esc(c.tutor)}</p>${stars(c.rating)}<div class="q-lv"><b>${c.level}</b><span class="pills"><span class="mini dark">${c.pct}%</span><span class="mini">${c.status === "completed" ? "Completed" : c.status === "new" ? "Not started" : "In progress"}</span></span></div></div><img src="${c.img}" alt="" loading="lazy" onerror="this.remove()"></button>`).join("");

    return `<div class="q-bento">${greeting}${calendar}${video}${tiles}${board}${bottom || ""}</div>`;
  }



  function courseCard(c) {
    const tag = c.status === "completed" ? '<span class="chip good" style="background:rgba(255,255,255,.95)">Completed</span>' : c.status === "new" ? '<span class="chip" style="background:rgba(255,255,255,.95)">Not started</span>' : `<span class="chip" style="background:#f7c21b;color:#15140f">${c.pct}% done</span>`;
    return `<button class="ccard press" data-nav="#/courses/${c.id}" data-s><div class="art" style="background:linear-gradient(180deg,rgba(0,0,0,.05) 30%,rgba(0,0,0,.55)),url('${c.img}') center/cover,${grad(c.cover)}"><div style="display:flex;justify-content:space-between;gap:8px">${tag}<span class="chip dark">${esc(c.level)}</span></div></div>
      <div class="body"><div style="min-width:0"><h3 class="clamp2">${esc(c.title)}</h3><p class="muted small trunc" style="margin-top:3px">${esc(c.sub)}</p></div>
      <div class="meta"><span>${ic("video")}${plural(c.total, "lesson", "lessons")}</span><span>${ic("clock")}${c.weeks} wks</span><span>${ic("star")}${c.rating}</span></div>
      <div class="foot"><div style="flex:1;min-width:0"><div class="bar ${c.pct === 100 ? "good" : ""}" style="--p:${c.pct / 100}"><i></i></div><div class="muted small trunc" style="margin-top:8px">${esc(c.tutor)}</div></div><img class="av-img" src="https://i.pravatar.cc/80?u=${encodeURIComponent(c.tutor)}" alt="" loading="lazy" onerror="this.remove()"></div></div></button>`;
  }

  function vCourses() {
    const q = S.q.trim().toLowerCase();
    const counts = { all: DATA.courses.length, active: DATA.courses.filter((c) => c.status === "active").length, completed: DATA.courses.filter((c) => c.status === "completed").length, new: DATA.courses.filter((c) => c.status === "new").length };
    let list = DATA.courses.filter((c) => S.filter === "all" || c.status === S.filter);
    if (q) list = list.filter((c) => (c.title + c.sub + c.tutor + c.modules.map((m) => m.title).join(" ")).toLowerCase().includes(q));
    const tabs = [["all", "All"], ["active", "In progress"], ["completed", "Completed"], ["new", "Not started"]];
    return `<div class="view-head" data-s><div><h1 class="h1">My courses</h1><p class="sub">${plural(counts.all, "course", "courses")} · ${counts.completed} completed</p></div></div>
      <div class="toolbar" data-s><div class="seg" role="group" aria-label="Filter courses">${tabs.map(([k, l]) => `<button data-filter="${k}" aria-pressed="${S.filter === k}">${l}<span class="ct">${counts[k]}</span></button>`).join("")}</div>${q ? `<span class="chip accent">Searching “${esc(S.q)}” <button data-act="clearq" aria-label="Clear search" style="display:inline-grid">${ic("x")}</button></span>` : ""}</div>
      ${list.length ? `<div class="course-grid">${list.map(courseCard).join("")}</div>` : `<div class="card" data-s><div class="empty"><span class="ill">${ic("search")}</span><b>${DATA.courses.length ? "No courses match" : "You're not enrolled in any courses"}</b><p>${DATA.courses.length ? "Try a different filter or clear your search." : "Ask your school coordinator to enroll you, then your courses appear here."}</p>${DATA.courses.length ? '<button class="btn ghost press" data-act="reset">Reset filters</button>' : ""}</div></div>`}`;
  }

  const lockText = (m) => m.state === "scheduled" ? "Available Thu, 6:00 PM" : "Complete the previous lesson to unlock";
  function vCourse(id) {
    const c = course(id);
    if (!c) return `<div class="card"><div class="empty"><b>Course not found</b><button class="btn ghost press" data-nav="#/courses">Back to courses</button></div></div>`;
    const done = c.modules.filter((m) => m.state === "done").length, hrs = (c.modules.reduce((a, m) => a + m.mins, 0) / 60).toFixed(1);
    const next = c.modules.find((m) => m.state === "open");
    const CIRC = 2 * Math.PI * 54;
    return `<button class="back press" data-nav="#/courses" data-s>${ic("arrowL")} All courses</button>
      <section class="d-hero" style="background:${grad(c.cover)}" data-s><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip dark">${esc(c.level)}</span><span class="chip dark">${c.weeks} weeks</span></div><h1>${esc(c.title)}</h1><p class="clamp2">${esc(c.sub)} · taught by ${esc(c.tutor)}</p>
      <div class="row"><div><b>${plural(c.total, "lesson", "lessons")}</b><span>${hrs} hours total</span></div><div><b>${num(c.enrolled)}</b><span>students</span></div><div><b>${c.rating} ★</b><span>course rating</span></div></div></section>
      <div class="detail"><section class="card" data-s><div class="card-head"><div><h2 class="h2">Lessons</h2><p class="muted small">${done} of ${c.total} complete</p></div>${next ? `<button class="btn primary press" data-nav="#/learn/${c.id}/${next.id}">${ic("play")} ${next.pct ? "Resume" : "Start"} lesson ${next.n}</button>` : '<span class="chip good">Course complete</span>'}</div>
        ${c.modules.map((m) => `<button class="mod ${m.state === "locked" || m.state === "scheduled" ? "locked" : ""} press" data-mod="${m.id}" data-course="${c.id}"><span class="node ${m.state}">${m.state === "done" ? ic("check") : m.state === "locked" || m.state === "scheduled" ? ic("lock") : m.n}</span>
          <span style="min-width:0"><span class="mt clamp2" style="display:-webkit-box">${esc(m.title)}</span><span class="ml"><span>${m.mins} min</span>${m.quiz ? "<span>Quiz</span>" : ""}${m.state === "done" ? `<span style="color:var(--good)">Score ${m.score}%</span>` : m.state === "open" ? (m.pct ? `<span class="bar" style="--p:${m.pct / 100}"><i></i></span><span>${m.pct}% watched</span>` : "<span>Not started yet</span>") : `<span>${lockText(m)}</span>`}</span></span>
          <span class="muted">${m.state === "done" ? '<span class="chip good">Done</span>' : m.state === "open" ? `<span class="chip accent">${m.pct ? "Resume" : "Open"}</span>` : ""}</span></button>`).join("")}</section>
        <aside class="stack"><section class="card" data-s style="display:flex;align-items:center;gap:20px"><div class="ring" style="--c:${CIRC};--p:${c.pct / 100}"><svg viewBox="0 0 132 132"><circle class="trk" cx="66" cy="66" r="54"/><circle class="val" cx="66" cy="66" r="54"/></svg><div class="c"><div><b>${c.pct}%</b><br><span>complete</span></div></div></div>
          <div class="stat-list" style="flex:1;min-width:0"><div><span class="muted">Lessons</span><b>${done}/${c.total}</b></div><div><span class="muted">Avg. score</span><b>${(() => { const s = c.modules.filter((m) => m.score); return s.length ? Math.round(s.reduce((a, m) => a + m.score, 0) / s.length) + "%" : "—"; })()}</b></div><div><span class="muted">Time left</span><b>${(c.modules.filter((m) => m.state !== "done").reduce((a, m) => a + m.mins, 0) / 60).toFixed(1)}h</b></div></div></section>
          <section class="card" data-s><h2 class="h2" style="margin-bottom:14px">Your tutor</h2><div style="display:flex;align-items:center;gap:14px"><span class="avatar" style="width:48px;height:48px;background:${grad(c.cover)}">${esc(initials(c.tutor))}</span><div style="min-width:0"><div class="h3 trunc">${esc(c.tutor)}</div><div class="muted small">Replies within a day</div></div></div><button class="btn ghost press" style="width:100%;margin-top:16px" data-toast="Message sent to your tutor">${ic("msg")} Ask a question</button></section>
          <section class="card" data-s><h2 class="h2" style="margin-bottom:6px">Resources</h2>${["Course syllabus.pdf", "Formula sheet.pdf", "Practice set 1.pdf"].map((f) => `<div class="list-item" style="margin-top:10px"><span class="ico">${ic("file")}</span><div class="grow"><div class="h3 trunc">${f}</div><div class="muted small">PDF · 1.${f.length % 9} MB</div></div><button class="icon-btn press" style="width:36px;height:36px;border-radius:11px" aria-label="Download ${f}" data-toast="Download started">${ic("download")}</button></div>`).join("")}</section></aside></div>`;
  }

  function vPlayer(cid, mid) {
    const c = course(cid), m = c && c.modules.find((x) => x.id === mid);
    if (!m || m.state === "locked" || m.state === "scheduled") return `<div class="card"><div class="empty"><span class="ill">${ic("lock")}</span><b>This lesson isn't available yet</b><p>${m ? lockText(m) : "That lesson isn't in this course."}</p><button class="btn ghost press" data-nav="#/courses${c ? "/" + c.id : ""}">Back to lessons</button></div></div>`;
    if (!S.pl || S.pl.id !== m.id) S.pl = { id: m.id, t: m.state === "done" ? 0 : m.pct / 100, max: m.state === "done" ? 1 : m.pct / 100, playing: false, speed: 1, asked: new Set(), done: m.state === "done" };
    const pl = S.pl, others = c.modules;
    const tabs = [["overview", "Overview"], ["notes", "Notes"], ["resources", "Resources"], ["quiz", "Quiz"]];
    return `<button class="back press" data-nav="#/courses/${c.id}" data-s>${ic("arrowL")} ${esc(c.title)}</button>
      <div class="player"><div><div class="stage yt" id="stage" data-s><img class="stage-img" src="${c.yt ? ytThumb(c.yt) : c.img}" alt="" onerror="this.remove()"><div class="stage-shade"></div>
        <div class="slide"><span class="chip dark" style="align-self:flex-start">Lesson ${m.n}</span><h2>${esc(m.title)}</h2><div class="eq">${esc(c.title)} · ${esc(c.tutor)}</div></div>
        <button class="big-play" data-act="loadvideo" data-yt="${c.yt}" aria-label="Play lesson video"><span>${ic("play")}</span></button></div>
      <div class="p-info" data-s><div class="p-title"><div style="min-width:0;flex:1"><h1 class="h1" style="font-size:24px">${esc(m.title)}</h1><p class="sub">Lesson ${m.n} of ${c.total} · ${m.mins} min · ${esc(c.tutor)}</p></div><button class="btn ${pl.done ? "ghost" : "primary"} press" data-act="complete" id="doneBtn">${ic("check")} ${pl.done ? "Completed" : "Mark complete"}</button></div>
        <div class="seg" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${S.tab === k}">${l}</button>`).join("")}</div><div class="tabs-body" id="tabBody">${tabBody(c, m)}</div></div></div>
      <aside class="card" data-s><div class="card-head"><div><h2 class="h2">Up next</h2><p class="muted small">${c.modules.filter((x) => x.state === "done").length} of ${c.total} complete</p></div></div><div class="plist">${others.map((x) => { const lk = x.state === "locked" || x.state === "scheduled"; return `<button class="pl ${x.id === m.id ? "cur" : ""} ${lk ? "lockd" : ""} press" data-mod="${x.id}" data-course="${c.id}"><span class="node ${x.state}">${x.state === "done" ? ic("check") : lk ? ic("lock") : x.n}</span><span style="min-width:0"><span class="h3 clamp2" style="display:-webkit-box;font-size:14px">${esc(x.title)}</span><span class="muted small">${x.mins} min</span></span></button>`; }).join("")}</div></aside></div>`;
  }
  function tabBody(c, m) {
    if (S.tab === "notes") return `<div><textarea class="note" placeholder="Write a note. Notes save to this lesson." aria-label="Lesson notes"></textarea><div style="display:flex;justify-content:flex-end;margin-top:10px"><button class="btn ghost sm press" data-toast="Note saved">Save note</button></div></div>`;
    if (S.tab === "resources") return `<div>${["Lesson slides.pdf", "Worksheet " + m.n + ".pdf"].map((f) => `<div class="list-item"><span class="ico">${ic("file")}</span><div class="grow"><div class="h3 trunc">${f}</div><div class="muted small">PDF</div></div><button class="btn ghost sm press" data-toast="Download started">${ic("download")} Download</button></div>`).join("")}</div>`;
    if (S.tab === "quiz") return `<div class="list-item"><span class="ico">${ic("target")}</span><div class="grow"><div class="h3">Lesson check · 5 questions</div><div class="muted small">Unlocks after you finish the video. Best score ${m.score ? m.score + "%" : "—"}</div></div><button class="btn ghost sm press" ${S.pl.done ? "" : "disabled"}>Start</button></div>`;
    return `<div><p style="color:var(--ink-2);max-width:68ch">In this lesson ${esc(c.tutor)} walks through the core idea step by step, then works two exam-style problems. Pause at the gold markers: each one is a short question that must be answered to continue.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><span class="chip">${m.mins} min</span><span class="chip">2 checkpoints</span><span class="chip accent">+40 XP</span></div></div>`;
  }

  function vClasses() {
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i - 2); return { off: i - 2, d }; });
    let list = DATA.classes.filter((c) => (S.cTab === "all" ? true : S.cTab === "upcoming" ? c.kind === "live" : c.kind === "recorded"));
    if (S.cDay !== null) list = list.filter((c) => c.off === S.cDay);
    list = list.sort((a, b) => (S.cTab === "recorded" ? b.off - a.off : a.off - b.off));
    const [h, m] = fmtCd(S.cd);
    const row = (c) => {
      const co = course(c.course) || { cover: "math" };
      const act = c.state === "soon" ? `<button class="btn primary press" data-toast="Joining the live room…">${ic("video")} Join class</button>` : c.state === "locked" ? `<span class="chip">${ic("lock")} Opens 15 min before</span>` : c.state === "missed" ? `<button class="btn ghost press" data-toast="Opening recording…">${ic("play")} Watch recording</button>` : `<button class="btn ghost press" data-toast="Opening recording…">${ic("play")} Rewatch</button>`;
      return `<div class="card sched" data-s style="padding:18px 22px"><div class="tm">${c.time}<small>${c.date.getDate()} ${mon[c.date.getMonth()]} · ${c.mins} min</small></div><div style="display:flex;gap:14px;min-width:0"><span class="bar-v" style="background:${D.covers[co.cover][0]}"></span><div style="min-width:0"><div class="h3 clamp2">${esc(c.title)}</div><div class="muted small trunc" style="margin-top:3px">${esc(c.tutor)} ${c.kind === "live" ? '· <span style="color:var(--accent);font-weight:600">Live</span>' : ""}${c.state === "soon" ? ` · starts in ${h}:${m}` : ""}${c.state === "missed" ? ' · <span style="color:var(--bad)">Missed</span>' : ""}</div></div></div>${act}</div>`;
    };
    return `<div class="view-head" data-s><div><h1 class="h1">Classes</h1><p class="sub">Live sessions and recordings from your tutors</p></div><div class="seg" role="group" aria-label="Class type">${[["upcoming", "Live"], ["recorded", "Recorded"], ["all", "All"]].map(([k, l]) => `<button data-ctab="${k}" aria-pressed="${S.cTab === k}">${l}</button>`).join("")}</div></div>
      <div class="days" data-s>${days.map(({ off, d }) => { const n = DATA.classes.filter((c) => c.off === off).length; return `<button class="day press" data-day="${off}" aria-pressed="${S.cDay === off}"><small>${off === 0 ? "Today" : dayN[d.getDay()]}</small><b>${d.getDate()}</b><span class="pip">${Array.from({ length: Math.min(n, 3) }, () => "<i></i>").join("")}</span></button>`; }).join("")}</div>
      ${list.length ? list.map(row).join("") : `<div class="card" data-s><div class="empty"><span class="ill">${ic("cal")}</span><b>${DATA.classes.length ? "No classes on this day" : "No classes scheduled"}</b><p>${DATA.classes.length ? "Pick another day or clear the date filter." : "New sessions appear here once your tutor adds them."}</p>${S.cDay !== null ? '<button class="btn ghost press" data-act="clearday">Show all days</button>' : ""}</div></div>`}`;
  }

  function vRank() {
    const rows = DATA.board[S.period].map(([n, xp], i) => ({ n, xp, i, tr: [2, 0, -1, 1, 0, 3, -2, 0, 1, -1][(i + S.period.length) % 10] }));
    const youIdx = rows.findIndex((r) => r.n === DATA.student.name || r.n.startsWith("Aanya"));
    const lab = { week: "This week", month: "This month", all: "All time" }[S.period];
    const pod = [1, 0, 2].map((k) => rows[k]).filter(Boolean);
    const heights = { 0: 150, 1: 110, 2: 82 };
    return `<div class="view-head" data-s><div><h1 class="h1">Leaderboard</h1><p class="sub">${youIdx >= 0 ? `You're ${youIdx + 1}${["st", "nd", "rd"][youIdx] || "th"} of ${num(1284)} students` : "Earn XP by finishing lessons and quizzes"}</p></div>
      <div style="position:relative"><button class="btn ghost press" data-act="period" aria-haspopup="menu">${ic("clock")} ${lab} ${ic("chevD")}</button>${S.popover === "period" ? `<div class="pop" role="menu" style="top:48px;right:0">${[["week", "This week"], ["month", "This month"], ["all", "All time"]].map(([k, l]) => `<button role="menuitemradio" aria-checked="${S.period === k}" data-period="${k}">${l}${S.period === k ? ic("check") : ""}</button>`).join("")}</div>` : ""}</div></div>
      <div class="podium" data-s>${pod.map((r) => `<div class="pod p${r.i + 1}">${r.i === 0 ? ic("crown", "crown") : '<span style="height:24px"></span>'}<span class="avatar" style="background:${["#3d7bff", "linear-gradient(140deg,#8b97b5,#c7d0e6)", "linear-gradient(140deg,#7c5cff,#a78bfa)"][r.i]}">${esc(initials(r.n))}</span><div class="nm clamp2" style="width:100%;font-size:14.5px">${esc(r.n)}</div><div class="sc">${num(r.xp)} XP</div><div class="step" style="--h:${heights[r.i]}px;--bd:${300 + r.i * 80}ms">${r.i + 1}</div></div>`).join("")}</div>
      <section class="card table" data-s>${rows.map((r) => { const me = r.i === youIdx; return `<div class="trow ${me ? "me" : ""}"><span class="rk">${r.i + 1}</span><span class="avatar">${esc(initials(r.n))}</span><span style="min-width:0"><span class="h3 trunc" style="display:block">${esc(r.n)}${me ? ' <span class="chip accent" style="height:20px;margin-left:6px">You</span>' : ""}</span></span><span class="trend ${r.tr > 0 ? "up" : r.tr < 0 ? "down" : "flat"} hide-s">${ic(r.tr > 0 ? "up" : r.tr < 0 ? "down" : "minus")}${r.tr ? Math.abs(r.tr) : "—"}</span><span style="text-align:right;font-weight:600">${num(r.xp)} <span class="muted small">XP</span></span></div>`; }).join("")}</section>`;
  }

  function vProfile() {
    const st = DATA.student, s = S.settings;
    const doneAll = DATA.courses.reduce((a, c) => a + c.modules.filter((m) => m.state === "done").length, 0);
    const info = [["mail", st.email], ["phone", st.phone], ["pin", st.location], ["school", st.school], ["cal", "Joined " + st.joined]];
    const tg = (k, t, d) => `<div class="setting"><div style="min-width:0"><div class="h3">${t}</div><div class="muted small">${d}</div></div><button class="toggle" role="switch" aria-checked="${s[k]}" aria-label="${t}" data-set="${k}"></button></div>`;
    return `<div class="view-head" data-s><div><h1 class="h1">Profile</h1><p class="sub">Your account and learning record</p></div><span class="chip good">${ic("shield")} Verified student</span></div>
      <div class="prof"><div class="stack"><section class="card p-card" data-s><span class="avatar">${esc(initials(st.name))}</span><h2 class="h2" style="max-width:100%;overflow-wrap:anywhere">${esc(st.name)}</h2><p class="muted">${esc(st.grade)}</p><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;justify-content:center"><span class="chip accent">Level ${st.level}</span><span class="chip sun">${ic("flame")} ${st.streak}-day streak</span></div>
        <div class="info">${info.map(([i, t]) => `<div>${ic(i)}<span class="trunc" title="${esc(t)}" style="flex:1">${esc(t)}</span></div>`).join("")}</div></section>
        <section class="card" data-s><h2 class="h2" style="margin-bottom:4px">Notifications</h2>${tg("remind", "Class reminders", "15 minutes before live classes")}${tg("streak", "Streak nudges", "A reminder if you haven't studied by 8 PM")}${tg("email", "Weekly summary email", "Progress and upcoming deadlines")}</section></div>
      <div class="stack"><section class="card" data-s style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;text-align:center">${[[doneAll, "Lessons done"], [num(st.xp), "Total XP"], ["#" + st.rank, "Weekly rank"]].map(([v, l]) => `<div><div class="h1" style="font-size:28px">${v}</div><div class="muted small">${l}</div></div>`).join("")}</section>
        <section class="card" data-s><div class="card-head"><div><h2 class="h2">Activity</h2><p class="muted small">Lessons completed, last 17 weeks</p></div><div class="legend">Less ${[0, 1, 2, 3, 4].map((l) => `<i style="background:${["var(--line-2)", "#d9dcff", "#a9b0ff", "#6b78fa", "var(--accent)"][l]}"></i>`).join("")} More</div></div><div class="heat" role="img" aria-label="Activity heatmap">${DATA.heat.map((l, k) => `<i data-l="${l}" style="--k:${k}"></i>`).join("")}</div></section>
        <section class="card" data-s><div class="card-head"><h2 class="h2">Badges</h2><span class="muted small">${DATA.badges.filter((b) => b.got).length} of ${DATA.badges.length} earned</span></div><div class="badges">${DATA.badges.map((b) => `<div class="bdg ${b.got ? "" : "off"}"><span class="ico">${ic("award")}</span><div><div class="h3">${b.n}</div><div class="muted small">${b.d}</div></div>${b.got ? '<span class="chip good" style="align-self:flex-start">Earned</span>' : `<div class="bar" style="--p:${b.p / 100}"><i></i></div>`}</div>`).join("")}</div></section>
        <section class="card" data-s style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap"><div style="min-width:0"><div class="h3">Delete account</div><div class="muted small">Permanently removes your progress and certificates.</div></div><button class="btn ghost press" style="color:var(--bad)" data-act="delete">${ic("trash")} Delete account</button></section></div></div>`;
  }

  /* ---------- router + render ---------- */
  const routes = { dashboard: vDashboard, courses: (id) => (id ? vCourse(id) : vCourses()), learn: vPlayer, classes: vClasses, rank: vRank, profile: vProfile };
  let route = "/dashboard", lastKey = "";
  function render(animate = false) {
    const parts = (location.hash.replace(/^#/, "") || "/dashboard").split("/").filter(Boolean);
    route = "/" + parts.join("/");
    const fn = routes[parts[0]] || vDashboard;
    stopTick();
    view.className = "view" + (animate ? " enter" : " in");
    view.innerHTML = fn(parts[1], parts[2]);
    renderChrome(route);
    if (animate) {
      $$("[data-s]", view).forEach((el, i) => el.style.setProperty("--d", Math.round(55 * Math.pow(i, 0.82)) + "ms"));
      requestAnimationFrame(() => requestAnimationFrame(() => view.classList.add("in")));
      window.scrollTo({ top: 0 });
    }
    if (parts[0] === "learn" && S.pl) { syncPlayer(); }
    document.title = "Skillmount Learn · " + (parts[0] || "dashboard");
  }
  const rerender = () => render(false);

  /* countdown */
  setInterval(() => { if (S.cd > 0) S.cd--; const [h, m, s] = fmtCd(S.cd); $$("[data-cd]").forEach((el) => (el.textContent = { h, m, s }[el.dataset.cd])); }, 1000);

  /* ---------- player engine ---------- */
  let tick = null;
  const stopTick = () => { clearInterval(tick); tick = null; };
  function secs() { const [cid] = S.pl.id.split("-"); const c = course(cid); const m = c.modules.find((x) => x.id === S.pl.id); return m.mins * 60; }
  function syncPlayer() {
    const pl = S.pl; if (!pl || !$("#doneBtn")) return;
    $("#doneBtn").className = `btn ${pl.done ? "ghost" : "primary"} press`; $("#doneBtn").innerHTML = `${ic("check")} ${pl.done ? "Completed" : "Mark complete"}`;
  }
  function play() {}
  function seekTo(clientX) {
    const r = $("#scrub .tr").getBoundingClientRect(); let p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    if (!S.pl.done) p = Math.min(p, Math.min(1, S.pl.max + 0.02));            // can't skip ahead of what's watched
    S.pl.t = p; syncPlayer();
  }
  function finishLesson() {
    if (S.pl.done) return; S.pl.done = true;
    const [cid] = S.pl.id.split("-"); const c = course(cid), m = c.modules.find((x) => x.id === S.pl.id); m.state = "done"; m.pct = 100; m.score = m.score || 90;
    const nx = c.modules[m.n]; if (nx && nx.state === "scheduled") nx.state = "open"; else if (nx && nx.state === "locked") nx.state = "open";
    c.pct = Math.round((c.modules.filter((x) => x.state === "done").length / c.total) * 100);
    toast("Lesson complete · +40 XP"); burst(); syncPlayer();
  }

  /* ---------- overlays ---------- */
  const layer = $("#layer");
  function closeLayer(sel, cb) { const el = $(sel, layer); if (!el) return; el.classList.add("out"); setTimeout(() => { el.remove(); cb && cb(); }, 170); }
  function modal(html, onClose) {
    const el = document.createElement("div"); el.className = "scrim"; el.innerHTML = `<div class="modal" role="dialog" aria-modal="true" style="position:relative">${html}</div>`;
    el.addEventListener("pointerdown", (e) => { if (e.target === el) closeLayer(".scrim", onClose); });
    layer.appendChild(el); const f = $("button", el); f && f.focus({ preventScroll: true }); return el;
  }
  function toast(msg) { $$(".toast", layer).forEach((t) => t.remove()); const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.innerHTML = ic("check") + `<span>${esc(msg)}</span>`; layer.appendChild(t); setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 200); }, 2400); }
  function burst() { const c = document.createElement("div"); c.className = "confetti"; const cols = ["#3d7bff", "#5b93ff", "#9bbcff", "#fbbf24", "#34d399"]; c.innerHTML = Array.from({ length: 36 }, (_, i) => `<i style="left:${10 + Math.random() * 80}%;background:${cols[i % 5]};--dx:${(Math.random() - .5) * 240}px;--rot:${Math.random() * 720}deg;--t:${1.6 + Math.random() * 1.1}s;--dl:${Math.random() * 0.25}s"></i>`).join(""); layer.appendChild(c); setTimeout(() => c.remove(), 3200); }
  function openQuestion() {
    let pick = null;
    const el = modal(`<span class="chip accent">Checkpoint</span><h2 class="h1" style="font-size:22px;margin:14px 0 6px">Which statement is true?</h2><p class="muted" style="margin-bottom:18px">Answer to keep watching. You can retry if you miss.</p>
      ${["The derivative gives the slope of the tangent", "A continuous function is always differentiable", "Every limit exists at every point"].map((o, i) => `<button class="opt press" role="radio" aria-checked="false" data-o="${i}"><span class="rd"></span><span>${o}</span></button>`).join("")}
      <button class="btn primary press" style="width:100%;margin-top:18px" id="qGo" disabled>Check answer</button>`);
    el.addEventListener("click", (e) => {
      const o = e.target.closest(".opt"); if (o) { pick = +o.dataset.o; $$(".opt", el).forEach((x) => { x.setAttribute("aria-checked", x === o); x.classList.remove("no"); }); $("#qGo", el).disabled = false; return; }
      if (e.target.closest("#qGo")) { const opt = $$(".opt", el)[pick]; if (pick === 0) { opt.classList.add("ok"); setTimeout(() => closeLayer(".scrim", () => play(true)), 650); } else { opt.classList.add("no"); opt.setAttribute("aria-checked", "false"); } }
    });
  }
  function openStreak() {
    const st = DATA.student;
    modal(`<div class="fire"><span class="big">${ic("flame")}</span><div><b>${plural(st.streak, "day", "days")}</b><span class="muted small">Longest ${st.longest}</span></div></div><p class="muted" style="margin-bottom:16px">Open any lesson each day to keep your streak. Miss a day and it resets.</p>
      <div class="streak-week">${["M", "T", "W", "T", "F", "S", "S"].map((d, i) => `<div class="sd ${i < 5 ? "done" : i === 5 ? "today" : ""}"><i>${i < 5 ? ic("check") : i === 5 ? st.streak : ""}</i>${d}</div>`).join("")}</div>
      ${[["7 days", "Bronze flame", 1], ["14 days", "Silver flame", 0], ["30 days", "Gold flame", 0]].map(([d, n, on]) => `<div class="list-item"><span class="ico" style="${on ? "background:var(--sun-soft);color:#c98200" : ""}">${ic("award")}</span><div class="grow"><div class="h3">${n}</div><div class="muted small">${d}</div></div>${on ? '<span class="chip good">Earned</span>' : `<span class="chip">${d === "14 days" ? 2 + " to go" : st.streak < 30 ? 30 - st.streak + " to go" : ""}</span>`}</div>`).join("")}
      <button class="btn primary press" style="width:100%;margin-top:18px" data-act="closem">Keep going</button>`);
  }
  function openNotif() {
    closeNotif(true);
    const list = S.notifs || (S.notifs = DATA.notices.map((n) => ({ ...n })));
    const el = document.createElement("div"); el.className = "notif"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Notifications");
    const body = () => `<div class="nh"><h2 class="h2">Notifications</h2><button class="link press" data-act="readall">Mark all read</button></div><div style="max-height:min(60vh,440px);overflow:auto;padding-bottom:8px">${list.length ? list.map((n) => `<button class="nitem press ${n.unread ? "unread" : ""}" data-n="${n.id}"><span class="ico">${ic({ class: "video", rank: "trophy", file: "file", quiz: "target", streak: "flame" }[n.type])}</span><span style="min-width:0"><span class="h3 clamp2" style="display:-webkit-box;font-size:14px">${esc(n.t)}</span><span class="muted small clamp2" style="display:-webkit-box">${esc(n.s)}</span></span><span class="muted small" style="white-space:nowrap">${n.ago}</span></button>`).join("") : `<div class="empty"><span class="ill">${ic("bell")}</span><b>You're all caught up</b><p>Class reminders and results show up here.</p></div>`}</div>`;
    el.innerHTML = body(); el._body = body; layer.appendChild(el);
  }
  function closeNotif(instant) { const el = $(".notif", layer); if (!el) return; if (instant) el.remove(); else { el.classList.add("out"); setTimeout(() => el.remove(), 150); } }

  /* ---------- events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t.closest(".notif") && !t.closest('[data-act="notif"]')) closeNotif();
    if (S.popover && !t.closest(".pop") && !t.closest('[data-act="period"]') && !t.closest('[data-act="taskmenu"]')) { S.popover = null; rerender(); }
    const nav = t.closest("[data-nav]"); if (nav) { location.hash = nav.dataset.nav; return; }
    const mod = t.closest("[data-mod]");
    if (mod) { const c = course(mod.dataset.course), m = c.modules.find((x) => x.id === mod.dataset.mod); if (m.state === "locked" || m.state === "scheduled") { toast(lockText(m)); return; } S.tab = "overview"; location.hash = `#/learn/${c.id}/${m.id}`; return; }
    const ts = t.closest("[data-toast]"); if (ts) { toast(ts.dataset.toast); return; }
    const f = t.closest("[data-filter]"); if (f) { S.filter = f.dataset.filter; rerender(); return; }
    const ch = t.closest("[data-chart]"); if (ch) { S.chart = ch.dataset.chart; rerender(); return; }
    const ct = t.closest("[data-ctab]"); if (ct) { S.cTab = ct.dataset.ctab; rerender(); return; }
    const dy = t.closest("[data-day]"); if (dy) { const v = +dy.dataset.day; S.cDay = S.cDay === v ? null : v; rerender(); return; }
    const tab = t.closest("[data-tab]"); if (tab) { S.tab = tab.dataset.tab; $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b === tab)); const [cid] = S.pl.id.split("-"), c = course(cid); $("#tabBody").innerHTML = `<div>${tabBody(c, c.modules.find((x) => x.id === S.pl.id))}</div>`; return; }
    const pr = t.closest("[data-period]"); if (pr) { S.period = pr.dataset.period; S.popover = null; rerender(); return; }
    const st = t.closest("[data-set]"); if (st) { S.settings[st.dataset.set] = !S.settings[st.dataset.set]; st.setAttribute("aria-checked", S.settings[st.dataset.set]); return; }
    const nitem = t.closest("[data-n]"); if (nitem && S.notifs) { const n = S.notifs.find((x) => x.id === nitem.dataset.n); n.unread = false; nitem.classList.remove("unread"); renderChrome(route); return; }
    const wk = t.closest("[data-wk]"); if (wk) { S.wk += +wk.dataset.wk; rerender(); return; }
    const sl = t.closest("[data-sel]"); if (sl) { S.selDay = sl.dataset.sel; rerender(); return; }
    const tf = t.closest("[data-taskf]"); if (tf) { S.taskF = tf.dataset.taskf; S.popover = null; rerender(); return; }
    const cat = t.closest("[data-cat]"); if (cat) { S.q = cat.dataset.cat; $("#q").value = S.q; S.filter = "all"; if (location.hash !== "#/courses") location.hash = "#/courses"; else rerender(); renderChrome(route); return; }
    const th = t.closest("[data-theme]"); if (th) { S.dark = th.dataset.theme === "dark"; document.documentElement.classList.toggle("dark", S.dark); renderChrome(route); return; }
    const a = t.closest("[data-act]"); if (!a) return;
    switch (a.dataset.act) {
      case "collapse": S.collapsed = !S.collapsed; $("#app").classList.toggle("collapsed", S.collapsed); break;
      case "streak": openStreak(); break;
      case "closem": closeLayer(".scrim"); break;
      case "notif": if ($(".notif", layer)) closeNotif(); else openNotif(); break;
      case "readall": (S.notifs || []).forEach((n) => (n.unread = false)); { const el = $(".notif", layer); el.innerHTML = el._body(); } renderChrome(route); break;
      case "clearq": S.q = ""; $("#q").value = ""; rerender(); break;
      case "reset": S.q = ""; S.filter = "all"; $("#q").value = ""; rerender(); break;
      case "clearday": S.cDay = null; rerender(); break;
      case "period": S.popover = S.popover ? null : "period"; rerender(); e.stopPropagation(); break;
      case "taskmenu": S.popover = S.popover ? null : "task"; rerender(); e.stopPropagation(); break;
      case "join": toast("Joining your next live class…"); break;
      case "inlineplay": { const box = a.closest(".q-player"); box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1&rel=0&modestbranding=1" title="Lesson video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; box.classList.add("live"); break; }
      case "loadvideo": { const box = a.closest(".stage"); box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${a.dataset.yt}?autoplay=1&rel=0&modestbranding=1" title="Lesson video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; break; }
      case "complete": if (!S.pl.done) { S.pl.t = 1; S.pl.max = 1; play(false); finishLesson(); } break;
      case "delete": modal(`<div class="ill" style="width:52px;height:52px;border-radius:17px;background:var(--bad-soft);color:var(--bad);display:grid;place-items:center;margin-bottom:16px">${ic("trash")}</div><h2 class="h1" style="font-size:22px">Delete your account?</h2><p class="muted" style="margin:8px 0 22px">This removes your progress, XP and certificates. It can't be undone. (Demo only: nothing is deleted.)</p><div style="display:flex;gap:10px"><button class="btn ghost press" style="flex:1" data-act="closem">Keep account</button><button class="btn press" style="flex:1;background:var(--bad);color:#fff" data-act="closem">Delete</button></div>`); break;
    }
  });
  $("#q").addEventListener("input", (e) => { S.q = e.target.value; if (!route.startsWith("/courses") || route.split("/").length > 2) { location.hash = "#/courses"; } else rerender(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeNotif(); closeLayer(".scrim"); if (S.popover) { S.popover = null; rerender(); } }
  });

  /* data mode switch */
  function renderDev() {
    $("#dev .seg").innerHTML = [["demo", "Demo"], ["worst", "Worst case"], ["empty", "Empty"]].map(([k, l]) => `<button data-mode="${k}" aria-pressed="${mode === k}">${l}</button>`).join("");
  }
  $("#dev").addEventListener("click", (e) => { const b = e.target.closest("[data-mode]"); if (!b) return; mode = b.dataset.mode; DATA = applyDataMode(mode); S.notifs = null; S.pl = null; history.replaceState(null, "", mode === "demo" ? location.pathname + location.hash : `?data=${mode}${location.hash}`); renderDev(); closeNotif(true); if (route.startsWith("/learn")) location.hash = "#/courses"; else rerender(); });
  if (!url.has("dev") && !url.has("data")) { /* switch stays visible: it's a design-review aid */ }

  addEventListener("hashchange", () => { S.popover = null; render(true); });
  renderDev(); render(true);
})();
