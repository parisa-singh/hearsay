import { useState } from 'react'
import { formatRelativeTime, starArray } from '../../utils/formatters'

const SHORT_LIMIT = 120

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

export default function ReviewItem({ review, showVideoLink = false }) {
  const { text, rating, author, date, url, videoTitle } = review
  const [expanded, setExpanded] = useState(false)

  const isLong = text.length > SHORT_LIMIT
  const displayText = expanded || !isLong ? text : text.slice(0, SHORT_LIMIT).trimEnd() + '…'

  return (
    <div className="py-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {rating && <StarRating rating={rating} />}
          {author && <span className="text-xs text-zinc-500 truncate">{author}</span>}
        </div>
        {date && <span className="text-xs text-zinc-600 shrink-0">{formatRelativeTime(date)}</span>}
      </div>

      {videoTitle && showVideoLink && (
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

      {showVideoLink && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.19a8.16 8.16 0 0 0 4.77 1.52V7.27a4.85 4.85 0 0 1-1.01-.58z"/>
          </svg>
          Watch on YouTube
        </a>
      )}
    </div>
  )
}
