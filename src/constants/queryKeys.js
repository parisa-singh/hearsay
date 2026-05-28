export const queryKeys = {
  platform: (platformId, query, location, category) => [
    'platform', platformId, query, location?.city ?? 'global', category ?? 'any',
  ],
  synthesis: (query, platformIds) => ['synthesis', query, platformIds.sort().join(',')],
}
