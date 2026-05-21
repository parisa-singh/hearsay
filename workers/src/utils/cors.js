const ALLOWED_ORIGINS = [
  'https://parisa-singh.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
]

export function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') ?? ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  })
}

export function addCorsHeaders(response, request) {
  const headers = new Headers(response.headers)
  Object.entries(getCorsHeaders(request)).forEach(([k, v]) => headers.set(k, v))
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
