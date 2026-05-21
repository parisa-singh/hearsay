import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'

export default function SearchBar({ initialValue = '', compact = false }) {
  const [value, setValue] = useState(initialValue)
  const navigate = useNavigate()
  const addToHistory = useUIStore(s => s.addToHistory)

  function handleSubmit(e) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    addToHistory(q)
    navigate(`/results?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center gap-2 ${compact ? '' : 'max-w-2xl mx-auto'}`}>
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
          disabled={!value.trim()}
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
    </form>
  )
}
