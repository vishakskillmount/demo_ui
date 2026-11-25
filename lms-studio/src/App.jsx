import { useEffect, useRef } from "react";
import { StoreProvider, useRoute } from "@/lib/store.jsx";
import { TooltipProvider } from "@/components/ui/index.jsx";
import { MobileNav, ScenarioSwitch, Sidebar, Toast, Topbar } from "@/components/Layout.jsx";
import Today from "@/pages/Today.jsx";
import { CourseDetail, Courses } from "@/pages/Courses.jsx";
import Lesson from "@/pages/Lesson.jsx";
import { Assignments, Schedule } from "@/pages/Planner.jsx";
import { Leaderboard, Profile } from "@/pages/People.jsx";

function Page({ route }) {
  const [page, a, b] = route;
  switch (page) {
    case "courses": return a ? <CourseDetail id={a} /> : <Courses />;
    case "lesson": return <Lesson courseId={a} lessonId={b} />;
    case "schedule": return <Schedule />;
    case "assignments": return <Assignments />;
    case "leaderboard": return <Leaderboard />;
    case "profile": return <Profile />;
    default: return <Today />;
  }
}

export default function App() {
  const route = useRoute();
  const key = route.join("/");
  const main = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    document.title = `${route[0][0].toUpperCase()}${route[0].slice(1)} · Skillmount Learn`;
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoreProvider>
      <TooltipProvider delayDuration={350} skipDelayDuration={400}>
        <button className="fixed -top-20 left-3 z-[70] rounded-lg bg-primary px-4 py-3 font-semibold text-primary-ink focus:top-3" onClick={() => main.current?.focus()}>Skip to content</button>
        <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] md:grid-cols-[76px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)]">
          <Sidebar route={route} />
          <div className="min-w-0">
            <Topbar />
            <main ref={main} tabIndex={-1} key={key} className="page-in mx-auto w-full max-w-[1280px] px-4 pt-6 pb-36 md:px-8 md:pb-20"><Page route={route} /></main>
          </div>
        </div>
        <MobileNav route={route} />
        <Toast />
        {import.meta.env.DEV ? <ScenarioSwitch /> : null}
      </TooltipProvider>
    </StoreProvider>
  );
}
