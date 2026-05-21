/**
 * Cloudflare Cache API wrapper with TTL.
 * Keys are derived from the request URL (or a custom key string).
 */

export async function getCached(key) {
  const cache = caches.default
  const cacheKey = new Request(`https://hearsay-cache/${encodeURIComponent(key)}`)
  const cached = await cache.match(cacheKey)
  if (!cached) return null
  return cached.json()
}

export async function setCached(key, data, ttlSeconds = 3600) {
  const cache = caches.default
  const cacheKey = new Request(`https://hearsay-cache/${encodeURIComponent(key)}`)
  const response = Response.json(data, {
    headers: {
      'Cache-Control': `public, max-age=${ttlSeconds}`,
      'Content-Type': 'application/json',
    },
  })
  await cache.put(cacheKey, response)
}
