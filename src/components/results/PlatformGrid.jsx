import PlatformCard from './PlatformCard'
import { YelpWideCard } from './PlatformCard'

function platformSortScore(r) {
  if (r.isError) return 2
  if (r.isLoading) return 1
  if (!r.data) return 2
  if (r.data.reviews?.length > 0 || r.data.rating != null) return 0
  return 2
}

export default function PlatformGrid({ results, query }) {
  if (!results || results.length === 0) return null

  const visible = results.filter(r =>
    r.isLoading || (!r.isError && (r.data?.rating != null || (r.data?.reviews?.length ?? 0) > 0))
  )

  const sorted = [...visible].sort((a, b) => platformSortScore(a) - platformSortScore(b))

  // Yelp renders full-width below the main grid
  const yelpResult = sorted.find(r => r.platform.id === 'yelp' && !r.isLoading)
  const gridResults = sorted.filter(r => r.platform.id !== 'yelp' || r.isLoading)

  return (
    <div className="space-y-4">
      {/* Yelp at the top — full-width horizontal card */}
      {yelpResult && (
        <YelpWideCard
          platform={yelpResult.platform}
          data={yelpResult.data}
        />
      )}

      {gridResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {gridResults.map(({ platform, data, isLoading, isError, error }) => (
            <PlatformCard
              key={platform.id}
              platformId={platform.id}
              data={data}
              isLoading={isLoading}
              isError={isError}
              error={error}
              query={query}
            />
          ))}
        </div>
      )}
    </div>
  )
}
