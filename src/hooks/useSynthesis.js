import { useQuery } from '@tanstack/react-query'
import { postSynthesis } from '../utils/api'
import { queryKeys } from '../constants/queryKeys'

/**
 * Fires the Claude synthesis call once we have platform data.
 * Only triggers when at least 2 platforms have returned data.
 */
export function useSynthesis(query, platformResults, location) {
  const successfulPlatforms = platformResults.filter(r => r.data && !r.isError)
  const enabled = Boolean(query) && successfulPlatforms.length >= 2

  return useQuery({
    queryKey: queryKeys.synthesis(query, successfulPlatforms.map(r => r.platform.id)),
    queryFn: () =>
      postSynthesis({
        query,
        location: location ?? null,
        platforms: successfulPlatforms.map(r => ({
          platform: r.platform.id,
          rating: r.data.rating ?? null,
          reviewCount: r.data.reviewCount ?? null,
          reviews: (r.data.reviews ?? []).slice(0, 5).map(rev => ({
            text: (rev.text ?? '').slice(0, 250),
            rating: rev.rating ?? null,
          })),
        })),
      }),
    enabled,
    staleTime: 10 * 60 * 1000,
    retry: 0, // Don't retry failed Claude calls — they cost money
  })
}
