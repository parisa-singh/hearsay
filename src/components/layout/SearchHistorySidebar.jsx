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
        className="fixed inset-0 z-40 bg-zinc-950/70"
        onClick={() => { setHistoryOpen(false); setConfirmItem(null); setConfirmClearAll(false) }}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 z-50 bg-zinc-900 border-l border-zinc-700 flex flex-col"
        style={{ animation: 'slideInRight 300ms ease-out' }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-100">Search history</h2>
          <button
            onClick={() => setHistoryOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-1">
          {items.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-10">No searches yet</p>
          ) : (
            items.map(item => (
              confirmItem === item.q ? (
                <div key={item.q} className="px-4 py-3 bg-red-950/30 border-b border-red-900/40">
                  <p className="text-sm text-zinc-200 font-medium truncate mb-0.5">
                    Delete "{item.q}"?
                  </p>
                  <p className="text-xs text-zinc-400 mb-3">This permanently removes it from your history and cannot be undone.</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteItem(item.q)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                    >
                      Delete permanently
                    </button>
                    <button
                      onClick={() => setConfirmItem(null)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div key={item.q} className="group flex items-center gap-1 px-4 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800/60">
                  <a
                    href={itemHref(item)}
                    onClick={() => setHistoryOpen(false)}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-zinc-500">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span className="truncate text-sm text-zinc-200 group-hover:text-white transition-colors">{item.q}</span>
                    {item.category && (
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1.5 py-0.5 rounded shrink-0 capitalize">{item.category}</span>
                    )}
                  </a>
                  <button
                    onClick={() => setConfirmItem(item.q)}
                    className="shrink-0 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-all"
                    aria-label={`Delete "${item.q}"`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Footer — Clear All */}
        <div className="px-4 py-4 border-t border-zinc-700">
          {confirmClearAll ? (
            <div className="rounded-lg bg-red-950/40 border border-red-800/60 p-3">
              <p className="text-sm text-zinc-200 font-medium mb-1">
                Delete all {items.length} searches?
              </p>
              <p className="text-xs text-zinc-400 mb-3">This is permanent and cannot be undone.</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                >
                  Delete all permanently
                </button>
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            items.length > 0 && (
              <button
                onClick={() => setConfirmClearAll(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-zinc-600 text-zinc-300 text-sm font-medium hover:border-red-700 hover:text-red-400 hover:bg-red-950/20 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Clear all history
              </button>
            )
          )}
        </div>
      </div>
    </>
  )
}
