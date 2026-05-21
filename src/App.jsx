import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

const router = createBrowserRouter(
  [
    { path: '/', element: <HomePage /> },
    { path: '/results', element: <ResultsPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
  { basename: '/hearsay' }
)

export default function App() {
  return <RouterProvider router={router} />
}
