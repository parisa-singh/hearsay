import { useState } from 'react'
import { riskColor } from '../../utils/sentimentColor'

export default function FakeRiskBadge({ fakeRisk }) {
  const [showReasoning, setShowReasoning] = useState(false)
  if (!fakeRisk?.level) return null

  const colors = riskColor(fakeRisk.level)
  const label = {
    low: 'Fake Review Risk: Low',
    medium: 'Fake Review Risk: Medium',
    high: 'Fake Review Risk: High',
  }[fakeRisk.level] ?? 'Fake Review Risk: Unknown'

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowReasoning(v => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${colors.text} ${colors.bg} ${colors.border}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={showReasoning ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}/>
        </svg>
      </button>

      {showReasoning && fakeRisk.reasoning && (
        <div className={`absolute left-0 top-full mt-2 z-10 max-w-xs rounded-lg border p-3 text-xs shadow-xl bg-zinc-900 ${colors.border}`}>
          <p className="text-zinc-300 leading-relaxed">{fakeRisk.reasoning}</p>
        </div>
      )}
    </div>
  )
}
