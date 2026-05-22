import { describe, it, expect } from 'vitest'

// Mirror the filter and sort logic from PlatformGrid.jsx
function platformSortScore(r) {
  if (r.isError) return 2
  if (r.isLoading) return 1
  if (!r.data) return 2
  if (r.data.reviews?.length > 0 || r.data.rating != null) return 0
  return 2
}

function visibleResults(results) {
  return results.filter(r =>
    r.isLoading || (!r.isError && (r.data?.rating != null || (r.data?.reviews?.length ?? 0) > 0))
  )
}

const mockPlatform = (id) => ({ id, displayName: id, logo: '', brandColor: '#000', integrated: true })

describe('PlatformGrid visibility filter', () => {
  it('shows loading platforms', () => {
    const results = [{ platform: mockPlatform('google'), isLoading: true, isError: false, data: null }]
    expect(visibleResults(results)).toHaveLength(1)
  })

  it('hides error platforms', () => {
    const results = [{ platform: mockPlatform('yelp'), isLoading: false, isError: true, data: null }]
    expect(visibleResults(results)).toHaveLength(0)
  })

  it('hides platforms with no data', () => {
    const results = [{ platform: mockPlatform('reddit'), isLoading: false, isError: false, data: null }]
    expect(visibleResults(results)).toHaveLength(0)
  })

  it('hides platforms with empty reviews and no rating', () => {
    const results = [{ platform: mockPlatform('trustpilot'), isLoading: false, isError: false, data: { reviews: [], rating: null, reviewCount: null } }]
    expect(visibleResults(results)).toHaveLength(0)
  })

  it('shows platforms with a rating even if reviews are empty', () => {
    const results = [{ platform: mockPlatform('google'), isLoading: false, isError: false, data: { reviews: [], rating: 4.5, reviewCount: 200 } }]
    expect(visibleResults(results)).toHaveLength(1)
  })

  it('shows platforms with reviews even if no rating', () => {
    const results = [{ platform: mockPlatform('reddit'), isLoading: false, isError: false, data: { reviews: [{ text: 'great place', rating: null }], rating: null } }]
    expect(visibleResults(results)).toHaveLength(1)
  })

  it('shows platforms with both reviews and rating', () => {
    const results = [{ platform: mockPlatform('google'), isLoading: false, isError: false, data: { reviews: [{ text: 'nice', rating: 5 }], rating: 4.8 } }]
    expect(visibleResults(results)).toHaveLength(1)
  })

  it('filters mixed results correctly', () => {
    const results = [
      { platform: mockPlatform('google'), isLoading: false, isError: false, data: { reviews: [{ text: 'great' }], rating: 4.5 } },
      { platform: mockPlatform('yelp'), isLoading: false, isError: true, data: null },
      { platform: mockPlatform('reddit'), isLoading: true, isError: false, data: null },
      { platform: mockPlatform('youtube'), isLoading: false, isError: false, data: { reviews: [], rating: null } },
      { platform: mockPlatform('trustpilot'), isLoading: false, isError: false, data: { reviews: [], rating: 3.2 } },
    ]
    const visible = visibleResults(results)
    const ids = visible.map(r => r.platform.id)
    expect(ids).toContain('google')     // has data ✓
    expect(ids).not.toContain('yelp')   // error ✗
    expect(ids).toContain('reddit')     // loading ✓
    expect(ids).not.toContain('youtube') // empty ✗
    expect(ids).toContain('trustpilot') // has rating ✓
    expect(visible).toHaveLength(3)
  })
})

describe('PlatformGrid sort order', () => {
  it('sorts working platforms before loading, loading before errors', () => {
    const results = [
      { platform: mockPlatform('yelp'), isLoading: false, isError: true, data: null },
      { platform: mockPlatform('reddit'), isLoading: true, isError: false, data: null },
      { platform: mockPlatform('google'), isLoading: false, isError: false, data: { reviews: [{ text: 'great' }], rating: 4.5 } },
    ]
    const sorted = [...results].sort((a, b) => platformSortScore(a) - platformSortScore(b))
    expect(sorted[0].platform.id).toBe('google')
    expect(sorted[1].platform.id).toBe('reddit')
    expect(sorted[2].platform.id).toBe('yelp')
  })
})
