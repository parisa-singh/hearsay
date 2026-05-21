# Hearsay

> What are people *really* saying?

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Claude AI](https://img.shields.io/badge/Claude-AI-D97757?logo=anthropic&logoColor=white)](https://anthropic.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222?logo=github&logoColor=white)](https://parisa-singh.github.io/hearsay)

**Hearsay** is a cross-platform review aggregator that queries 7 major platforms in parallel and synthesizes the results with AI — giving you the full, unfiltered picture instead of a skewed view from a single source.

The name is intentional: *hearsay* means word of mouth, what people are saying — which is exactly what reviews are.

**[Live Demo →](https://parisa-singh.github.io/hearsay)**

---

## What It Does

1. You search for anything — a restaurant, product, or place
2. Hearsay queries **Google, Yelp, Reddit, YouTube, TripAdvisor, Facebook, and Trustpilot** simultaneously
3. Results are split into **Global Reviews** and **Near You** (location-aware)
4. Claude AI synthesizes a 3–4 sentence **"The Hearsay"** summary across all platforms
5. Visual tags surface recurring **positive themes** and **concerns**
6. A **Divergence Alert** fires when platforms strongly disagree
7. A **Fake Review Signal** flags suspicious rating patterns

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 |
| Styling | Tailwind CSS + shadcn/ui |
| Server state | TanStack Query v5 |
| UI state | Zustand |
| Charts | Recharts |
| Serverless API | Cloudflare Workers |
| AI synthesis | Claude API (claude-sonnet-4-20250514) |
| Deployment | GitHub Actions → GitHub Pages |

---

## Architecture

```
GitHub Pages (static frontend)
        ↕ HTTPS fetch
Cloudflare Workers (API proxy layer)
        ↕
Google Places · Yelp · Reddit · YouTube · SerpAPI · Trustpilot · Claude
```

All API secrets live in Cloudflare Workers environment — never in client-side code.

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/parisa-singh/hearsay.git
cd hearsay

# 2. Install frontend dependencies
npm install

# 3. Create local env file
cp .env.example .env.local
# Fill in VITE_API_BASE_URL with your Cloudflare Worker URL

# 4. Start dev server
npm run dev

# 5. (Separate terminal) Start Workers locally
cd workers
npx wrangler dev
```

### Required Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `.env.local` | Cloudflare Workers base URL |
| `GOOGLE_API_KEY` | Wrangler secret | Google Places API key |
| `YELP_API_KEY` | Wrangler secret | Yelp Fusion API key |
| `REDDIT_CLIENT_ID` | Wrangler secret | Reddit app client ID |
| `REDDIT_CLIENT_SECRET` | Wrangler secret | Reddit app client secret |
| `YOUTUBE_API_KEY` | Wrangler secret | YouTube Data API v3 key |
| `SERPAPI_KEY` | Wrangler secret | SerpAPI key |
| `ANTHROPIC_API_KEY` | Wrangler secret | Anthropic Claude API key |

---

## Deployment

Frontend deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

Workers deploy via:
```bash
cd workers && npx wrangler deploy
```

---

## Project Background

Hearsay grew out of research into AI bias and information diversity — the observation that the source you use shapes the answer you get, often invisibly. This applies to search engines, review platforms, and AI systems alike. By aggregating across sources and surfacing divergences explicitly, Hearsay makes that bias visible rather than hidden.

Built by [Parisa Singh](https://github.com/parisa-singh), CS + Business, UMass Amherst.

---

*"The truth is rarely pure and never simple." — Oscar Wilde*
