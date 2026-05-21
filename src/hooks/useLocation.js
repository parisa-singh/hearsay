import { useState, useCallback } from 'react'
import { useUIStore } from '../store/uiStore'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

async function reverseGeocode(lat, lng) {
  const url = `${NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json`
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  })
  if (!res.ok) throw new Error('Nominatim failed')
  const data = await res.json()
  const addr = data.address ?? {}
  return {
    lat,
    lng,
    city: addr.city || addr.town || addr.village || addr.municipality || null,
    state: addr.state || null,
    country: addr.country || null,
    countryCode: addr.country_code?.toUpperCase() || null,
  }
}

export function useLocation() {
  const { location, setLocation, clearLocation } = useUIStore()
  const [status, setStatus] = useState('idle') // idle | requesting | granted | denied | error

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setStatus('error')
      return
    }
    setStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          if (loc.city) {
            setLocation(loc)
            setStatus('granted')
          } else {
            setStatus('error') // coords found but no city — show "somewhere interesting" state
          }
        } catch {
          setStatus('error')
        }
      },
      () => {
        setStatus('denied')
      },
      { timeout: 8000 }
    )
  }, [setLocation])

  const setManualLocation = useCallback(async (cityName) => {
    // Forward geocode the typed city name
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const [result] = await res.json()
      if (!result) return false
      const loc = await reverseGeocode(result.lat, result.lon)
      setLocation({ ...loc, city: cityName })
      setStatus('granted')
      return true
    } catch {
      return false
    }
  }, [setLocation])

  return {
    location,
    status,
    requestLocation,
    setManualLocation,
    clearLocation,
    hasLocation: Boolean(location?.city),
  }
}
