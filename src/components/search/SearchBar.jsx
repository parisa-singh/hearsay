import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'

const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurant / Café' },
  { id: 'product', label: 'Product' },
  { id: 'place', label: 'Place / Hotel' },
  { id: 'business', label: 'Business / Service' },
]

export default function SearchBar({ initialValue = '', initialCategory = null, compact = false }) {
  const [value, setValue] = useState(initialValue)
  const [category, setCategory] = useState(initialCategory)
  const navigate = useNavigate()
  const addToHistory = useUIStore(s => s.addToHistory)

  const canSubmit = value.trim() !== '' && category !== null

  function handleSubmit(e) {
    e.preventDefault()
    const q = value.trim()
    if (!q || !category) return
    addToHistory(q, category)
    navigate(`/results?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`)
  }

  const pillPad = compact ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col gap-3 ${compact ? '' : 'max-w-2xl mx-auto'}`}>
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(prev => prev === c.id ? null : c.id)}
              className={`
                ${pillPad} rounded-full border font-medium transition-all duration-150
                ${category === c.id
                  ? 'border-white bg-white text-zinc-900 shadow-sm'
                  : 'border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-400 hover:text-white'
                }
              `}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Input + submit */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={compact ? 'Search again…' : 'Search for a restaurant, product, or place…'}
              className={`
                w-full pl-11 pr-4 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100
                placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500
                focus:border-transparent transition-all
                ${compact ? 'py-2.5 text-sm' : 'py-4 text-base'}
              `}
              autoComplete="off"
              autoFocus={!compact}
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
              flex-shrink-0 bg-white text-zinc-900 font-medium rounded-xl
              hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
              ${compact ? 'px-4 py-2.5 text-sm' : 'px-6 py-4 text-base'}
            `}
          >
            Search
          </button>
        </div>

        {/* Category required notification */}
        {value.trim() && !category && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-amber-950/70 border border-amber-700/70">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-amber-400">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span className="text-sm font-medium text-amber-300">
              Select a category above to enable search
            </span>
          </div>
        )}
      </div>
    </form>
  )
}
