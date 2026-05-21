import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-7xl mb-6">🔍</p>
        <h1 className="text-2xl font-bold text-white mb-3">Nothing to hear here</h1>
        <p className="text-zinc-500 mb-8 max-w-sm">
          This page doesn't exist — but the reviews do. Try searching for something.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-white text-zinc-900 rounded-xl font-medium hover:bg-zinc-100 transition-colors"
        >
          Back to search
        </Link>
      </main>
      <Footer />
    </div>
  )
}
