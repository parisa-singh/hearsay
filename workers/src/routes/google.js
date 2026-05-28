import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place'
const CACHE_TTL = 2 * 3600 // 2 hours

export async function googleHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const category = searchParams.get('category')

  if (!query) return errorResponse('Missing query parameter', 400)

  // Google Places API is location-biased — not suitable for product searches
  if (category === 'product') {
    return Response.json({ platform: 'google', reviews: [], reviewCount: null, rating: null })
  }

  const cacheKey = `google:${query}:${lat ?? ''}:${lng ?? ''}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  try {
    // textsearch handles brand names ("Shake Shack") better than findplacefromtext
    const searchParams2 = new URLSearchParams({
      query,
      key: env.GOOGLE_API_KEY,
      language: 'en',
    })
    if (lat && lng) {
      searchParams2.set('location', `${lat},${lng}`)
      searchParams2.set('radius', '50000')
    }

    const searchRes = await fetch(`${PLACES_BASE}/textsearch/json?${searchParams2}`)
    const searchData = await searchRes.json()

    if (searchData.status === 'REQUEST_DENIED' || searchData.status === 'INVALID_REQUEST') {
      return errorResponse(`Google API error: ${searchData.error_message ?? searchData.status}`)
    }

    const place = searchData.results?.[0]
    if (!place) {
      return Response.json({ platform: 'google', reviews: [], reviewCount: null, rating: null })
    }

    // Fetch reviews via Place Details
    const detailParams = new URLSearchParams({
      place_id: place.place_id,
      fields: 'name,rating,user_ratings_total,reviews,url,photos',
      key: env.GOOGLE_API_KEY,
      language: 'en',
    })
    const detailRes = await fetch(`${PLACES_BASE}/details/json?${detailParams}`)
    const detailData = await detailRes.json()
    const result = detailData.result ?? {}

    const workerOrigin = new URL(request.url).origin
    const response = {
      platform: 'google',
      name: result.name ?? place.name ?? query,
      rating: result.rating ?? place.rating ?? null,
      reviewCount: result.user_ratings_total ?? place.user_ratings_total ?? null,
      sourceUrl: result.url ?? null,
      photos: (result.photos ?? []).slice(0, 3).map(p => ({
        url: `${workerOrigin}/google-photo?ref=${encodeURIComponent(p.photo_reference)}`,
      })),
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
