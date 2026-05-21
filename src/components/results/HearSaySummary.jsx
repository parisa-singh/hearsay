export default function HearSaySummary({ query, synthesis, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 animate-pulse">
        <div className="h-4 w-48 rounded bg-zinc-800 mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-zinc-800" />
          <div className="h-3 w-5/6 rounded bg-zinc-800" />
          <div className="h-3 w-4/6 rounded bg-zinc-800" />
        </div>
      </div>
    )
  }

  if (!synthesis) return null

  const { hearsay_summary, positive_themes = [], negative_themes = [] } = synthesis

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          The Hearsay on "{query}"
        </h2>
      </div>

      <p className="text-zinc-100 leading-relaxed">{hearsay_summary}</p>

      {(positive_themes.length > 0 || negative_themes.length > 0) && (
        <div className="pt-2 border-t border-zinc-800 space-y-3">
          {positive_themes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {positive_themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-400 border border-emerald-800/50"
                >
                  + {theme}
                </span>
              ))}
            </div>
          )}
          {negative_themes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {negative_themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800/40"
                >
                  − {theme}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
