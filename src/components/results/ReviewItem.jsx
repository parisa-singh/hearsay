import { useState } from 'react'
import { formatRelativeTime, starArray } from '../../utils/formatters'

const SHORT_LIMIT = 120

const PLATFORM_LINK_LABELS = {
  youtube: 'Watch on YouTube',
  facebook: 'View on Facebook',
  tripadvisor: 'View on TripAdvisor',
  reddit: 'View on Reddit',
  trustpilot: 'View on Trustpilot',
  google: 'View on Google',
}

function StarRating({ rating, max = 5 }) {
  if (!rating) return null
  const { full, half, empty } = starArray(rating, max)
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array(full).fill(null).map((_, i) => (
        <svg key={`f${i}`} width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      {half === 1 && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/>
        </svg>
      )}
      {Array(empty).fill(null).map((_, i) => (
        <svg key={`e${i}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

export default function ReviewItem({ review, platformId, brandColor }) {
  const { text, rating, author, date, url, videoTitle } = review
  const [expanded, setExpanded] = useState(false)

  const isLong = text.length > SHORT_LIMIT
  const displayText = expanded || !isLong ? text : text.slice(0, SHORT_LIMIT).trimEnd() + '…'
  const linkLabel = PLATFORM_LINK_LABELS[platformId] ?? 'View source'
  const linkColor = brandColor ?? '#71717a'

  return (
    <div className="py-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {rating && <StarRating rating={rating} />}
          {author && <span className="text-xs text-zinc-500 truncate">{author}</span>}
        </div>
        {date && <span className="text-xs text-zinc-600 shrink-0">{formatRelativeTime(date)}</span>}
      </div>

      {videoTitle && (
        <p className="text-xs text-zinc-600 mb-1 truncate">{videoTitle}</p>
      )}

      <p className="text-sm text-zinc-300 leading-relaxed break-words">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="ml-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: linkColor }}
        >
          {linkLabel}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      )}
    </div>
  )
}
