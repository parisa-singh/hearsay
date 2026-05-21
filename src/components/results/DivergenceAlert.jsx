import { PLATFORM_MAP } from '../../constants/platforms'

export default function DivergenceAlert({ divergence }) {
  if (!divergence?.detected) return null

  const platformA = PLATFORM_MAP[divergence.platform_a]
  const platformB = PLATFORM_MAP[divergence.platform_b]

  return (
    <div className="rounded-xl border border-amber-700/50 bg-amber-900/20 p-4 flex gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-400 mb-1">
          Platform Divergence Detected
          {platformA && platformB && ` — ${platformA.displayName} vs ${platformB.displayName}`}
        </p>
        <p className="text-sm text-amber-200/80">{divergence.explanation}</p>
      </div>
    </div>
  )
}
