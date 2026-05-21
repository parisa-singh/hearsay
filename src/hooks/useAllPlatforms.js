import { useQueries } from '@tanstack/react-query'
import { fetchPlatform } from '../utils/api'
import { queryKeys } from '../constants/queryKeys'
import { useUIStore } from '../store/uiStore'
import { PLATFORMS } from '../constants/platforms'

/**
 * Fires parallel queries for all enabled platforms.
 * Uses useQueries so each platform has its own loading/error state.
 * Promise.allSettled semantics: one platform failing doesn't block others.
 */
export function useAllPlatforms(query) {
  const { isPlatformEnabled, location } = useUIStore()
  const enabledPlatforms = PLATFORMS.filter(p => isPlatformEnabled(p.id))

  const locationParams = location
    ? { lat: location.lat, lng: location.lng, city: location.city, country: location.country }
    : {}

  const queries = useQueries({
    queries: enabledPlatforms.map(platform => ({
      queryKey: queryKeys.platform(platform.id, query, location),
      queryFn: () => fetchPlatform(platform.endpoint, { query, ...locationParams }),
      enabled: Boolean(query),
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  })

  const results = enabledPlatforms.map((platform, i) => ({
    platform,
    data: queries[i]?.data ?? null,
    isLoading: queries[i]?.isLoading ?? false,
    isError: queries[i]?.isError ?? false,
    error: queries[i]?.error ?? null,
  }))

  const isAnyLoading = results.some(r => r.isLoading)
  const successfulResults = results.filter(r => r.data && !r.isError)

  return { results, isAnyLoading, successfulResults }
}
