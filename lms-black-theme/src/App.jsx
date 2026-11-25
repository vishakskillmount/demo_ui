import { useEffect, useRef } from "react";
import { MotionConfig } from "motion/react";
import { StoreProvider } from "./state/store.jsx";
import { useRoute } from "./state/router.js";
import { Sidebar, TabBar, Topbar } from "./components/Shell.jsx";
import Overlays from "./components/Overlays.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { CourseDetail, Courses } from "./pages/Courses.jsx";
import Lesson from "./pages/Lesson.jsx";
import { Schedule, Tasks } from "./pages/Planner.jsx";
import { Leaderboard, Profile } from "./pages/People.jsx";

function Page({ route }) {
  const [page, a, b] = route;
  switch (page) {
    case "courses": return a ? <CourseDetail id={a} /> : <Courses />;
    case "learn": return <Lesson key={b} courseId={a} lessonId={b} />;
    case "schedule": return <Schedule />;
    case "tasks": return <Tasks />;
    case "rank": return <Leaderboard />;
    case "profile": return <Profile />;
    default: return <Dashboard />;
  }
}

export default function App() {
  const route = useRoute();
  const key = route.join("/");
  const main = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    document.title = `Skillmount Learn · ${route[0]}`;
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoreProvider>
      <MotionConfig reducedMotion="user">
        <a className="skip" href="#content" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Skip to content</a>
        <div className="app">
          <Sidebar route={route} />
          <div className="app-main">
            <Topbar />
            <main id="content" ref={main} tabIndex={-1} className="page" key={key}>
              <Page route={route} />
            </main>
          </div>
        </div>
        <TabBar route={route} />
        <Overlays />
      </MotionConfig>
    </StoreProvider>
  );
}
