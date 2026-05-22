import { Link } from 'react-router-dom'

export default function Header() {
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
        </nav>
      </div>
    </header>
  )
}
