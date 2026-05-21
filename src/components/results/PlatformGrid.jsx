import PlatformCard from './PlatformCard'

export default function PlatformGrid({ results }) {
  if (!results || results.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {results.map(({ platform, data, isLoading, isError, error }) => (
        <PlatformCard
          key={platform.id}
          platformId={platform.id}
          data={data}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      ))}
    </div>
  )
}
