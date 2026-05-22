import { describe, it, expect } from 'vitest'
import { getPlatformTiers } from '../utils/platformRegions'

describe('getPlatformTiers', () => {
  it('returns 7 platforms for US', () => {
    const { platforms } = getPlatformTiers('US')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('google')
    expect(platforms).toContain('yelp')
    expect(platforms).toContain('opentable')
    expect(platforms).toContain('nextdoor')
    expect(platforms).toContain('foursquare')
  })

  it('returns 7 platforms for CA (Canada)', () => {
    const { platforms } = getPlatformTiers('CA')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('yelp')
  })

  it('returns 7 platforms for GB (Europe)', () => {
    const { platforms } = getPlatformTiers('GB')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('thefork')
    expect(platforms).toContain('michelin')
    expect(platforms).toContain('foursquare')
  })

  it('returns 7 platforms for DE (Germany, Europe)', () => {
    const { platforms } = getPlatformTiers('DE')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('thefork')
  })

  it('returns 7 platforms for CN (China) — all coming soon', () => {
    const { platforms } = getPlatformTiers('CN')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('dianping')
    expect(platforms).toContain('meituan')
    expect(platforms).toContain('wechat')
    expect(platforms).toContain('xiaohongshu')
  })

  it('returns 7 platforms for IN (India)', () => {
    const { platforms } = getPlatformTiers('IN')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('justdial')
    expect(platforms).toContain('zomato')
    expect(platforms).toContain('swiggy')
    expect(platforms).toContain('magicpin')
  })

  it('returns 7 platforms for AE (Middle East)', () => {
    const { platforms } = getPlatformTiers('AE')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('talabat')
    expect(platforms).toContain('zomato')
  })

  it('returns 7 platforms for SG (Southeast Asia)', () => {
    const { platforms } = getPlatformTiers('SG')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('grabfood')
    expect(platforms).toContain('agoda')
    expect(platforms).toContain('wongnai')
    expect(platforms).toContain('chope')
  })

  it('returns 7 platforms for BR (Latin America)', () => {
    const { platforms } = getPlatformTiers('BR')
    expect(platforms).toHaveLength(7)
    expect(platforms).toContain('rappi')
    expect(platforms).toContain('degusta')
    expect(platforms).toContain('thefork')
  })

  it('returns platforms for unknown country code (fallback)', () => {
    const { platforms } = getPlatformTiers('ZZ')
    expect(platforms).toBeDefined()
    expect(platforms.length).toBeGreaterThan(0)
    expect(platforms).toContain('google')
  })

  it('returns null platforms when no countryCode provided', () => {
    const { platforms } = getPlatformTiers(null)
    expect(platforms).toBeNull()
  })

  it('handles lowercase country codes', () => {
    const { platforms } = getPlatformTiers('us')
    expect(platforms).toContain('google')
    expect(platforms).toContain('yelp')
  })
})
