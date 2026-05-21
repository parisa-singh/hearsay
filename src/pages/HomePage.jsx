import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SearchBar from '../components/search/SearchBar'
import PlatformToggle from '../components/search/PlatformToggle'
import LocationBadge from '../components/search/LocationBadge'
import { useUIStore } from '../store/uiStore'
import { PLATFORMS } from '../constants/platforms'

const EXAMPLE_SEARCHES = ['Nobu NYC', 'Sony WH-1000XM5', 'Airbnb', 'ChatGPT', 'Sweetgreen']

export default function HomePage() {
  const searchHistory = useUIStore(s => s.searchHistory)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            What are people{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500">
              really
            </span>{' '}
            saying?
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Search once. See reviews from 7 platforms. Get the full picture —
            not just one algorithm's version of it.
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

        {/* Example searches */}
        {searchHistory.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600 mb-3">Try searching for</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_SEARCHES.map(ex => (
                <a
                  key={ex}
                  href={`/hearsay/results?q=${encodeURIComponent(ex)}`}
                  className="px-3 py-1.5 rounded-full text-sm text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                >
                  {ex}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Recent searches */}
        {searchHistory.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600 mb-3">Recent searches</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {searchHistory.map(q => (
                <a
                  key={q}
                  href={`/hearsay/results?q=${encodeURIComponent(q)}`}
                  className="px-3 py-1.5 rounded-full text-sm text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                >
                  {q}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Platform logos strip */}
        <div className="mt-16 text-center">
          <p className="text-xs text-zinc-700 mb-4 uppercase tracking-wider">Sources</p>
          <div className="flex items-center justify-center gap-6 flex-wrap opacity-40">
            {PLATFORMS.map(p => (
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

      <Footer />
    </div>
  )
}
