import { useState } from 'react'
import { PLATFORM_MAP } from '../../constants/platforms'
import { formatReviewCount } from '../../utils/formatters'
import { sentimentColor } from '../../utils/sentimentColor'
import ReviewItem from './ReviewItem'

const INITIAL_COUNT = 3
const LOAD_MORE_COUNT = 3

function PlatformCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-800" />
        <div className="ml-auto h-6 w-12 rounded-full bg-zinc-800" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="py-3 border-b border-zinc-800 last:border-0">
          <div className="h-3 w-3/4 rounded bg-zinc-800 mb-2" />
          <div className="h-3 w-full rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  )
}

function PlatformCardError({ platform, error }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-3">
        <img src={platform.logo} alt={platform.displayName} width={26} height={26} className="rounded-sm opacity-40" onError={e => { e.target.style.display = 'none' }} />
        <span className="text-sm font-medium text-zinc-500">{platform.displayName}</span>
      </div>
      <p className="text-sm text-zinc-600">
        {error?.message?.includes('timed out') ? 'Request timed out — try again' : 'Reviews unavailable right now'}
      </p>
    </div>
  )
}

function YelpCompactCard({ platform, data }) {
  const { rating, reviewCount, sourceUrl } = data ?? {}
  const colors = sentimentColor(rating)

  return (
    <div
      className="rounded-xl border bg-zinc-900 p-4 transition-all duration-300 animate-slide-up hover:border-zinc-700 flex flex-col gap-3"
      style={{ borderColor: `${platform.brandColor}30` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src={platform.logo}
            alt={platform.displayName}
            width={26}
            height={26}
            className="rounded-sm shrink-0"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div>
            <span className="text-sm font-semibold text-zinc-200">{platform.displayName}</span>
            {reviewCount && (
              <span className="block text-xs text-zinc-500">{formatReviewCount(reviewCount)}</span>
            )}
          </div>
        </div>
        {rating != null && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border shrink-0 ${colors.text} ${colors.bg} ${colors.border}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {Number(rating).toFixed(1)}
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-600">
        Yelp review previews aren't available via the public API.
      </p>

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          style={{ color: platform.brandColor }}
        >
          See all reviews on Yelp
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      )}
    </div>
  )
}

function getExternalUrl(platform, data, query) {
  if (data?.sourceUrl) return data.sourceUrl
  if (platform.id === 'reddit') return `https://www.reddit.com/search?q=${encodeURIComponent(query + ' review')}&sort=relevance`
  return null
}

export default function PlatformCard({ platformId, data, isLoading, isError, error, query }) {
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT)
  const platform = PLATFORM_MAP[platformId]
  if (!platform) return null

  if (isLoading) return <PlatformCardSkeleton />
  if (isError || !data) return <PlatformCardError platform={platform} error={error} />

  if (platform.id === 'yelp') return <YelpCompactCard platform={platform} data={data} />

  const { rating, reviewCount, reviews = [] } = data
  const colors = sentimentColor(rating)
  const label = platform.label ?? platform.displayName
  const externalUrl = getExternalUrl(platform, data, query ?? '')
  const displayedReviews = reviews.slice(0, displayCount)
  const hasMore = reviews.length > displayCount
  const isYouTube = platform.id === 'youtube'

  return (
    <div
      className="rounded-xl border bg-zinc-900 p-4 sm:p-5 transition-all duration-300 animate-slide-up hover:border-zinc-700 flex flex-col"
      style={{ borderColor: `${platform.brandColor}30` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={platform.logo}
            alt={platform.displayName}
            width={26}
            height={26}
            className="rounded-sm shrink-0"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-zinc-200 truncate">{label}</span>
              {platform.id === 'facebook' && (
                <span className="text-xs text-zinc-600 italic shrink-0">(public mentions)</span>
              )}
            </div>
            {reviewCount && (
              <span className="text-xs text-zinc-500">{formatReviewCount(reviewCount)}</span>
            )}
          </div>
        </div>

        {rating != null && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold border shrink-0 ${colors.text} ${colors.bg} ${colors.border}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {Number(rating).toFixed(1)}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="flex-1">
        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-600 py-2">No reviews found for this search.</p>
        ) : (
          <>
            {displayedReviews.map((review, i) => (
              <ReviewItem key={i} review={review} showVideoLink={isYouTube} />
            ))}

            {/* YouTube inline controls */}
            {isYouTube && (hasMore || displayCount > INITIAL_COUNT) && (
              <div className="mt-3 flex items-center gap-3">
                {hasMore && (
                  <button
                    onClick={() => setDisplayCount(c => c + LOAD_MORE_COUNT)}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Load more ({reviews.length - displayCount} remaining)
                  </button>
                )}
                {displayCount > INITIAL_COUNT && (
                  <button
                    onClick={() => setDisplayCount(INITIAL_COUNT)}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* External link for non-YouTube platforms */}
      {!isYouTube && externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs font-medium transition-colors hover:opacity-80 inline-flex items-center gap-1 shrink-0"
          style={{ color: platform.brandColor }}
        >
          See more reviews on {platform.displayName}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      )}
    </div>
  )
}
