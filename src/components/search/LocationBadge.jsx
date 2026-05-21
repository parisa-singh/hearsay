import { useState } from 'react'
import { useLocation } from '../../hooks/useLocation'

export default function LocationBadge() {
  const { location, status, requestLocation, setManualLocation, clearLocation, hasLocation } = useLocation()
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  async function handleManualSubmit(e) {
    e.preventDefault()
    const success = await setManualLocation(inputValue.trim())
    if (success) {
      setEditing(false)
      setInputValue('')
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
        <input
          autoFocus
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter city name…"
          className="text-sm px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
        <button type="submit" className="text-sm text-zinc-300 hover:text-white transition-colors">Set</button>
        <button type="button" onClick={() => setEditing(false)} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
      </form>
    )
  }

  if (hasLocation) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-500">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span>
          {location.city}{location.state ? `, ${location.state}` : ''}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="text-zinc-600 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          Change
        </button>
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Enter your city for local reviews
      </button>
    )
  }

  return (
    <button
      onClick={requestLocation}
      disabled={status === 'requesting'}
      className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      {status === 'requesting' ? 'Detecting location…' : 'Detect my location for local reviews'}
    </button>
  )
}
