import PlatformCard from './PlatformCard'

function platformSortScore(r) {
  if (r.isError) return 2
  if (r.isLoading) return 1
  if (!r.data) return 2
  if (r.data.reviews?.length > 0 || r.data.rating != null) return 0
  return 2
}

export default function PlatformGrid({ results, query }) {
  if (!results || results.length === 0) return null

  const sorted = [...results].sort((a, b) => platformSortScore(a) - platformSortScore(b))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sorted.map(({ platform, data, isLoading, isError, error }) => (
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
  )
}
