/**
 * Maps a 0–5 rating to Tailwind color classes for text and background.
 */
export function sentimentColor(rating) {
  if (rating == null) return { text: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700' }
  if (rating >= 4.0) return { text: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-700/50' }
  if (rating >= 3.0) return { text: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-700/50' }
  return { text: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50' }
}

export function riskColor(level) {
  if (level === 'low') return { text: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-700/50' }
  if (level === 'medium') return { text: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-700/50' }
  if (level === 'high') return { text: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50' }
  return { text: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700' }
}
