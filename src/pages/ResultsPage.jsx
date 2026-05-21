import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SearchBar from '../components/search/SearchBar'
import HearSaySummary from '../components/results/HearSaySummary'
import DivergenceAlert from '../components/results/DivergenceAlert'
import FakeRiskBadge from '../components/results/FakeRiskBadge'
import ReviewTabs from '../components/results/ReviewTabs'
import ComparisonChart from '../components/results/ComparisonChart'
import { useAllPlatforms } from '../hooks/useAllPlatforms'
import { useSynthesis } from '../hooks/useSynthesis'
import { useUIStore } from '../store/uiStore'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { location, addToHistory } = useUIStore()

  useEffect(() => {
    if (query) addToHistory(query)
  }, [query, addToHistory])

  const { results, isAnyLoading, successfulResults } = useAllPlatforms(query)
  const { data: synthesis, isLoading: synthesisLoading } = useSynthesis(query, results, location)

  const ratedResults = successfulResults.filter(r => r.data?.rating != null)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Search bar (compact mode) */}
        <div className="max-w-2xl">
          <SearchBar initialValue={query} compact />
        </div>

        {/* AI Summary */}
        <HearSaySummary
          query={query}
          synthesis={synthesis}
          isLoading={synthesisLoading && successfulResults.length >= 2}
        />

        {/* Alerts row */}
        {(synthesis?.divergence?.detected || synthesis?.fake_review_risk) && (
          <div className="flex flex-wrap gap-3 items-center">
            <DivergenceAlert divergence={synthesis?.divergence} />
            <FakeRiskBadge fakeRisk={synthesis?.fake_review_risk} />
          </div>
        )}

        {/* Platform comparison chart */}
        {ratedResults.length >= 2 && !isAnyLoading && (
          <ComparisonChart results={ratedResults} />
        )}

        {/* Platform cards — Global / Near You tabs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              {isAnyLoading ? 'Fetching reviews…' : `Reviews across ${successfulResults.length} platform${successfulResults.length !== 1 ? 's' : ''}`}
            </h2>
          </div>

          <ReviewTabs
            globalResults={results}
            localResults={results} // Phase 2 will differentiate local vs global
            query={query}
            location={location}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
