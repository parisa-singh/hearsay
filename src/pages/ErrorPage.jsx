import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  let status = null
  let title = 'Something went wrong'
  let message = 'An unexpected error occurred. Try refreshing the page.'

  if (isRouteErrorResponse(error)) {
    status = error.status
    if (error.status === 404) {
      title = 'Page not found'
      message = "This page doesn't exist — but the reviews do."
    } else if (error.status === 401) {
      title = 'Not authorised'
      message = "You don't have permission to view this page."
    } else if (error.status >= 500) {
      title = 'Server error'
      message = 'Something went wrong on our end. Try again in a moment.'
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Minimal header */}
      <header className="border-b border-zinc-800 px-4 h-14 flex items-center">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white hover:text-zinc-300 transition-colors">
          hearsay <span className="text-xs text-zinc-500 font-normal">beta</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {status && (
          <p className="text-6xl font-bold text-zinc-800 mb-4 tabular-nums">{status}</p>
        )}

        <h1 className="text-2xl font-bold text-white mb-3">{title}</h1>
        <p className="text-zinc-400 mb-8 max-w-sm leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => window.location.reload()}
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

        {/* Dev-only error detail */}
        {import.meta.env.DEV && error instanceof Error && (
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
    </div>
  )
}
