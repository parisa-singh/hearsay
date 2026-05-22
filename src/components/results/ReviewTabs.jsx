import { useState } from 'react'
import PlatformGrid from './PlatformGrid'
import LocalEmptyState from './LocalEmptyState'

export default function ReviewTabs({ globalResults, localResults, query, location }) {
  const [activeTab, setActiveTab] = useState('global')
  const hasLocation = Boolean(location?.city)

  // Determine if Near You has any meaningful data
  const localHasData = localResults?.some(r => r.data && !r.isError && (r.data.reviews?.length ?? 0) > 0)
  const localIsLoading = localResults?.some(r => r.isLoading)

  if (!hasLocation) {
    return <PlatformGrid results={globalResults} query={query} />
  }

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        <TabButton
          active={activeTab === 'global'}
          onClick={() => setActiveTab('global')}
          icon="🌍"
          label="Global Reviews"
        />
        <TabButton
          active={activeTab === 'local'}
          onClick={() => setActiveTab('local')}
          icon="📍"
          label={`Near You — ${location.city}${location.state ? `, ${location.state}` : ''}`}
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

function TabButton({ active, onClick, icon, label, loading }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
        ${active
          ? 'border-white text-white'
          : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {loading && (
        <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      )}
    </button>
  )
}
