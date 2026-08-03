/**
 * Per-IP rate limiting via Cloudflare's native rate-limiting binding (RATE_LIMITER).
 *
 * Fail-open by design: a missing binding (e.g. local `wrangler dev` without the
 * binding), a missing client IP, or any thrown error all resolve to "allowed".
 * A limiter outage must never take the whole API offline — the worst case is we
 * briefly stop rate-limiting, not that real users get 429s.
 */

export async function checkRateLimit(request, env) {
  const limiter = env.RATE_LIMITER
  if (!limiter) return { allowed: true } // binding absent — don't block

  // CF-Connecting-IP is set by Cloudflare on every real request and cannot be
  // spoofed by the client, so it's a trustworthy per-caller key.
  const ip = request.headers.get('CF-Connecting-IP')
  if (!ip) return { allowed: true } // can't identify caller — fail open

  try {
    const { success } = await limiter.limit({ key: ip })
    return { allowed: success }
  } catch {
    return { allowed: true } // limiter error — fail open
  }
}
