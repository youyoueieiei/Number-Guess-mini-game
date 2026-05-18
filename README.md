# Number Guessing Game

A small React + TypeScript web game where players guess a secret numeric code. Features:

- Play Solo (machine generates secret) or Two-player (A and B set private secrets).
- Secret length: 4 / 5 / 6 digits (selectable in the header).
- Difficulty:
  - Easy — shows "present / position" (how many digits are present anywhere, and how many are at the exact position).
  - Hard — shows only "position" (how many digits are in the correct position).
- Per-digit input UI (type directly into each digit box, paste to fill multiple digits, navigate with arrow keys/backspace).
- History log with per-guess feedback and language support (English / 中文).

This repo contains a small, responsive UI with unit tests for the core logic.

Quickstart
----------

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
# open http://localhost:5173
```

3. Run tests:

```bash
npm test
```

4. Build production:

```bash
npm run build
```

Notes on environment
--------------------
- Node: recent Node.js versions are recommended. Some packages (Vite/rolldown native bindings) may warn on uncommon Node versions; if you see native binding errors on Windows, running `npm install` again or installing the optional binding package resolves it (the repo already includes the optional binding entry).

How to play
-----------
- Choose "Solo" or "2 players".
- Choose code length (4 / 5 / 6). Changing the length does not interrupt a running game — pending length applies to the next new game. Click "New game" to apply the new length.
- Difficulty:
  - Easy: UI shows "present / position" for each guess (e.g. "2 / 1").
  - Hard: UI shows only the number of digits placed in the correct position (e.g. "1").
- Input:
  - Click a digit box and type a single digit (0–9).
  - Paste a multi-digit string into any box to fill subsequent boxes from that position.
  - Use left/right arrows to move between boxes. Backspace on an empty box moves to the previous box and clears it.

Two-player flow
---------------
1. Player A and Player B each set a masked secret in their panel (other player should look away).
2. Players type guesses in their panel and press Guess. Each guess evaluates against the opponent's secret.
3. When position count equals code length, the guesser wins and the game shows rounds taken.

Internals / Core logic
----------------------
- Core logic lives in `src/utils/game.ts`:
  - `generateSecret(length)` — random numeric secret of given length.
  - `validateGuess(value, length)` — ensures digits-only and exact length.
  - `evaluateGuess(secret, guess, length?)` — returns `{ presentCount, positionCount }`. presentCount handles duplicates correctly (counts per-digit multiplicity and sums minimums).

Project structure
-----------------
- src/
  - components/ — React components (Game, SoloMode, TwoPlayerMode, SecretInputModal)
  - utils/game.ts — core logic and validation
  - i18n.ts — simple translations (en / zh)
  - styles.css — global styles
- tests/ — unit tests for core functions and simple UI smoke tests

Testing & CI
------------
- Unit tests use Jest + ts-jest + React Testing Library.
- A GitHub Actions workflow is included at `.github/workflows/ci.yml` that runs tests and builds on push/PR.

Troubleshooting
---------------
- If Vite build complains about native bindings on Windows, re-run `npm install`. The repo marks the optional Windows binding as optional to avoid CI breakage on Linux.
- If tests fail due to TypeScript transform issues, ensure `npm install` completed and Node version matches the environment used for CI (recommend Node 20+ or 22+).

Contributing
------------
Feel free to open issues or PRs. Suggestions:
- Add color hints in history (green = correct position, blue = present-but-wrong-position).
- Add persistence (localStorage) for language/last mode.
- Add export/import of game history.

License
-------
MIT

Acknowledgements
----------------
Small utility app built with Vite + React + TypeScript.
