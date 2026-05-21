import { PLATFORM_MAP } from '../constants/platforms'

/**
 * Compares platform ratings and flags a divergence if two platforms
 * differ by 1.5 or more stars.
 */
export function calculateDivergence(successfulResults) {
  const rated = successfulResults.filter(r => r.data?.rating != null)
  if (rated.length < 2) return { detected: false }

  let highest = rated[0]
  let lowest = rated[0]

  for (const r of rated) {
    if (r.data.rating > highest.data.rating) highest = r
    if (r.data.rating < lowest.data.rating) lowest = r
  }

  const diff = Number((highest.data.rating - lowest.data.rating).toFixed(1))
  if (diff < 1.5) return { detected: false }

  const highName = PLATFORM_MAP[highest.platform.id]?.displayName ?? highest.platform.id
  const lowName = PLATFORM_MAP[lowest.platform.id]?.displayName ?? lowest.platform.id

  return {
    detected: true,
    platform_a: lowest.platform.id,
    platform_b: highest.platform.id,
    explanation: `${highName} averages ${Number(highest.data.rating).toFixed(1)}/5 while ${lowName} averages ${Number(lowest.data.rating).toFixed(1)}/5 — a ${diff}-star gap. The same place can look very different depending on which audience is reviewing it.`,
  }
}
