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

  const pillBase = compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col gap-3 ${compact ? '' : 'max-w-2xl mx-auto'}`}>
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

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(prev => prev === c.id ? null : c.id)}
              className={`
                ${pillBase} rounded-full border font-medium transition-all duration-150
                ${category === c.id
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }
              `}
            >
              {c.label}
            </button>
          ))}
          {value.trim() && !category && (
            <span className="self-center text-xs text-zinc-600 ml-1">
              Select a category to search
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
