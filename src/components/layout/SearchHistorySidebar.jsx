import { useUIStore } from '../../store/uiStore'

export default function SearchHistorySidebar() {
  const { historyOpen, setHistoryOpen, searchHistory, clearHistory } = useUIStore()

  if (!historyOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-zinc-950/60"
        onClick={() => setHistoryOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 z-50 bg-zinc-900 border-l border-zinc-800 flex flex-col"
        style={{ animation: 'slideInRight 300ms ease-out' }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-200">Recent searches</h2>
          <button
            onClick={() => setHistoryOpen(false)}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {searchHistory.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-8">No searches yet</p>
          ) : (
            searchHistory.map(q => (
              <a
                key={q}
                href={`/hearsay/results?q=${encodeURIComponent(q)}`}
                onClick={() => setHistoryOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-zinc-600">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span className="truncate">{q}</span>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        {searchHistory.length > 0 && (
          <div className="px-4 py-3 border-t border-zinc-800">
            <button
              onClick={() => { clearHistory(); setHistoryOpen(false) }}
              className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  )
}
