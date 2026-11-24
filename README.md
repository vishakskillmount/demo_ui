# Skillmount Learn: demo UI

Static design demo of the student LMS dashboard. UI only: mock data, no API calls, no auth.

## Run

No build step. Serve the folder and open it in a browser:

```
python -m http.server 5173
```

Then visit http://localhost:5173/. Add `?dev` to the URL for the Demo / Worst case / Empty data switch.

## Files

- `index.html`: page shell
- `styles.css`, `theme.css`, `dark.css`: base styles, layout theme, dark palette
- `data.js`: mock data
- `app.js`: views, routing and interactions
- `assets/`: Skillmount logo
