# LMS Learn, black theme variant

A separate React design variant of the Skillmount student dashboard. Static UI only: mock data, no API calls, no auth.

## Run

```
npm install
npm run dev
```

Open http://localhost:5180/. `npm run build` writes a static copy to `dist/`.

## Structure

- `src/data/mock.js`: all static content
- `src/state/`: local store and hash router
- `src/components/`: shell, UI primitives, widgets, course art, overlays
- `src/pages/`: Dashboard, Courses, Course, Lesson, Schedule, Tasks, Leaderboard, Profile
- `src/styles/`: tokens and styles

## Design notes

- True black canvas, near-black surfaces separated by hairlines.
- Lime is the action colour. Sky and butter mark categories and streaks.
- Outfit for headings and numerals, Figtree for body text. Icons are Lucide.
- Motion uses transform and opacity, and respects reduced motion.

Lesson videos are YouTube placeholders and avatars come from pravatar.cc, so both need a network connection.

## Deploy to Netlify

| Setting | Value |
| --- | --- |
| Base directory | `lms-black-theme` |
| Build command | `npm run build` |
| Publish directory | `dist`, relative to the base directory |

`netlify.toml` sets the build command and publish directory, so only the base directory has to be entered in Netlify. Node 22 is set in `.nvmrc`.
