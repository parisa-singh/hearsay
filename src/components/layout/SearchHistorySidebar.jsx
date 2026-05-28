import { useState } from 'react'
import { useUIStore } from '../../store/uiStore'

function normalizeItem(item) {
  if (typeof item === 'string') return { q: item, category: null }
  return item
}

function itemHref(item) {
  const norm = normalizeItem(item)
  const base = `/hearsay/results?q=${encodeURIComponent(norm.q)}`
  return norm.category ? `${base}&category=${encodeURIComponent(norm.category)}` : base
}

export default function SearchHistorySidebar() {
  const { historyOpen, setHistoryOpen, searchHistory, removeFromHistory, clearHistory } = useUIStore()
  const [confirmItem, setConfirmItem] = useState(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  if (!historyOpen) return null

  const items = searchHistory.map(normalizeItem)

  function handleDeleteItem(q) {
    removeFromHistory(q)
    setConfirmItem(null)
  }

  function handleClearAll() {
    clearHistory()
    setHistoryOpen(false)
    setConfirmClearAll(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-zinc-950/60"
        onClick={() => { setHistoryOpen(false); setConfirmItem(null); setConfirmClearAll(false) }}
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
          {items.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-8">No searches yet</p>
          ) : (
            items.map(item => (
              confirmItem === item.q ? (
                <div key={item.q} className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
                  <p className="text-xs text-zinc-300 truncate mb-1">
                    Delete <span className="font-medium">"{item.q}"</span>?
                  </p>
                  <p className="text-xs text-zinc-600 mb-2">This permanently removes it from your history.</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteItem(item.q)}
                      className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete permanently
                    </button>
                    <button
                      onClick={() => setConfirmItem(null)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div key={item.q} className="group flex items-center gap-1 px-4 py-2.5 hover:bg-zinc-800/60 transition-colors">
                  <a
                    href={itemHref(item)}
                    onClick={() => setHistoryOpen(false)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-zinc-600">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span className="truncate">{item.q}</span>
                    {item.category && (
                      <span className="text-xs text-zinc-600 shrink-0 capitalize">{item.category}</span>
                    )}
                  </a>
                  <button
                    onClick={() => setConfirmItem(item.q)}
                    className="shrink-0 p-1 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Delete "${item.q}"`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              )
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-t border-zinc-800">
            {confirmClearAll ? (
              <div>
                <p className="text-xs text-zinc-400 mb-2">
                  Permanently delete all {items.length} searches? This cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete all permanently
                  </button>
                  <button
                    onClick={() => setConfirmClearAll(false)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClearAll(true)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
