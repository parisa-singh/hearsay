import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-13 sm:h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="text-lg sm:text-xl font-semibold tracking-tight text-white group-hover:text-zinc-300 transition-colors">
            hearsay
          </span>
          <span className="text-xs text-zinc-500 font-normal mt-0.5">beta</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/about"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            About
          </Link>
          <a
            href="https://github.com/parisa-singh/hearsay"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            GitHub
          </a>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
