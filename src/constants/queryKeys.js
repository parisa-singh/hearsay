export const queryKeys = {
  platform: (platformId, query, location, category, refreshCount) => [
    'platform', platformId, query, location?.city ?? 'global', category ?? 'any', refreshCount ?? 0,
  ],
  synthesis: (query, platformIds) => ['synthesis', query, platformIds.sort().join(',')],
}
