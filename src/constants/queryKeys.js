export const queryKeys = {
  platform: (platformId, query, location) => ['platform', platformId, query, location?.city ?? 'global'],
  synthesis: (query, platformIds) => ['synthesis', query, platformIds.sort().join(',')],
}
