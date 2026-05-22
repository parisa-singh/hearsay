import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { PLATFORM_MAP } from '../../constants/platforms'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="text-zinc-200 font-medium">{entry.value.toFixed(1)} / 5</span>
        </div>
      ))}
    </div>
  )
}

export default function ComparisonChart({ results }) {
  const [open, setOpen] = useState(false)
  const ratedPlatforms = results.filter(r => r.data?.rating != null && !r.isError)
  if (ratedPlatforms.length < 2) return null

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          Platform Comparison
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={ratedPlatforms.map(r => ({
              platform: r.platform.displayName,
              rating: Number(r.data.rating),
            }))}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis
                dataKey="platform"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 5]}
                tick={{ fill: '#71717a', fontSize: 10 }}
              />
              {ratedPlatforms.map(r => (
                <Radar
                  key={r.platform.id}
                  name={r.platform.displayName}
                  dataKey="rating"
                  stroke={r.platform.brandColor}
                  fill={r.platform.brandColor}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-2 space-y-2">
            {ratedPlatforms
              .sort((a, b) => b.data.rating - a.data.rating)
              .map(r => (
                <div key={r.platform.id} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-24 text-right">{r.platform.displayName}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(r.data.rating / 5) * 100}%`,
                        backgroundColor: r.platform.brandColor,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 w-8">{Number(r.data.rating).toFixed(1)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
