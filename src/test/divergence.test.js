import { describe, it, expect } from 'vitest'
import { calculateDivergence } from '../utils/divergence'

const makeResult = (id, rating) => ({
  platform: { id, displayName: id },
  data: { rating, reviews: [] },
  isError: false,
  isLoading: false,
})

describe('calculateDivergence', () => {
  it('returns not detected when fewer than 2 rated platforms', () => {
    const result = calculateDivergence([makeResult('google', 4.5)])
    expect(result.detected).toBe(false)
  })

  it('returns not detected when ratings are close (< 1.5 gap)', () => {
    const results = [makeResult('google', 4.5), makeResult('yelp', 4.0)]
    expect(calculateDivergence(results).detected).toBe(false)
  })

  it('detects divergence when gap is exactly 1.5', () => {
    const results = [makeResult('google', 4.5), makeResult('yelp', 3.0)]
    expect(calculateDivergence(results).detected).toBe(true)
  })

  it('detects divergence when gap is greater than 1.5', () => {
    const results = [makeResult('google', 5.0), makeResult('reddit', 2.0)]
    const div = calculateDivergence(results)
    expect(div.detected).toBe(true)
    expect(div.platform_a).toBe('reddit')
    expect(div.platform_b).toBe('google')
    expect(div.explanation).toContain('3-star gap')
  })

  it('ignores platforms with null rating', () => {
    const results = [
      makeResult('google', 4.5),
      makeResult('reddit', null),
      makeResult('yelp', 4.0),
    ]
    expect(calculateDivergence(results).detected).toBe(false)
  })

  it('returns detected false for empty results', () => {
    expect(calculateDivergence([]).detected).toBe(false)
  })
})
