# LMS Studio

A third design variant of the Skillmount student dashboard. Static UI only: mock data, no API calls, no auth.

## Run

```
npm install
npm run dev
```

Open http://localhost:5190/. `npm run build` writes a static copy to `dist/`.

## Stack

React, Vite, Tailwind CSS v4, shadcn-style components on Radix UI, Lucide icons, Schibsted Grotesk.

## Structure

- `src/data/`: mock content and stress-test scenarios
- `src/lib/`: store, router and formatting
- `src/components/ui/`: primitives
- `src/components/`: layout, day ribbon, course components
- `src/pages/`: Today, Courses, Course, Lesson, Schedule, Assignments, Leaderboard, Profile

## Stress testing

In development, a switch at the bottom of the screen swaps the data: demo, worst case, empty, one and 1,000+ rows. The choice is kept in the URL (`?data=worst`). Production builds do not include it.

Photos come from Unsplash, avatars from pravatar.cc and videos are YouTube placeholders, so they need a network connection. Each has a fallback.

## Deploy to Netlify

Create a separate Netlify project for this app and enter:

| Setting | Value |
| --- | --- |
| Base directory | `lms-studio` |
| Package directory | `lms-studio` |
| Build command | `npm run build` |
| Publish directory | `lms-studio/dist` |

`netlify.toml` in this folder sets the same build values. Setting the package directory makes Netlify read it instead of the file at the repo root, which belongs to the black theme. Node 22 is set in `.nvmrc`.
