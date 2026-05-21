import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'

const REDDIT_BASE = 'https://oauth.reddit.com'
const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token'
const CACHE_TTL = 2 * 3600

// City → subreddit mappings for local search
const CITY_SUBREDDITS = {
  'new york': ['nyc'], 'new york city': ['nyc'], 'los angeles': ['LosAngeles'],
  'chicago': ['chicago'], 'houston': ['houston'], 'san francisco': ['sanfrancisco'],
  'seattle': ['Seattle'], 'boston': ['boston'], 'austin': ['Austin'],
  'miami': ['miami'], 'atlanta': ['Atlanta'], 'london': ['london'],
  'toronto': ['toronto'], 'sydney': ['sydney'], 'paris': ['paris'],
  'berlin': ['berlin'], 'singapore': ['singapore'], 'tokyo': ['Tokyo'],
  'mumbai': ['mumbai'], 'delhi': ['delhi'], 'bangalore': ['bangalore'],
}

async function getRedditToken(env) {
  // Try KV cache first if available
  if (env.KV) {
    const cached = await env.KV.get('reddit_token', 'json')
    if (cached && cached.expires > Date.now()) return cached.token
  }

  const credentials = btoa(`${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`)
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'hearsay-app/1.0 by parisa-singh',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Reddit token fetch failed')

  if (env.KV) {
    await env.KV.put('reddit_token', JSON.stringify({
      token: data.access_token,
      expires: Date.now() + (data.expires_in - 60) * 1000,
    }))
  }

  return data.access_token
}

async function searchReddit(token, query, subreddit = null, limit = 10) {
  const params = new URLSearchParams({
    q: query,
    sort: 'relevance',
    t: 'year',
    limit: String(limit),
    type: 'link',
  })
  if (subreddit) params.set('restrict_sr', 'true')

  const base = subreddit
    ? `${REDDIT_BASE}/r/${subreddit}/search`
    : `${REDDIT_BASE}/search`

  const res = await fetch(`${base}?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'hearsay-app/1.0 by parisa-singh',
    },
  })
  return res.json()
}

export async function redditHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const city = searchParams.get('city')?.toLowerCase()

  if (!query) return errorResponse('Missing query parameter', 400)

  const cacheKey = `reddit:${query}:${city ?? ''}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  try {
    const token = await getRedditToken(env)

    // Global search
    const globalData = await searchReddit(token, `${query} review`, null, 8)
    const posts = globalData.data?.children ?? []

    // City subreddit search
    const citySubreddits = city ? (CITY_SUBREDDITS[city] ?? []) : []
    let localPosts = []
    if (citySubreddits.length > 0) {
      for (const sub of citySubreddits.slice(0, 2)) {
        const localData = await searchReddit(token, query, sub, 5)
        localPosts = localPosts.concat(localData.data?.children ?? [])
      }
    }

    const allPosts = [...localPosts, ...posts].slice(0, 10)

    const reviews = allPosts
      .map(p => p.data)
      .filter(p => p.selftext && p.selftext.length > 30 && p.selftext !== '[deleted]')
      .slice(0, 5)
      .map(p => ({
        text: p.selftext?.slice(0, 500) ?? p.title,
        rating: null,
        author: p.author ?? null,
        date: p.created_utc ? new Date(p.created_utc * 1000).toISOString() : null,
        url: `https://reddit.com${p.permalink}`,
        subreddit: p.subreddit,
        score: p.score,
      }))

    const response = {
      platform: 'reddit',
      name: query,
      rating: null, // Reddit doesn't have star ratings
      reviewCount: allPosts.length,
      reviews,
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`Reddit API error: ${err.message}`)
  }
}
