import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { face } from "../data/mock.js";

export const num = (n) => n.toLocaleString("en-IN");
export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
export const initials = (name) => name.split(/\s+/).filter((w) => !/^(dr|jr|sr)\.?$/i.test(w)).map((w) => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join("").toUpperCase();
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const sameDay = (a, b) => a.toDateString() === b.toDateString();

export const SPRING = { type: "spring", duration: 0.42, bounce: 0.12 };

export function Avatar({ name, img, size = 40 }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials(name)}
      {img && !broken ? <img src={face(img)} alt="" loading="lazy" onError={() => setBroken(true)} /> : null}
    </span>
  );
}

export function Card({ title, sub, action, onOpen, openLabel, className = "", children, ...rest }) {
  return (
    <section className={`card ${className}`} {...rest}>
      {title ? (
        <header className="card-head">
          <div className="min0">
            <h2 className="h2">{title}</h2>
            {sub ? <p className="muted small">{sub}</p> : null}
          </div>
          {action}
          {onOpen ? <button className="icon-btn press" onClick={onOpen} aria-label={openLabel || `Open ${title}`}><ArrowUpRight size={18} /></button> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** Segmented control with a pill that slides between options. */
export function Segmented({ options, value, onChange, label }) {
  const id = useId();
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([key, text, count]) => (
        <button key={key} aria-pressed={value === key} onClick={() => onChange(key)}>
          {value === key ? <motion.span layoutId={`seg-${id}`} className="seg-pill" transition={SPRING} /> : null}
          <span className="seg-text">{text}{count != null ? <em>{count}</em> : null}</span>
        </button>
      ))}
    </div>
  );
}

export function Bar({ value, tone = "lime" }) {
  return (
    <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <i className={`fill-${tone}`} style={{ "--p": value / 100 }} />
    </div>
  );
}

export function Ring({ value, size = 96, stroke = 8, tone = "lime", children, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label || `${value}% complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ring-track" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={`ring-value stroke-${tone}`} style={{ "--c": c, "--o": c * (1 - value / 100) }} strokeDasharray={c} />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

export function Empty({ icon: Icon, title, body, action }) {
  return (
    <div className="empty">
      {Icon ? <span className="empty-icon"><Icon size={22} /></span> : null}
      <b>{title}</b>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  );
}

/** Accessible dialog: focus moves in, Escape and the scrim close it, focus returns afterwards. */
export function Dialog({ title, onClose, children, side = false }) {
  const ref = useRef(null);
  const titleId = useId();
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const before = document.activeElement;
    ref.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab") return;
      const items = ref.current.querySelectorAll("button:not([disabled]), input, select, textarea, a[href]");
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; before?.focus?.({ preventScroll: true }); };
  }, []);

  const panel = side
    ? { initial: { x: "104%" }, animate: { x: 0 }, exit: { x: "104%" }, transition: { duration: 0.34, ease: [0.32, 0.72, 0, 1] } }
    : { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } }, transition: SPRING };

  return (
    <motion.div className={`scrim ${side ? "side" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div ref={ref} className={side ? "drawer" : "modal"} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} {...panel}>
        <header className="dialog-head">
          <h2 id={titleId} className="h2">{title}</h2>
          <button className="icon-btn press" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        {children}
      </motion.div>
    </motion.div>
  );
}
