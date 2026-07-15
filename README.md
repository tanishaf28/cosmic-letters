# Cosmic Letters ✨

An anonymous message universe where people leave thoughts, wishes, confessions, and notes that float through cosmic space.

> *"Someone sent a thought into space and you discovered it."*

![Cosmic Letters](https://img.shields.io/badge/status-frontend--ready-8b5cf6?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Features

- **Write Cosmic Letters**: anonymous messages with emotion categories
- **Public Universe**: messages visible to everyone
- **Private Star Links**: unique shareable links for one person
- **Explore Lost Messages**: browse, search, filter, infinite scroll
- **Star Map**: interactive canvas map, click stars to read messages
- **Cosmic Weather**: random atmospheric status messages
- **Daily Cosmic Question**: prompts that rotate daily
- **AI Cosmic Reply**: comforting responses after posting (template-based)
- **Lost Stars**: messages older than 30 days fade visually
- **Anonymous Likes**: heart messages without login

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript (ES Modules, no build step) |
| Backend | Supabase (Postgres + Row Level Security) |

## Project Structure

```
cosmic-letters/
├── index.html              # Home / hero page
├── write.html              # Write a message
├── explore.html            # Browse messages
├── star-map.html           # Interactive star map
├── private.html            # View private star link
├── .env.example            # Reference for the Supabase values you'll need
├── package.json             # Only used for the Vercel build script below
├── scripts/
│   └── generate-supabase-config.js  # Writes supabaseClient.js from env vars on Vercel
├── README.md
└── src/
    ├── components/         # Reusable UI modules
    │   ├── background.js     # Nebula video background + starfield canvas
    │   ├── navigation.js
    │   ├── messageCard.js
    │   ├── starMap.js
    │   ├── cosmicWeather.js
    │   ├── dailyQuestion.js
    │   ├── cosmicReply.js
    │   ├── modal.js
    │   └── toast.js
    ├── pages/              # Page-specific logic
    │   ├── home.js
    │   ├── write.js
    │   ├── explore.js
    │   ├── star-map.js
    │   └── private.js
    ├── database/           # Data layer
    │   ├── constants.js
    │   ├── schema.sql        # Run once in the Supabase SQL editor
    │   ├── supabaseClient.example.js # Template: copy to supabaseClient.js
    │   ├── supabaseClient.js # Your real URL + anon key (gitignored)
    │   └── messages.js       # Supabase queries (all async)
    ├── assets/              # Compressed background video + poster
    ├── styles/
    │   ├── variables.css
    │   ├── base.css
    │   ├── animations.css
    │   ├── layout.css
    │   ├── components.css
    │   └── main.css
    ├── utils/
    │   └── helpers.js
    └── main.js             # Shared app initialization
```

## Quick Start

### Option 1: VS Code Live Server

1. Open the project folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

### Option 2: Python

```bash
cd cosmic-letters
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

### Option 3: Node.js

```bash
npx serve .
```

> **Note:** ES modules require a local server. Opening `index.html` directly in the browser won't work.

## Setting up Supabase

The app is wired to Supabase already; you just need your own project.

1. Create a free project at [supabase.com](https://supabase.com) (no credit
   card, and since this app has no login, Supabase's user-count limit never
   applies to it).
2. Open the SQL editor in your project dashboard, paste in the contents of
   [`src/database/schema.sql`](src/database/schema.sql), and run it. This
   creates the `messages` table, the Row Level Security policies, the two
   helper functions private links and likes rely on, and seeds a few
   starter messages.
3. In your project's **Settings -> API**, copy the **Project URL** and the
   **anon public** key.
4. Copy [`src/database/supabaseClient.example.js`](src/database/supabaseClient.example.js)
   to `src/database/supabaseClient.js` (same folder) and paste in your
   Project URL and anon key. That file is gitignored, so your values
   never get committed, even though the anon key itself is safe to
   expose (access is enforced by the RLS policies in `schema.sql`, not
   by keeping the key secret).
5. Reload the app. `explore.html` and `star-map.html` will now read live
   from your database, and `write.html` will insert real rows.

Prefer a different backend? Firebase Firestore's free tier is a solid
alternative (no user-count cap either): you'd replace the Supabase calls
in `src/database/messages.js` with Firestore equivalents; the rest of the
app (components, pages, styles) doesn't need to change.

## Deploying to Vercel

The site is static (no bundler), so Vercel just needs to know how to
regenerate `supabaseClient.js` at build time, since that file is
gitignored and won't be in your repo.

1. Push this repo to GitHub, then import it at
   [vercel.com](https://vercel.com) -> New Project.
2. Framework preset: **Other**. Build command: `npm run build`. Output
   directory: `.` (the project root).
3. In **Settings -> Environment Variables**, add `SUPABASE_URL` and
   `SUPABASE_ANON_KEY` with the same values you put in your local
   `supabaseClient.js`.
4. Deploy. The build runs
   [`scripts/generate-supabase-config.js`](scripts/generate-supabase-config.js),
   which writes `src/database/supabaseClient.js` from those two
   variables before Vercel serves the static files.

## Design

- **Theme:** Dark cosmic universe with glassmorphism over a real nebula video background
- **Colors:** Midnight black, deep purple, electric blue, soft pink, gold
- **Animations:** Canvas starfield, twinkling constellation star map, drifting dust, occasional shooting stars
- **Fonts:** Space Grotesk (display), Outfit (body), JetBrains Mono (IDs)
- **Mobile-first** responsive layout

### Background video credit

The background footage (`src/assets/nebula-bg.mp4` / `nebula-bg-mobile.mp4`) is
[Deep Space Nebula by Freepik](https://www.magnific.com/free-video/deep-space-nebula_3704188).
It was downscaled and re-encoded from the original 4K/190MB source to ~1080p at
a web-friendly bitrate (see `src/assets/`). Attribution is also shown live in the
app's bottom-left corner on every page.

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/index.html` | Hero, cosmic weather, daily question, preview |
| Write | `/write.html` | Message form with visibility & emotion picker |
| Explore | `/explore.html` | Filter, search, random, infinite scroll |
| Star Map | `/star-map.html` | Clickable interactive star canvas |
| Private | `/private.html?token=...` | View private star link messages |

## License

MIT. Built for portfolio and learning purposes.

---

*No login. No names. Just thoughts among the stars.* 🌌
