import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'

const SERPAPI_BASE = 'https://serpapi.com/search'
const CACHE_TTL = 24 * 3600

function buildSearchQuery(query, city, category) {
  switch (category) {
    case 'product':
      return `${query} review`
    case 'restaurant':
      return city ? `${query} ${city} restaurant` : `${query} restaurant`
    case 'place':
      return city ? `${query} ${city}` : query
    default:
      return city ? `${query} ${city}` : query
  }
}

export async function facebookHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const city = searchParams.get('city')
  const category = searchParams.get('category')

  if (!query) return errorResponse('Missing query parameter', 400)

  const searchQuery = buildSearchQuery(query, city, category)
  const cacheKey = `facebook:${searchQuery}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  try {
    const params = new URLSearchParams({
      engine: 'google',
      q: `${searchQuery} site:facebook.com`,
      api_key: env.SERPAPI_KEY,
      num: '5',
    })
    const res = await fetch(`${SERPAPI_BASE}?${params}`)
    const data = await res.json()

    if (data.error) throw new Error(data.error)

    const results = (data.organic_results ?? []).filter(r =>
      r.link?.includes('facebook.com')
    )

    const reviews = results.slice(0, 4).map(r => ({
      text: r.snippet ?? r.title ?? '',
      rating: null,
      author: null,
      date: null,
      url: r.link ?? null,
    }))

    const response = {
      platform: 'facebook',
      name: query,
      rating: null,
      reviewCount: results.length,
      label: 'Facebook Mentions',
      reviews,
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`Facebook mentions error: ${err.message}`)
  }
}
