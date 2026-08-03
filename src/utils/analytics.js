/**
 * Google Analytics 4 — loaded only when VITE_GA_MEASUREMENT_ID is set.
 * With no ID (typical in dev), every function here is a silent no-op, so the
 * app runs untouched and no gtag script is ever injected.
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export const analyticsEnabled = Boolean(GA_ID)

let initialized = false

export function initGA() {
  if (initialized || !analyticsEnabled || typeof window === 'undefined') return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  // send_page_view: false — we fire page_view manually on each route change so
  // client-side navigations are counted (gtag can't see SPA nav on its own).
  gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageView(path) {
  if (!analyticsEnabled || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (!analyticsEnabled || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, params)
}
