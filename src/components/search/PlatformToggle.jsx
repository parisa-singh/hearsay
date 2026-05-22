import { useState, useEffect, useRef } from 'react'
import { useUIStore } from '../../store/uiStore'
import { PLATFORM_MAP, PLATFORMS } from '../../constants/platforms'
import { getPlatformTiers } from '../../utils/platformRegions'

export default function PlatformToggle() {
  const { isPlatformEnabled, togglePlatform, location } = useUIStore()

  const countryCode = location?.countryCode ?? null
  const city = location?.city ?? null

  const [showBanner, setShowBanner] = useState(false)
  const prevCountryCode = useRef(null)

  useEffect(() => {
    if (countryCode && countryCode !== prevCountryCode.current) {
      prevCountryCode.current = countryCode
      setShowBanner(true)
      const t = setTimeout(() => setShowBanner(false), 3000)
      return () => clearTimeout(t)
    }
  }, [countryCode])

  // No location: flat list of integrated platforms only
  if (!countryCode) {
    const integrated = PLATFORMS.filter(p => p.integrated)
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {integrated.map(p => {
          const enabled = isPlatformEnabled(p.id)
          return (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 ${
                enabled
                  ? 'border-green-700/50 bg-green-950/40 text-green-300'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
              }`}
            >
              <img
                src={p.logo}
                alt=""
                width={13}
                height={13}
                className={`rounded-sm ${enabled ? 'opacity-100' : 'opacity-30'}`}
                onError={e => { e.target.style.display = 'none' }}
              />
              <span>{p.displayName}</span>
            </button>
          )
        })}
      </div>
    )
  }

  const { platforms: regionalIds } = getPlatformTiers(countryCode)
  const regionalPlatforms = (regionalIds ?? []).map(id => PLATFORM_MAP[id]).filter(Boolean)

  const integratedCount = regionalPlatforms.filter(p => p.integrated).length
  const comingSoonCount = regionalPlatforms.filter(p => !p.integrated).length

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-zinc-500 text-center mb-2">
          Popular in {city ?? location.country}
        </p>
        <div key={countryCode} className="flex flex-wrap gap-2 justify-center">
          {regionalPlatforms.map((p, i) =>
            p.integrated ? (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 animate-slide-up ${
                  isPlatformEnabled(p.id)
                    ? 'border-green-700/50 bg-green-950/40 text-green-300'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                }`}
              >
                <img
                  src={p.logo}
                  alt=""
                  width={13}
                  height={13}
                  className={`rounded-sm ${isPlatformEnabled(p.id) ? 'opacity-100' : 'opacity-30'}`}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <span>{p.displayName}</span>
              </button>
            ) : (
              <div
                key={p.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-zinc-800 bg-zinc-900/30 text-zinc-700 opacity-60 cursor-not-allowed animate-slide-up"
                title={`${p.displayName} — coming soon`}
              >
                <img
                  src={p.logo}
                  alt=""
                  width={13}
                  height={13}
                  className="rounded-sm opacity-20"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <span>{p.displayName}</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded font-normal leading-none">
                  Soon
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {showBanner && (
        <button
          onClick={() => setShowBanner(false)}
          className="w-full text-center text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 animate-fade-in hover:border-zinc-700 transition-colors"
        >
          Showing platforms popular in {city ?? location.country}
          {' · '}<span className="text-green-400">{integratedCount} available now</span>
          {comingSoonCount > 0 && (
            <>{' · '}<span className="text-zinc-600">{comingSoonCount} coming soon</span></>
          )}
        </button>
      )}
    </div>
  )
}
