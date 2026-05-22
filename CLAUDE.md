# CLAUDE.md — Hearsay Project Context

This file is the canonical reference for Claude Code sessions working on Hearsay.
Read this file first before doing anything else in a new session.

---

## Project Overview

**Hearsay** is a cross-platform review aggregator that queries 7 major platforms in parallel and surfaces reviews side by side. Users search for any product, restaurant, or place and get:
- Reviews from Google, Yelp, Reddit, YouTube, TripAdvisor, Facebook, and Trustpilot
- Algorithmic divergence detection when platforms disagree by 1.5+ stars
- Reviews split into Global and Near You (location-aware) tabs
- Platform comparison chart (collapsible)

**No AI synthesis layer** — divergence is calculated algorithmically in `src/utils/divergence.js`.

**Mission**: Make review bias visible. Most people get one platform's view. Hearsay shows the full picture.

**Live URL**: https://parisa-singh.github.io/hearsay
**Worker URL**: https://hearsay-api.parisa-singh.workers.dev
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
| Deployment | GitHub Actions → GitHub Pages | Native actions/deploy-pages |

---

## Architecture

```
https://parisa-singh.github.io/hearsay   ← GitHub Pages (static Vite build)
        ↕ HTTPS fetch to Cloudflare Workers
https://hearsay-api.parisa-singh.workers.dev
        ↕
GET  /google        → Google Places API (textsearch + Place Details)
GET  /yelp          → Yelp Fusion API (Business Search + Reviews)
GET  /reddit        → Reddit OAuth API (client credentials + KV-cached token)
GET  /youtube       → YouTube Data API v3 (Search + Videos + CommentThreads)
GET  /tripadvisor   → SerpAPI (TripAdvisor engine, 24hr cache)
GET  /facebook      → SerpAPI fallback (labeled "Facebook Mentions")
GET  /trustpilot    → Trustpilot page fetch + JSON-LD extraction
```

**Critical architectural details**:
- `vite.config.js` sets `base: '/hearsay/'` — required for GitHub Pages subdirectory hosting
- `public/404.html` contains the spa-github-pages redirect script — enables React Router on direct URL access
- Cloudflare Workers CORS: allows `https://parisa-singh.github.io` and localhost
- All API secrets stored via `wrangler secret put` — never in code or git
- Parallel fetching: `useQueries` (TanStack Query) — one platform failing doesn't block others
- `VITE_API_BASE_URL` must be set as a GitHub Actions repo secret for production builds

---

## Environment Variables

**Frontend** (`.env.local`, gitignored):
```
VITE_API_BASE_URL=https://hearsay-api.parisa-singh.workers.dev
```
Also set as a GitHub Actions repo secret so builds pick it up.

**Workers** (set via `cd workers && npx wrangler secret put <NAME>`):
```
GOOGLE_API_KEY       — Google Cloud API key (Places API + YouTube Data API v3 enabled)
YELP_API_KEY         — Yelp Fusion API key
YOUTUBE_API_KEY      — Same key as GOOGLE_API_KEY
SERPAPI_KEY          — SerpAPI key (TripAdvisor + Facebook routes)
REDDIT_CLIENT_ID     — Reddit app client ID (skipped for now — policy acceptance required)
REDDIT_CLIENT_SECRET — Reddit app client secret (skipped for now)
```

---

## Platform Status

| Platform | Status | Notes |
|---|---|---|
| Google | Working | textsearch → Place Details |
| Yelp | Working | 3 reviews max, 160-char truncation enforced by Yelp API. Reviews endpoint sometimes returns 4xx for non-partner keys — card shows rating but no reviews text. |
| YouTube | Working | Comments + video descriptions as review signal |
| Reddit | Not working | No credentials — Reddit policy acceptance blocked sign-up. Route implemented, needs REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET |
| TripAdvisor | Working | SerpAPI; 24hr cache |
| Facebook | Working | SerpAPI fallback; labeled "Mentions"; 24hr cache |
| Trustpilot | Broken/partial | JSON-LD scraping from Trustpilot HTML. Frequently fails — Trustpilot blocks Workers' user agent or changes markup. Needs a real API approach. |
| Zomato | Not started | API deprecated 2020. Website is JS-rendered, scraping blocked. Needs a real partnership/API key or alternative approach. Currently coming-soon. |

## Future API Work (Priority Order)

These platforms are shown as "coming soon" in the UI. Implementation details:

### Reddit
- Route: `workers/src/routes/reddit.js` — fully implemented
- Needs: Accept Reddit Responsible Builder Policy at reddit.com/dev, then `wrangler secret put REDDIT_CLIENT_ID` and `wrangler secret put REDDIT_CLIENT_SECRET`
- No code changes required — just credentials

### Trustpilot
- Route: `workers/src/routes/trustpilot.js` — JSON-LD scraping, fragile
- Problem: Trustpilot blocks Cloudflare Worker user agents; markup changes break extraction
- Fix options: (1) Use Trustpilot's official Business API (requires business account), (2) SerpAPI has a Trustpilot engine, (3) Keep scraping but add better error handling and fallback

### Zomato
- No route yet. Zomato's public API was deprecated in 2020.
- Fix options: (1) Zomato Developer API (requires application + approval via developers.zomato.com), (2) SerpAPI may index Zomato results
- Currently shown as coming-soon chip in India/Middle East regional views

### JustDial, Magicpin (India)
- No routes. No public APIs available.
- Would require web scraping or partnership — low priority

### OpenTable, Foursquare (US/EU)
- OpenTable: Has an affiliate API but requires partnership approval
- Foursquare: Has Places API (free tier) — most actionable next step for US/EU regions

### TheFork, Michelin (Europe)
- TheFork: No public API. Web scraping possible but fragile.
- Michelin: No public API. Static data (Michelin star status) could be hardcoded.

### GrabFood, Agoda, Wongnai, Chope (SE Asia)
- All require local developer accounts or partnerships. Low priority.

### China platforms (Dianping, Meituan, Baidu Maps, Gaode, Xiaohongshu, WeChat)
- All require Chinese developer accounts/business registration. Not feasible without local entity.

### Talabat, Rappi, Degusta (Middle East / LATAM)
- No public APIs. Low priority.

---

## Key UI Decisions

- **Platform ordering**: Working platforms (data returned) appear first; loading states second; errors last. Sorted in `PlatformGrid.jsx`.
- **Comparison chart**: Collapsible toggle (`ComparisonChart.jsx`), collapsed by default. Only shows if 2+ platforms have star ratings.
- **Reviews per card**: 3 reviews shown, each truncated at 120 chars with inline "Show more / Show less" toggle (`ReviewItem.jsx`).
- **See more reviews**: Each card has a "See more reviews on [Platform]" link at the bottom. Uses `sourceUrl` from API response where available; falls back to constructed search URLs for Reddit and YouTube.
- **No per-review external links**: Individual reviews don't link out to platform pages — only the card-level "See more reviews" link does. This prevents accidental redirects (was a Yelp UX issue).
- **Divergence**: Algorithmic — flags 1.5+ star gap between highest and lowest rated platforms (`src/utils/divergence.js`).

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

# Add/update a Worker secret
cd workers && npx wrangler secret put <KEY_NAME>

# List Worker secrets
cd workers && npx wrangler secret list
```

---

## Deployment Process

**Frontend**: Push to `main` → GitHub Actions auto-builds (`npm ci && npm run build`) → deploys `dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages`. `VITE_API_BASE_URL` injected from GitHub repo secret during build.

**Workers**: Manual — `cd workers && npx wrangler deploy`. Secrets are live immediately after `wrangler secret put`, no redeploy needed.

---

## File Structure

```
hearsay/
├── .github/workflows/deploy.yml    ← GitHub Actions: build + deploy to GitHub Pages
├── .env.example                    ← Template for VITE_API_BASE_URL (committed)
├── .env.local                      ← Actual values (GITIGNORED)
├── vite.config.js                  ← base: '/hearsay/', React plugin
├── tailwind.config.js              ← Custom colors, animation config
├── index.html                      ← App shell + spa-github-pages history script
├── public/
│   ├── 404.html                    ← SPA routing fix for GitHub Pages
│   └── logos/                      ← Platform SVG logos
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx            ← Search bar, platform toggles, location badge
│   │   ├── ResultsPage.jsx         ← Results: divergence alert, chart, tabs, cards
│   │   ├── AboutPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── components/
│   │   ├── layout/Header.jsx
│   │   ├── layout/Footer.jsx
│   │   ├── search/SearchBar.jsx
│   │   ├── search/PlatformToggle.jsx
│   │   ├── search/LocationBadge.jsx
│   │   ├── results/DivergenceAlert.jsx  ← Shown when 2+ platforms differ by 1.5+ stars
│   │   ├── results/ComparisonChart.jsx  ← Collapsible RadarChart + bar comparison
│   │   ├── results/PlatformGrid.jsx     ← Sorts working platforms first; passes query prop
│   │   ├── results/PlatformCard.jsx     ← Card with 3 reviews + "See more" link
│   │   ├── results/ReviewItem.jsx       ← Truncated review with Show more/less toggle
│   │   ├── results/ReviewTabs.jsx       ← Global / Near You tab switcher
│   │   └── results/LocalEmptyState.jsx  ← "Not in [City] yet" animated empty state
│   ├── hooks/
│   │   ├── useAllPlatforms.js      ← TanStack Query useQueries parallel fetch
│   │   └── useLocation.js          ← Geolocation + Nominatim reverse geocoding
│   ├── utils/
│   │   ├── api.js                  ← fetchPlatform() with 10s timeout
│   │   ├── divergence.js           ← calculateDivergence() — algorithmic, no AI
│   │   ├── formatters.js           ← Rating display, date, text truncation
│   │   └── sentimentColor.js       ← Rating → Tailwind color class
│   ├── constants/
│   │   ├── platforms.js            ← PLATFORMS array (single source of truth)
│   │   └── queryKeys.js            ← TanStack Query key factories
│   └── store/uiStore.js            ← Zustand: selectedPlatforms, searchHistory, theme, location
└── workers/
    ├── wrangler.toml               ← name: hearsay-api, nodejs_compat
    └── src/
        ├── index.js                ← itty-router: OPTIONS first, 7 platform routes
        ├── routes/
        │   ├── google.js           ← textsearch → Place Details (lat/lng support)
        │   ├── yelp.js             ← Business Search → Reviews (lat/lng support)
        │   ├── reddit.js           ← OAuth token (KV cached) → search + city subreddits
        │   ├── youtube.js          ← Search → video details → commentThreads (2hr cache)
        │   ├── tripadvisor.js      ← SerpAPI (24hr cache)
        │   ├── facebook.js         ← SerpAPI fallback (24hr cache)
        │   └── trustpilot.js       ← HTML fetch → JSON-LD extraction
        └── utils/
            ├── cors.js             ← corsHeaders, handleOptions(), addCorsHeaders()
            ├── cache.js            ← Cloudflare Cache API wrapper with TTL
            └── errors.js           ← Standardized error response

```

---

## Known Issues and Decisions

- **Reddit**: Credentials not set. Reddit requires accepting a Responsible Builder Policy through their dev portal — the sign-up was blocked at the time of setup. The route is implemented and ready; just needs `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` added via wrangler.
- **Trustpilot**: Scrapes JSON-LD from page HTML. Fragile — if Trustpilot changes markup or blocks the Worker's user agent, it breaks silently (returns empty, not error).
- **Google textsearch**: Switched from `findplacefromtext` to `textsearch` — handles brand names ("Shake Shack") better. `findplacefromtext` returned empty for chain names without location.
- **Yelp reviews**: API hard-limits to 3 reviews, 160 chars each. Listed in platform card note.
- **SerpAPI budget**: 100 searches/month shared between TripAdvisor and Facebook. Both default to OFF. 24hr caching.
- **YouTube units**: ~71 full queries/day budget. 2hr caching.

---

## Current Build Phase

**Phase 2 — In progress**. Site is live at https://parisa-singh.github.io/hearsay.

**Completed in Phase 2**:
- [x] Shared Layout.jsx with page fade-in transitions
- [x] Regional platform chips (7 per region, coming-soon badges, stagger animation)
- [x] Location reset wipe animation
- [x] Search history sidebar (20 entries, right-side drawer)
- [x] "REVIEW AGGREGATOR" label + updated hero copy
- [x] About page Features section
- [x] LinkedIn link in footer
- [x] All integrated platforms selected by default
- [x] Error/empty cards hidden from results
- [x] Coming-soon chips in separate row below integrated chips

**Phase 3 — Next**:
- [ ] Reddit credentials (see Future API Work above)
- [ ] Trustpilot fix (scraping breaks too often)
- [ ] Foursquare API integration (US/EU regions)
- [ ] Mobile responsive audit
- [ ] Zomato API investigation

---

## How to Resume a Session

1. Read this file completely
2. Run `git log --oneline -10` to see recent commits
3. Check `cd workers && npx wrangler secret list` to verify secrets
4. Run `npm run dev` to start the frontend locally
5. Test a search on the live site: https://parisa-singh.github.io/hearsay
