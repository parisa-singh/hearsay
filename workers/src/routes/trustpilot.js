import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'

const CACHE_TTL = 12 * 3600 // 12hr

export async function trustpilotHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) return errorResponse('Missing query parameter', 400)

  const cacheKey = `trustpilot:${query}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  try {
    // Search Trustpilot for the business
    const searchRes = await fetch(
      `https://www.trustpilot.com/search?query=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Hearsay/1.0)' } }
    )
    const searchHtml = await searchRes.text()

    // Extract first business URL from search results
    const businessSlug = extractBusinessSlug(searchHtml)
    if (!businessSlug) {
      return Response.json({ platform: 'trustpilot', reviews: [], reviewCount: null, rating: null })
    }

    // Fetch business page and extract JSON-LD
    const pageRes = await fetch(
      `https://www.trustpilot.com/review/${businessSlug}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Hearsay/1.0)' } }
    )
    const pageHtml = await pageRes.text()
    const jsonLd = extractJsonLd(pageHtml)

    if (!jsonLd) {
      return Response.json({ platform: 'trustpilot', reviews: [], reviewCount: null, rating: null })
    }

    const aggregateRating = jsonLd.aggregateRating ?? {}
    const reviewItems = jsonLd.review ?? []

    const response = {
      platform: 'trustpilot',
      name: jsonLd.name ?? query,
      rating: aggregateRating.ratingValue ? parseFloat(aggregateRating.ratingValue) : null,
      reviewCount: aggregateRating.reviewCount ?? null,
      sourceUrl: `https://www.trustpilot.com/review/${businessSlug}`,
      reviews: reviewItems.slice(0, 5).map(r => ({
        text: r.reviewBody ?? '',
        rating: r.reviewRating?.ratingValue ?? null,
        author: r.author?.name ?? null,
        date: r.datePublished ?? null,
      })),
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`Trustpilot error: ${err.message}`)
  }
}

function extractBusinessSlug(html) {
  // Look for links to /review/ pages in search results
  const match = html.match(/href="\/review\/([\w.-]+)"/i)
  return match?.[1] ?? null
}

function extractJsonLd(html) {
  // Extract all JSON-LD blocks and find the one with @type LocalBusiness or Organization
  const regex = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1])
      const items = Array.isArray(data) ? data : [data]
      for (const item of items) {
        if (item.aggregateRating || item['@type'] === 'LocalBusiness' || item['@type'] === 'Organization') {
          return item
        }
      }
    } catch {
      // Skip malformed JSON-LD blocks
    }
  }
  return null
}
