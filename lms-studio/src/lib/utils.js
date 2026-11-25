import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

const nf = new Intl.NumberFormat("en-IN");
const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });
export const num = (n) => (Number.isFinite(n) ? nf.format(n) : "0");
export const short = (n) => (Number.isFinite(n) && n >= 100000 ? compact.format(n) : num(n));
const rules = new Intl.PluralRules("en");
export const plural = (n, one, many = `${one}s`) => `${num(n)} ${rules.select(n) === "one" ? one : many}`;
export const clampPct = (v) => Math.min(100, Math.max(0, Math.round(Number.isFinite(v) ? v : 0)));
export const ordinal = (n) => `${n}${{ one: "st", two: "nd", few: "rd", other: "th" }[new Intl.PluralRules("en", { type: "ordinal" }).select(n)]}`;

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const firstGrapheme = (word) => graphemes.segment(word)[Symbol.iterator]().next().value?.segment ?? "";
/** First + last word, skipping titles and suffixes. Falls back to "?" when there is no name. */
export function initials(name = "") {
  const words = name.trim().split(/\s+/).filter((w) => w && !/^(dr|mr|mrs|ms|jr|sr|ii|iii|iv)\.?$/i.test(w));
  if (!words.length) return "?";
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : [words[0]];
  return picked.map(firstGrapheme).join("").toUpperCase();
}

export const addDays = (offset) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset); return d; };
export const fmtDay = (d, opts = { weekday: "short", day: "numeric", month: "short" }) => new Intl.DateTimeFormat("en-GB", opts).format(d);
const rel = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
export const dueLabel = (offset) => (Math.abs(offset) > 13 ? fmtDay(addDays(offset), { day: "numeric", month: "short", year: "numeric" }) : rel.format(offset, "day"));

export const toMinutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
export const toClock = (mins) => `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
export const duration = (mins) => (mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h${mins % 60 ? ` ${mins % 60} min` : ""}`);
