import { describe, it, expect } from 'vitest'
import { PLATFORMS, PLATFORM_MAP } from '../constants/platforms'

const integrated = PLATFORMS.filter(p => p.integrated)
const comingSoon = PLATFORMS.filter(p => !p.integrated)

describe('PLATFORMS constant', () => {
  it('has 7 integrated platforms', () => {
    expect(integrated).toHaveLength(7)
  })

  it('all integrated platforms have defaultEnabled: true', () => {
    integrated.forEach(p => {
      expect(p.defaultEnabled, `${p.id} should be defaultEnabled`).toBe(true)
    })
  })

  it('all integrated platforms have an endpoint', () => {
    integrated.forEach(p => {
      expect(p.endpoint, `${p.id} should have an endpoint`).toBeTruthy()
    })
  })

  it('no coming-soon platform has an endpoint', () => {
    comingSoon.forEach(p => {
      expect(p.endpoint, `${p.id} should not have an endpoint`).toBeUndefined()
    })
  })

  it('all platforms have required fields', () => {
    PLATFORMS.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.displayName).toBeTruthy()
      expect(p.logo).toBeTruthy()
      expect(p.brandColor).toBeTruthy()
      expect(typeof p.integrated).toBe('boolean')
    })
  })

  it('integrated platforms include google, yelp, reddit, youtube, tripadvisor, facebook, trustpilot', () => {
    const ids = integrated.map(p => p.id)
    expect(ids).toContain('google')
    expect(ids).toContain('yelp')
    expect(ids).toContain('reddit')
    expect(ids).toContain('youtube')
    expect(ids).toContain('tripadvisor')
    expect(ids).toContain('facebook')
    expect(ids).toContain('trustpilot')
  })

  it('PLATFORM_MAP contains all platform ids', () => {
    PLATFORMS.forEach(p => {
      expect(PLATFORM_MAP[p.id]).toBeDefined()
      expect(PLATFORM_MAP[p.id].id).toBe(p.id)
    })
  })
})
