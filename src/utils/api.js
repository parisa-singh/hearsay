const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

/**
 * Fetch a platform endpoint with timeout and normalized error handling.
 * @param {string} endpoint - Worker route (e.g. 'google')
 * @param {URLSearchParams|Record<string, string>} params
 * @returns {Promise<object>} parsed JSON response
 */
export async function fetchPlatform(endpoint, params = {}) {
  const url = new URL(`${API_BASE}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url.toString(), { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`${res.status}: ${text || res.statusText}`)
    }
    return await res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') throw new Error('Request timed out')
    throw err
  }
}

/**
 * POST to the synthesis endpoint.
 * @param {object} body
 */
export async function postSynthesis(body) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000) // Claude can take longer

  try {
    const res = await fetch(`${API_BASE}/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Synthesis failed: ${res.status}`)
    return await res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') throw new Error('Synthesis timed out')
    throw err
  }
}
