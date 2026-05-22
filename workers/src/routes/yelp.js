import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'

const YELP_BASE = 'https://api.yelp.com/v3'
const CACHE_TTL = 2 * 3600

export async function yelpHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const city = searchParams.get('city')

  if (!query) return errorResponse('Missing query parameter', 400)

  const cacheKey = `yelp:${query}:${lat ?? ''}:${lng ?? ''}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  const headers = { Authorization: `Bearer ${env.YELP_API_KEY}` }

  try {
    // Step 1: Business search
    const searchP = new URLSearchParams({ term: query, limit: '1', sort_by: 'best_match' })
    if (lat && lng) {
      searchP.set('latitude', lat)
      searchP.set('longitude', lng)
    } else if (city) {
      searchP.set('location', city)
    } else {
      searchP.set('location', 'United States')
    }

    const searchRes = await fetch(`${YELP_BASE}/businesses/search?${searchP}`, { headers })
    if (!searchRes.ok) {
      const errText = await searchRes.text().catch(() => '')
      return errorResponse(`Yelp search error ${searchRes.status}: ${errText.slice(0, 300)}`)
    }

    const searchData = await searchRes.json()
    const business = searchData.businesses?.[0]

    if (!business) {
      return Response.json({ platform: 'yelp', reviews: [], reviewCount: null, rating: null })
    }

    // Step 2: Get reviews (Yelp API: max 3 reviews, 160-char truncation)
    let reviews = []
    let reviewsDebug = null
    const reviewRes = await fetch(`${YELP_BASE}/businesses/${business.id}/reviews`, { headers })
    if (reviewRes.ok) {
      const reviewData = await reviewRes.json()
      reviews = (reviewData.reviews ?? [])
        .filter(r => (r.text ?? '').length >= 5)
        .map(r => ({
          text: r.text ?? '',
          rating: r.rating ?? null,
          author: r.user?.name ?? null,
          date: r.time_created ?? null,
        }))
    } else {
      const errText = await reviewRes.text().catch(() => '')
      reviewsDebug = `reviews endpoint: ${reviewRes.status} — ${errText.slice(0, 200)}`
    }

    const response = {
      platform: 'yelp',
      name: business.name,
      rating: business.rating ?? null,
      reviewCount: business.review_count ?? null,
      sourceUrl: business.url ?? null,
      reviews,
      ...(reviewsDebug ? { reviewsDebug } : {}),
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`Yelp API error: ${err.message}`)
  }
}
