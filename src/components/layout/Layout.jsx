import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />
      <div key={pathname} className="flex-1 flex flex-col animate-fade-in">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
