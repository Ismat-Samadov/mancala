# MANCALA — Neon Pits

A full-stack browser implementation of the classic **Mancala** (Kalah rules) board game with a cyberpunk neon aesthetic. Built with Next.js 15 App Router, TypeScript strict mode, Tailwind CSS v4, and Framer Motion.

---

## Features

- **Full Mancala rule set** — sowing, extra turns, captures, game-end sweep, winner detection
- **AI opponent** with three difficulty tiers (Easy / Medium / Hard) using Minimax + Alpha-Beta pruning
- **Two game modes** — Player vs AI and Player vs Player (same screen)
- **Neon / cyberpunk theme** — animated starfield, glassmorphism cards, neon glow effects
- **Framer Motion animations** — pit interactions, score updates, screen transitions, AI thinking indicator
- **Web Audio API sound effects** — seed drop, capture fanfare, extra-turn jingle, win/lose cues, all synthesized (no audio files)
- **Mute toggle** — toggle sound on/off at any time
- **Pause / Resume** — pause mid-game and return exactly where you left off
- **High score persistence** — best scores saved to `localStorage`
- **Keyboard controls** — number keys `1–6`, Space, M, R, Escape
- **Touch & mobile friendly** — responsive across all screen sizes, no horizontal scroll
- **Themed SVG favicon** — matches the neon board aesthetic
- **Vercel deploy-ready** — zero extra configuration needed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Sound | Web Audio API (synthesized) |
| State | React hooks (`useState`, `useCallback`, `useEffect`, `useRef`) |
| AI | Minimax + Alpha-Beta pruning |
| Persistence | `localStorage` |
| Deploy | Vercel |

---

## Game Rules (Kalah)

The board has **6 pits per player** (starting with 4 seeds each) and a **store** (Kalah) on each end.

1. On your turn, pick any of your non-empty pits (bottom row).
2. Seeds are distributed **counter-clockwise**, one per pit/store.
3. **Extra turn** — if the last seed lands in your own store, play again.
4. **Capture** — if the last seed lands in an empty pit on your side and the opposite pit has seeds, capture both into your store.
5. **Game ends** when one side is completely empty. Remaining seeds go to the opposing player's store.
6. Player with the most seeds in their store **wins**.

---

## Controls

### Keyboard (desktop)

| Key | Action |
|---|---|
| `1` – `6` | Pick pit 1–6 on your side (P1 / bottom row) |
| `Space` | Pause / Resume |
| `Escape` | Pause / Resume |
| `M` | Toggle mute |
| `R` | Restart game |

### Mouse / Touch

- Click / tap any highlighted pit to make your move.
- Use the on-screen **PAUSE**, **SOUND**, and menu buttons.

---

## Run Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/Ismat-Samadov/mancala.git
cd mancala

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
npm start
```

---

## Deploy to Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Leave all settings as default (Next.js is auto-detected).
4. Click **Deploy** — done!

No environment variables or special configuration required.

---

## Project Structure

```
mancala/
├── app/
│   ├── globals.css        # Neon theme, keyframe animations, Tailwind import
│   ├── layout.tsx         # Root layout with metadata & favicon
│   └── page.tsx           # Main page: screen orchestration + keyboard shortcuts
├── components/
│   ├── GameBoard.tsx      # Full board (pits + stores arranged in grid)
│   ├── GameOverScreen.tsx # Animated win/lose/draw overlay
│   ├── HUD.tsx            # Scores, turn indicator, pause/mute buttons
│   ├── MenuScreen.tsx     # Start screen: mode, difficulty, high scores
│   ├── PauseScreen.tsx    # Pause overlay
│   ├── Pit.tsx            # Individual pit with seed dots and hover effects
│   ├── Starfield.tsx      # SSR-safe animated star background
│   └── Store.tsx          # Kalah store with animated count
├── hooks/
│   ├── useGame.ts         # Game state machine, AI scheduling, high score
│   └── useSound.ts        # Web Audio API sound effects
├── lib/
│   ├── aiPlayer.ts        # Minimax + Alpha-Beta AI
│   ├── constants.ts       # Board indices, colors, difficulty config
│   └── gameLogic.ts       # Pure game logic (sow, capture, game-over)
├── public/
│   └── favicon.svg        # Neon Mancala board favicon
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## License

ISC © [Ismat Samadov](https://github.com/Ismat-Samadov)
