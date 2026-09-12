# Evan Hypertrophy v4.1

Standalone PWA replacement for the current `Protozoa7.powerbuilding.io` GitHub Pages workout tracker.

## Program

Bodybuilding-first four-day split. Back squat and barbell deadlift remain the two main barbell anchors.

- Day 1 — Quads + Delts
- Day 2 — Back + Biceps
- Day 3 — Posterior Chain
- Day 4 — Chest + Delts + Triceps

Working sets use objective rep thresholds instead of RIR:

- Below minimum reps → reduce the next set
- Minimum through one rep below progression threshold → hold weight
- Hit progression threshold or higher → add weight
- No next-set suggestion after the final programmed set
- Squat/deadlift use technical failure; other working sets use clean rep failure

## New v4.1 features

- Automatic warm-up ladder for squat/deadlift barbell work
- Warm-up percentages: bar ×10, ~40% ×8, ~55% ×5, ~70% ×3, ~85% ×1
- Warm-ups automatically collapse duplicate/unnecessary load steps
- LB and KG barbell plate calculations shown together
- Exact plates per side
- Plate-change instructions from the previous warm-up/set
- Editable bar weights and plate inventories
- Last-session reference and suggested starting load
- Next-set load suggestions with one-tap apply
- Exercise substitutions
- Autosave, history, progress, rest timer, offline PWA, backup/restore

## Existing data

The app intentionally keeps using the existing history key:

`evanPowerbuildingHistoryV1`

So previously saved workout history remains visible after the update.

The active-session state uses a new key:

`evanBodybuildingStateV4`

This prevents an unfinished workout from the old program from being mapped onto the new exercises incorrectly.

## Replace the GitHub Pages files

Delete the old website files from the repository and copy the contents of this folder into the repository root:

- `index.html`
- `app.js`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- `README.md`
- `icons/icon.svg`

Commit and push to `main`. GitHub Pages should rebuild automatically.

The service worker uses cache name `evan-hypertrophy-v4.1.0.0`, so the old cached site should be replaced after the new service worker activates. If a phone still shows the old PWA, open the website once in Chrome/Safari and refresh, then fully close and reopen the installed app.


## v4.1 workout-screen changes

- Wider desktop training layout (mobile stays single-column)
- Squat/deadlift planned working weight moved to the top of the exercise card
- Warm-up ladder now reads as a numbered load sequence with exact plate changes
- Working-set barbell loads show plate setup beneath the set
- Readable `MIN X / ADD @ Y` prescription badge
- Last-time data, substitutions, and failure rule moved into a collapsible detail panel
- Completed exercises show a checkmark in the top stepper
- Smaller sticky rest-timer dock
- Planned-weight entry no longer re-renders on every keystroke
