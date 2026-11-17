# Stage hours

A small page for keeping track of internship hours. You pick your internship (the second one opens on 1 Feb 2027), set your first day, enter the hours you already have, then add each day you work. It shows when you will finish compared to the last day and how far you are from the required hours (620 for the first, 424 for the second).

Live: https://102381.github.io/stage_tracker/

The hours and dates are those of one school and one study programme. To use it for something else, change them at the top of `src/logic.js`. Open source under the MIT licence, see `LICENSE`.

Everything is stored in your own browser and nothing is sent anywhere. To move to another phone or laptop, use Backup in Settings. On a phone you can add it to the home screen, and it also works without a connection after the first visit.

## Working on it

The page is written in Vue 3 with Vite. The code is in `src/`:

- `src/logic.js` has the dates, the cleaning of saved data and the calculations (no Vue in it)
- `src/store.js` holds the state that all screens share
- `src/views/` has one file per screen, `src/components/` the small shared parts
- `src/texts.js` has the English and Dutch text
- the required hours and the dates of both internships are at the top of `src/logic.js`

```
npm install
npm run dev
```

GitHub Pages serves the repository root, so after a change run `npm run build` and commit the result (`index.html` and the `assets` folder) together with the source.
