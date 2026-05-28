import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { error } = this.state

    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-800/40 flex items-center justify-center mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Something crashed</h2>
        <p className="text-zinc-400 text-sm mb-8 max-w-sm">
          A component threw an unexpected error. Refreshing usually fixes it.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            className="px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-medium hover:bg-zinc-100 transition-colors text-sm"
          >
            Refresh page
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:border-zinc-500 hover:text-white transition-colors text-sm"
          >
            Back to search
          </Link>
        </div>

        {import.meta.env.DEV && error && (
          <details className="mt-10 text-left max-w-xl w-full">
            <summary className="text-xs text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors">
              Error details (dev only)
            </summary>
            <pre className="mt-3 p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-red-400 overflow-auto whitespace-pre-wrap">
              {error.stack ?? error.message}
            </pre>
          </details>
        )}
      </main>
    )
  }
}
