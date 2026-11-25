// shadcn-style primitives: Radix behaviour, Tailwind styling, owned in this codebase.
import { forwardRef, useState } from "react";
import { cva } from "class-variance-authority";
import { Dialog as D, Popover as P, Switch as S, Tabs as T, ToggleGroup as G, Tooltip as Tip } from "radix-ui";
import { X } from "lucide-react";
import { face } from "@/data/demo.js";
import { clampPct, cn, initials } from "@/lib/utils.js";

export const buttonVariants = cva(
  "press inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-ink hover:bg-primary-hover",
        outline: "border border-line-strong bg-surface text-ink hover:bg-sunken",
        ghost: "text-muted hover:bg-sunken hover:text-ink",
        danger: "bg-bad text-surface hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { md: "h-11 px-4 text-sm", sm: "h-9 px-3 text-[13px]", icon: "size-11", link: "h-9 px-1 text-[13px]" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export const Button = forwardRef(({ className, variant, size, type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

export const Card = ({ className, ...props }) => <section className={cn("min-w-0 rounded-2xl border border-line bg-surface", className)} {...props} />;
export function CardHeader({ title, description, action, className }) {
  return (
    <header className={cn("flex items-start justify-between gap-3 px-5 pt-5 pb-3", className)}>
      <div className="min-w-0">
        <h2 className="text-[17px] font-semibold tracking-[-0.012em]">{title}</h2>
        {description ? <p className="mt-0.5 text-[13px] text-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

const badge = cva("inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 text-xs font-semibold", {
  variants: { tone: { neutral: "bg-sunken text-muted", good: "bg-tint text-tint-ink", warn: "bg-warn-tint text-warn", bad: "bg-bad-tint text-bad" } },
  defaultVariants: { tone: "neutral" },
});
export const Badge = ({ tone, className, ...props }) => <span className={cn(badge({ tone }), className)} {...props} />;

export function Progress({ value, label, className, course }) {
  const v = clampPct(value);
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-sunken", className)}>
      <div className={cn("fill h-full w-full rounded-full", course ? "bg-(--c)" : "bg-primary")} style={{ transform: `scaleX(${v / 100})` }} />
    </div>
  );
}

export function Avatar({ name, img, size = 36, className }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-tint font-semibold leading-none text-tint-ink", className)} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      <span aria-hidden="true">{initials(name)}</span>
      {img && !broken ? <img src={face(img)} alt="" loading="lazy" onError={() => setBroken(true)} className="absolute inset-0 size-full object-cover" /> : null}
    </span>
  );
}

/** Course photo with a solid course-colour fallback when the image is missing. */
export function Photo({ course, className, children }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={cn("hue relative overflow-hidden bg-(--c)", className)} style={{ "--cl": course.color[0], "--cd": course.color[1] }}>
      {broken ? <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-3xl font-bold text-white/80">{initials(course.title)}</span>
        : <img src={course.photo} alt="" loading="lazy" onError={() => setBroken(true)} className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out-strong group-hover:scale-[1.03] motion-reduce:transform-none" />}
      {children}
    </div>
  );
}

export const CourseDot = ({ course, className }) => <span aria-hidden="true" className={cn("hue inline-block size-2.5 shrink-0 rounded-[3px] bg-(--c)", className)} style={{ "--cl": course.color[0], "--cd": course.color[1] }} />;

export function Empty({ icon: Icon, title, body, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-5 py-10 text-center", className)}>
      {Icon ? <span className="mb-1 grid size-12 place-items-center rounded-xl bg-sunken text-muted"><Icon size={22} aria-hidden="true" /></span> : null}
      <p className="font-semibold">{title}</p>
      {body ? <p className="max-w-[38ch] text-sm text-muted">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function Dialog({ open, onOpenChange, title, description, children, className }) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="overlay fixed inset-0 z-50 bg-black/45 backdrop-blur-[3px]" />
        <D.Content className={cn("dialog fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-32px)] w-[min(480px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-2xl outline-none", className)}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <D.Title className="text-lg font-semibold tracking-[-0.015em]">{title}</D.Title>
              <D.Description className={cn("mt-1 text-sm text-muted", !description && "sr-only")}>{description || title}</D.Description>
            </div>
            <D.Close asChild><Button variant="ghost" size="icon" aria-label="Close" className="-mt-2 -mr-2"><X size={18} /></Button></D.Close>
          </div>
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

export function Popover({ trigger, children, className, open, onOpenChange, align = "end" }) {
  return (
    <P.Root open={open} onOpenChange={onOpenChange}>
      <P.Trigger asChild>{trigger}</P.Trigger>
      <P.Portal>
        <P.Content align={align} sideOffset={8} collisionPadding={12} className={cn("pop z-50 w-[min(360px,calc(100vw-24px))] rounded-2xl border border-line bg-surface p-2 shadow-xl outline-none", className)}>{children}</P.Content>
      </P.Portal>
    </P.Root>
  );
}

export function Tooltip({ label, children }) {
  return (
    <Tip.Root>
      <Tip.Trigger asChild>{children}</Tip.Trigger>
      <Tip.Portal><Tip.Content sideOffset={6} collisionPadding={12} className="pop z-50 max-w-[280px] rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium break-words text-bg">{label}</Tip.Content></Tip.Portal>
    </Tip.Root>
  );
}
export const TooltipProvider = Tip.Provider;

/** Underlined tabs with a single indicator that slides between them. */
export function Tabs({ value, onValueChange, items, children, className }) {
  const index = Math.max(0, items.findIndex(([k]) => k === value));
  return (
    <T.Root value={value} onValueChange={onValueChange} className={className}>
      <T.List className="relative grid border-b border-line" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, maxWidth: items.length * 132 }}>
        {items.map(([k, label]) => <T.Trigger key={k} value={k} className="h-11 truncate px-1 text-sm font-semibold text-muted transition-colors hover:text-ink data-[state=active]:text-ink">{label}</T.Trigger>)}
        <span aria-hidden="true" className="absolute -bottom-px left-0 h-0.5 bg-primary transition-transform duration-300 ease-drawer motion-reduce:transition-none" style={{ width: `${100 / items.length}%`, transform: `translateX(${index * 100}%)` }} />
      </T.List>
      {children}
    </T.Root>
  );
}
export const TabPanel = ({ className, ...props }) => <T.Content className={cn("page-in pt-4 outline-none", className)} {...props} />;

export function Segmented({ value, onValueChange, items, label }) {
  return (
    <G.Root type="single" value={value} onValueChange={(v) => v && onValueChange(v)} aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-xl bg-sunken p-1">
      {items.map(([k, text, count]) => (
        <G.Item key={k} value={k} aria-label={typeof text === "string" ? undefined : k} className="press inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold whitespace-nowrap text-muted hover:text-ink data-[state=on]:bg-surface data-[state=on]:text-ink data-[state=on]:shadow-sm">
          {text}{count != null ? <span className="font-medium text-muted">{count}</span> : null}
        </G.Item>
      ))}
    </G.Root>
  );
}

export const Switch = (props) => (
  <S.Root className="relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition-colors data-[state=checked]:bg-primary" {...props}>
    <S.Thumb className="block size-5 translate-x-1 rounded-full bg-surface shadow transition-transform duration-200 ease-drawer data-[state=checked]:translate-x-6" />
  </S.Root>
);

export const Input = forwardRef(({ className, ...props }, ref) => <input ref={ref} className={cn("h-11 w-full min-w-0 rounded-[10px] border border-line-strong bg-surface px-3 text-sm outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/25", className)} {...props} />);
Input.displayName = "Input";
