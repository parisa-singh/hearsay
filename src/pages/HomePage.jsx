import SearchBar from '../components/search/SearchBar'
import PlatformToggle from '../components/search/PlatformToggle'
import LocationBadge from '../components/search/LocationBadge'
import SearchHistorySidebar from '../components/layout/SearchHistorySidebar'
import { useUIStore } from '../store/uiStore'
import { PLATFORMS } from '../constants/platforms'

const EXAMPLE_SEARCHES = [
  { q: 'Nobu NYC', category: 'restaurant' },
  { q: 'Sony WH-1000XM5', category: 'product' },
  { q: 'Airbnb', category: 'business' },
  { q: 'ChatGPT', category: 'product' },
  { q: 'Sweetgreen', category: 'restaurant' },
]

function normalizeItem(item) {
  if (typeof item === 'string') return { q: item, category: null }
  return item
}

function itemHref(item) {
  const norm = normalizeItem(item)
  const base = `/hearsay/results?q=${encodeURIComponent(norm.q)}`
  return norm.category ? `${base}&category=${encodeURIComponent(norm.category)}` : base
}

export default function HomePage() {
  const { searchHistory, setHistoryOpen } = useUIStore()
  const integratedPlatforms = PLATFORMS.filter(p => p.integrated)
  const normalizedHistory = searchHistory.map(normalizeItem)

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <SearchHistorySidebar />

      {/* Hero */}
      <div className="text-center mb-10 max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase mb-4">
          Review Aggregator
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          What are people{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500">
            really
          </span>{' '}
          saying?
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Search any restaurant, product, or place. Hearsay pulls real reviews from the platforms
          people actually use in your part of the world — not just one algorithm's version.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl space-y-4">
        <SearchBar />
        <div className="flex flex-col items-center gap-3">
          <LocationBadge />
          <div className="w-full">
            <p className="text-xs text-zinc-600 text-center mb-2">Pull from</p>
            <PlatformToggle />
          </div>
        </div>
      </div>

      {/* Example / recent searches */}
      {normalizedHistory.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600 mb-3">Try searching for</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_SEARCHES.map(ex => (
              <a
                key={ex.q}
                href={itemHref(ex)}
                className="px-3 py-1.5 rounded-full text-sm text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all"
              >
                {ex.q}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <p className="text-xs text-zinc-600">Recent searches</p>
            <button
              onClick={() => setHistoryOpen(true)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
            >
              View all →
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {normalizedHistory.slice(0, 5).map(item => (
              <a
                key={item.q}
                href={itemHref(item)}
                className="px-3 py-1.5 rounded-full text-sm text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all"
              >
                {item.q}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Platform logos strip */}
      <div className="mt-16 text-center">
        <p className="text-xs text-zinc-700 mb-4 uppercase tracking-wider">Sources</p>
        <div className="flex items-center justify-center gap-6 flex-wrap opacity-40">
          {integratedPlatforms.map(p => (
            <img
              key={p.id}
              src={p.logo}
              alt={p.displayName}
              width={24}
              height={24}
              title={p.displayName}
              className="grayscale"
              onError={e => { e.target.style.display = 'none' }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
