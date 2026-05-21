import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place'
const CACHE_TTL = 2 * 3600 // 2 hours

export async function googleHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!query) return errorResponse('Missing query parameter', 400)

  const cacheKey = `google:${query}:${lat ?? ''}:${lng ?? ''}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  try {
    // Step 1: Find place
    const findParams = new URLSearchParams({
      input: query,
      inputtype: 'textquery',
      fields: 'place_id,name',
      key: env.GOOGLE_API_KEY,
    })
    if (lat && lng) {
      findParams.set('locationbias', `circle:50000@${lat},${lng}`)
    }

    const findRes = await fetch(`${PLACES_BASE}/findplacefromtext/json?${findParams}`)
    const findData = await findRes.json()
    const placeId = findData.candidates?.[0]?.place_id
    if (!placeId) {
      return Response.json({ platform: 'google', reviews: [], reviewCount: null, rating: null })
    }

    // Step 2: Get place details with reviews
    const detailParams = new URLSearchParams({
      place_id: placeId,
      fields: 'name,rating,user_ratings_total,reviews,url',
      key: env.GOOGLE_API_KEY,
      language: 'en',
    })
    const detailRes = await fetch(`${PLACES_BASE}/details/json?${detailParams}`)
    const detailData = await detailRes.json()
    const result = detailData.result ?? {}

    const response = {
      platform: 'google',
      name: result.name ?? query,
      rating: result.rating ?? null,
      reviewCount: result.user_ratings_total ?? null,
      sourceUrl: result.url ?? null,
      reviews: (result.reviews ?? []).slice(0, 5).map(r => ({
        text: r.text ?? '',
        rating: r.rating ?? null,
        author: r.author_name ?? null,
        date: r.time ? new Date(r.time * 1000).toISOString() : null,
      })),
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`Google API error: ${err.message}`)
  }
}
