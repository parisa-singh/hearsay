import { useState } from 'react'
import PlatformGrid from './PlatformGrid'
import LocalEmptyState from './LocalEmptyState'

export default function ReviewTabs({ globalResults, localResults, query, location }) {
  const [activeTab, setActiveTab] = useState('global')
  const hasLocation = Boolean(location?.city)

  const localHasData = localResults?.some(r => r.data && !r.isError && (r.data.reviews?.length ?? 0) > 0)
  const localIsLoading = localResults?.some(r => r.isLoading)

  if (!hasLocation) {
    return <PlatformGrid results={globalResults} query={query} />
  }

  const cityLabel = location.state
    ? `${location.city}, ${location.state}`
    : location.city

  return (
    <div>
      <div className="flex overflow-x-auto mb-6 border-b border-zinc-800 gap-1">
        <TabButton
          active={activeTab === 'global'}
          onClick={() => setActiveTab('global')}
          label="Global Reviews"
        />
        <TabButton
          active={activeTab === 'local'}
          onClick={() => setActiveTab('local')}
          label={<>Near You <span className="hidden sm:inline text-zinc-600">— {cityLabel}</span></>}
          loading={localIsLoading}
        />
      </div>

      {activeTab === 'global' && <PlatformGrid results={globalResults} query={query} />}

      {activeTab === 'local' && (
        !localIsLoading && !localHasData
          ? <LocalEmptyState query={query} city={location.city} />
          : <PlatformGrid results={localResults ?? globalResults} query={query} />
      )}
    </div>
  )
}

function TabButton({ active, onClick, label, loading }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2
        whitespace-nowrap transition-all shrink-0
        ${active
          ? 'border-white text-white'
          : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
        }
      `}
    >
      <span>{label}</span>
      {loading && (
        <svg className="animate-spin shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      )}
    </button>
  )
}
