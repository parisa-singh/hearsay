import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'
import { filterReviewsForCategory } from '../utils/relevanceFilter.js'

const SERPAPI_BASE = 'https://serpapi.com/search'
const CACHE_TTL = 24 * 3600

export async function trustpilotHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const category = searchParams.get('category')
  const nocache = searchParams.get('nocache') === '1'

  if (!query) return errorResponse('Missing query parameter', 400)

  // Use a versioned cache key so old HTML-scraped results aren't served
  const cacheKey = `trustpilot:v2:${query}`
  const cached = await getCached(cacheKey, nocache)
  if (cached) return Response.json(cached)

  try {
    const params = new URLSearchParams({
      engine: 'google',
      q: `${query} site:trustpilot.com reviews`,
      api_key: env.SERPAPI_KEY,
      num: '5',
    })
    const res = await fetch(`${SERPAPI_BASE}?${params}`)
    const data = await res.json()

    if (data.error) throw new Error(data.error)

    const results = (data.organic_results ?? []).filter(r =>
      r.link?.includes('trustpilot.com')
    )

    const reviews = filterReviewsForCategory(
      results.slice(0, 4).map(r => ({
        text: r.snippet ?? r.title ?? '',
        rating: parseRatingFromSnippet(r.snippet),
        author: null,
        date: null,
        url: r.link ?? null,
      })),
      category
    )

    const ratingResult = results.find(r => r.snippet && parseRatingFromSnippet(r.snippet) !== null)
    const rating = ratingResult ? parseRatingFromSnippet(ratingResult.snippet) : null

    const response = {
      platform: 'trustpilot',
      name: query,
      rating,
      reviewCount: null,
      sourceUrl: results[0]?.link ?? null,
      reviews,
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`Trustpilot error: ${err.message}`)
  }
}

function parseRatingFromSnippet(text) {
  if (!text) return null
  const trustScore = text.match(/TrustScore\s+(\d+(?:\.\d+)?)/i)
  if (trustScore) return parseFloat(trustScore[1])
  const outOf = text.match(/(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*5/i)
  if (outOf) return parseFloat(outOf[1])
  const stars = text.match(/(\d+(?:\.\d+)?)\s*stars?/i)
  if (stars) return parseFloat(stars[1])
  return null
}
