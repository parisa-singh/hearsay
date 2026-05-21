export function formatRating(rating, max = 5) {
  if (rating == null) return null
  return `${Number(rating).toFixed(1)} / ${max}`
}

export function formatReviewCount(count) {
  if (count == null) return null
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k reviews`
  return `${count} review${count !== 1 ? 's' : ''}`
}

export function truncateText(text, maxLength = 200) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function starArray(rating, max = 5) {
  const full = Math.floor(rating ?? 0)
  const half = (rating ?? 0) % 1 >= 0.5 ? 1 : 0
  const empty = max - full - half
  return { full, half, empty }
}
