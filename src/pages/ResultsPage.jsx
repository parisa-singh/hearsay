import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SearchBar from '../components/search/SearchBar'
import DivergenceAlert from '../components/results/DivergenceAlert'
import ReviewTabs from '../components/results/ReviewTabs'
import ComparisonChart from '../components/results/ComparisonChart'
import { useAllPlatforms } from '../hooks/useAllPlatforms'
import { useUIStore } from '../store/uiStore'
import { calculateDivergence } from '../utils/divergence'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { location, addToHistory } = useUIStore()

  useEffect(() => {
    if (query) addToHistory(query)
  }, [query, addToHistory])

  const { results, isAnyLoading, successfulResults } = useAllPlatforms(query)

  const ratedResults = successfulResults.filter(r => r.data?.rating != null)
  const divergence = calculateDivergence(successfulResults)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Compact search bar */}
        <div className="max-w-2xl">
          <SearchBar initialValue={query} compact />
        </div>

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-semibold text-white">
            What people are saying about{' '}
            <span className="text-zinc-400">"{query}"</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isAnyLoading
              ? 'Fetching reviews across platforms…'
              : `${successfulResults.length} platform${successfulResults.length !== 1 ? 's' : ''} returned results`}
          </p>
        </div>

        {/* Divergence alert */}
        {divergence.detected && !isAnyLoading && (
          <DivergenceAlert divergence={divergence} />
        )}

        {/* Platform comparison chart */}
        {ratedResults.length >= 2 && !isAnyLoading && (
          <ComparisonChart results={ratedResults} />
        )}

        {/* Platform cards */}
        <ReviewTabs
          globalResults={results}
          localResults={results}
          query={query}
          location={location}
        />
      </main>

      <Footer />
    </div>
  )
}
