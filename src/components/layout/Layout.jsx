import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from './ErrorBoundary'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />
      {/* key={pathname} remounts the subtree on navigation, which also resets
          the ErrorBoundary so a crash on one page doesn't persist to the next */}
      <div key={pathname} className="flex-1 flex flex-col animate-fade-in">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  )
}
