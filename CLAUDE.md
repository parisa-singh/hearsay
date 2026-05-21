# CLAUDE.md — Hearsay Project Context

This file is the canonical reference for Claude Code sessions working on Hearsay.
Read this file first before doing anything else in a new session.

---

## Project Overview

**Hearsay** is a cross-platform review aggregator that queries 7 major platforms in parallel and synthesizes the results with Claude AI. Users search for any product, restaurant, or place and get:
- A 3–4 sentence AI "The Hearsay" summary across all platforms
- Recurring themes (positive and negative) as visual tags
- A divergence alert when platforms strongly disagree
- A fake review risk signal
- Reviews split into Global and Near You (location-aware) tabs

**Mission**: Make review bias visible. Most people get one platform's view. Hearsay shows the full picture.

**Live URL**: https://parisa-singh.github.io/hearsay
**GitHub**: https://github.com/parisa-singh/hearsay

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Vite + React | Vite 5, React 18 |
| Language | JavaScript (not TypeScript) | ES2022+ |
| Styling | Tailwind CSS + shadcn/ui | Tailwind 3 |
| Server state | TanStack Query | v5 |
| UI state | Zustand | v4 |
| Charts | Recharts | v2 |
| Routing | React Router | v6 |
| Serverless API | Cloudflare Workers | itty-router v4 |
| AI synthesis | Claude API | claude-sonnet-4-20250514 |
| Deployment | GitHub Actions → GitHub Pages | peaceiris/actions-gh-pages@v3 |

---

## Architecture

```
https://parisa-singh.github.io/hearsay   ← GitHub Pages (static Vite build)
        ↕ HTTPS fetch to Cloudflare Workers
https://hearsay-api.<subdomain>.workers.dev
        ↕
GET  /google        → Google Places API (Place Search + Place Details)
GET  /yelp          → Yelp Fusion API (Business Search + Reviews)
GET  /reddit        → Reddit OAuth API (client credentials + KV-cached token)
GET  /youtube       → YouTube Data API v3 (Search + Videos + CommentThreads)
GET  /tripadvisor   → SerpAPI (TripAdvisor engine, 24hr cache)
GET  /facebook      → SerpAPI fallback (labeled "Facebook Mentions")
GET  /trustpilot    → Trustpilot page fetch + JSON-LD extraction
POST /synthesize    → Claude API (claude-sonnet-4-20250514)
```

**Critical architectural details**:
- `vite.config.js` sets `base: '/hearsay/'` — required for GitHub Pages subdirectory hosting
- `public/404.html` contains the spa-github-pages redirect script — enables React Router on direct URL access
- Cloudflare Workers CORS: `Access-Control-Allow-Origin: https://parisa-singh.github.io`
- All API secrets stored via `wrangler secret put` — never in `.env` files or code
- Parallel fetching uses `Promise.allSettled()` — individual platform failures don't block others

---

## File Structure

```
hearsay/
├── .github/workflows/deploy.yml    ← GitHub Actions: build + deploy to gh-pages branch
├── .env.example                    ← Template for VITE_API_BASE_URL (commit this)
├── .env.local                      ← Actual values (GITIGNORED — never commit)
├── vite.config.js                  ← base: '/hearsay/', React plugin
├── tailwind.config.js              ← Custom colors, animation config
├── index.html                      ← App shell + spa-github-pages history script
├── CLAUDE.md                       ← This file
├── README.md                       ← Public documentation
├── public/
│   ├── 404.html                    ← SPA routing fix for GitHub Pages
│   └── logos/                      ← Platform SVG logos (google, yelp, reddit, youtube, etc.)
├── src/
│   ├── main.jsx                    ← React root with QueryClientProvider
│   ├── App.jsx                     ← createBrowserRouter with all routes
│   ├── pages/
│   │   ├── HomePage.jsx            ← Search bar, platform toggles, location badge
│   │   ├── ResultsPage.jsx         ← All results: summary, tabs (Global/Near You), cards, chart
│   │   ├── AboutPage.jsx           ← Project story and mission
│   │   └── NotFoundPage.jsx        ← On-brand 404
│   ├── components/
│   │   ├── layout/Header.jsx       ← Logo + dark/light toggle
│   │   ├── layout/Footer.jsx       ← Attribution + GitHub link
│   │   ├── search/SearchBar.jsx    ← Controlled input, navigates to /results?q=
│   │   ├── search/PlatformToggle.jsx  ← 7 platform chip toggles
│   │   ├── search/LocationBadge.jsx   ← Shows detected city + "Change" button
│   │   ├── results/HearSaySummary.jsx ← AI synthesis card
│   │   ├── results/ThemeTags.jsx      ← Positive/negative badge arrays
│   │   ├── results/DivergenceAlert.jsx ← Banner when platforms disagree
│   │   ├── results/FakeRiskBadge.jsx   ← Low/medium/high risk chip + tooltip
│   │   ├── results/PlatformCard.jsx    ← Single platform card
│   │   ├── results/ReviewItem.jsx      ← Individual review row
│   │   ├── results/PlatformGrid.jsx    ← Responsive card layout
│   │   ├── results/ComparisonChart.jsx ← Recharts RadarChart
│   │   ├── results/ReviewTabs.jsx      ← Global / Near You tab switcher
│   │   ├── results/LocalEmptyState.jsx ← "Not in [City] yet" animated empty state
│   │   ├── results/LocationErrorBanner.jsx ← Inline partial-failure note
│   │   └── ui/                         ← shadcn/ui generated components
│   ├── hooks/
│   │   ├── useAllPlatforms.js      ← TanStack Query useQueries over all enabled platforms
│   │   ├── useSynthesis.js         ← POST /synthesize once platform data settles
│   │   ├── usePlatformToggles.js   ← Zustand-backed enabled platform set
│   │   ├── useLocation.js          ← Geolocation + Nominatim reverse geocoding
│   │   └── useTheme.js             ← Dark/light toggle with localStorage
│   ├── utils/
│   │   ├── api.js                  ← Base fetch with 10s timeout + error normalization
│   │   ├── formatters.js           ← Rating display, date, text truncation
│   │   ├── platformConfig.js       ← Platform metadata (id, name, logo, endpoint, brand color)
│   │   ├── sentimentColor.js       ← Rating → Tailwind color class
│   │   └── citySubredditMap.js     ← City name → subreddit(s) mapping
│   ├── constants/
│   │   ├── platforms.js            ← PLATFORMS array (single source of truth)
│   │   └── queryKeys.js            ← TanStack Query key factories
│   └── store/
│       └── uiStore.js              ← Zustand: selectedPlatforms, searchHistory, theme, location
└── workers/
    ├── wrangler.toml               ← Worker name, main entry, nodejs_compat flag
    ├── package.json                ← itty-router dep, wrangler devDep
    └── src/
        ├── index.js                ← itty-router entry: OPTIONS first, all routes
        ├── routes/
        │   ├── google.js           ← Place Search → Place Details (lat/lng support)
        │   ├── yelp.js             ← Business Search → Reviews (lat/lng support)
        │   ├── reddit.js           ← OAuth token (Cloudflare KV cached) → search
        │   ├── youtube.js          ← Search → video details → commentThreads
        │   ├── tripadvisor.js      ← SerpAPI call (24hr Cloudflare Cache)
        │   ├── facebook.js         ← SerpAPI fallback ("mentions" not "reviews")
        │   ├── trustpilot.js       ← Page fetch → JSON-LD AggregateRating extraction
        │   └── synthesize.js       ← Claude API call + JSON response parsing
        └── utils/
            ├── cors.js             ← corsHeaders + handleOptions()
            ├── cache.js            ← Cloudflare Cache API wrapper with TTL
            └── errors.js           ← Standardized error response shape

```

---

## Platform Integration Details

| Platform | Method | Free Tier | Worker Endpoint | Location Support |
|---|---|---|---|---|
| Google | Google Places API | $200/mo credit | `GET /google` | Native: `location=<lat>,<lng>&radius=50000` |
| Yelp | Yelp Fusion API | 500 calls/day | `GET /yelp` | Native: `latitude=&longitude=` |
| Reddit | Reddit OAuth API | 100 req/min | `GET /reddit` | City subreddit map (r/nyc etc.) |
| YouTube | YouTube Data API v3 | 10,000 units/day | `GET /youtube` | City injected into query string |
| TripAdvisor | SerpAPI (TripAdvisor engine) | 100/mo shared | `GET /tripadvisor` | SerpAPI `location` param |
| Facebook | SerpAPI (Google/FB fallback) | 100/mo shared | `GET /facebook` | City injected into query |
| Trustpilot | Page fetch + JSON-LD | Free | `GET /trustpilot` | Global only, not in Near You |
| Claude | Anthropic API | Pay per use | `POST /synthesize` | Location field in POST body |

**SerpAPI note**: TripAdvisor and Facebook share 100 searches/month. Both default to OFF in platform toggles to conserve budget. 24hr Cloudflare Cache on both.

**YouTube note**: Search costs 100 units, video details 1 unit each. Budget: ~71 full queries/day. 2hr Cloudflare Cache on all YouTube responses.

**Reddit note**: OAuth token expires in 1hr. Token stored in Cloudflare KV with 55-min TTL and auto-refreshed.

---

## Environment Variables

**Frontend** (`.env.local`, never committed):
```
VITE_API_BASE_URL=https://hearsay-api.<subdomain>.workers.dev
```

**Workers** (set via `wrangler secret put <NAME>`):
```
GOOGLE_API_KEY
YELP_API_KEY
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
YOUTUBE_API_KEY
SERPAPI_KEY
ANTHROPIC_API_KEY
```

---

## Development Commands

```bash
# Frontend dev server (http://localhost:5173)
npm run dev

# Frontend production build
npm run build

# Workers local dev (http://localhost:8787)
cd workers && npx wrangler dev

# Deploy Workers to production
cd workers && npx wrangler deploy

# Add a Worker secret
cd workers && npx wrangler secret put <KEY_NAME>
```

---

## Deployment Process

**Frontend**: Automatic on push to `main`. GitHub Actions runs `npm ci && npm run build` then deploys `dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages@v3`. `VITE_API_BASE_URL` is injected from GitHub repo secrets during build.

**Workers**: Manual. Run `cd workers && npx wrangler deploy` from local machine. Workers have their own deployment pipeline separate from GitHub Actions.

---

## Claude API Synthesis

**Model**: `claude-sonnet-4-20250514`
**Input**: Aggregated review data (max 5 reviews per platform, 250 chars each) + search query + optional location
**Output JSON**:
```json
{
  "hearsay_summary": "3-4 sentence synthesis",
  "positive_themes": ["theme1", "theme2", "theme3", "theme4", "theme5"],
  "negative_themes": ["concern1", "concern2", "concern3"],
  "divergence": {
    "detected": true,
    "explanation": "...",
    "platform_a": "reddit",
    "platform_b": "google"
  },
  "fake_review_risk": {
    "level": "low | medium | high",
    "reasoning": "1-2 sentences"
  }
}
```
**Cost**: ~$0.007/query (input) + ~$0.004/query (output) ≈ $0.01/query

---

## Location Layer

- **Detection**: Browser `navigator.geolocation` → OpenStreetMap Nominatim reverse geocode (free, no API key)
- **Stored in**: Zustand `uiStore` + `localStorage` (persists across sessions)
- **Passed to Workers**: `?lat=<lat>&lng=<lng>&city=<city>&country=<country>` on all endpoints
- **Results split**: "Global" tab (all reviews) + "Near You" tab (location-filtered)
- **Empty state**: "Not in [City] yet" animated UI when Near You returns < 3 reviews
- **Trustpilot**: Global service only — never shown in Near You tab

---

## Known Issues and Decisions

- **Facebook Reviews**: Official Meta Graph API blocked for consumer apps without business verification. Showing "Facebook Mentions" via SerpAPI fallback. Labeled clearly in UI.
- **Trustpilot**: No public read API. Extracting data from JSON-LD `<script>` tags in page HTML. If Trustpilot changes their markup, this breaks — monitor.
- **Yelp reviews**: API hard-limits to 3 reviews, 160 chars each. Claude synthesis notes this in results.
- **SerpAPI budget**: 100 searches/month free. TripAdvisor + Facebook default to OFF. 24hr caching.
- **YouTube units**: ~71 full queries/day. 2hr caching. If demo goes viral, this is the first thing to break.

---

## Current Build Phase

**Phase 1 — In Progress** (Demoable MVP)

### Completed
- [x] GitHub repo created
- [x] README.md and CLAUDE.md written

### In Progress / Up Next
- [ ] Vite + React scaffold with Tailwind and shadcn/ui
- [ ] GitHub Actions deploy workflow
- [ ] 404.html SPA routing fix
- [ ] Cloudflare Workers project initialized
- [ ] HomePage (SearchBar, PlatformToggle, LocationBadge)
- [ ] Google, Reddit, YouTube Worker routes
- [ ] useAllPlatforms hook
- [ ] ResultsPage (PlatformGrid, PlatformCard)
- [ ] First deployment to https://parisa-singh.github.io/hearsay

---

## How to Resume a Session

1. Read this file (`CLAUDE.md`) completely
2. Check the "Current Build Phase" section above
3. Run `git log --oneline -10` to see recent commits
4. Run `npm run dev` (frontend) and `cd workers && npx wrangler dev` (Workers) to verify both start
5. Check `.env.local` exists with `VITE_API_BASE_URL` set
6. Check Cloudflare Workers secrets are set: `cd workers && npx wrangler secret list`
7. Continue from the first unchecked item in "In Progress / Up Next"
