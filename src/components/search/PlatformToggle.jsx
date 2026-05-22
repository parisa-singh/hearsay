import { usePlatformToggles } from '../../hooks/usePlatformToggles'

const ENABLED_COLOR = '#22c55e'

export default function PlatformToggle() {
  const { platforms, isPlatformEnabled, togglePlatform } = usePlatformToggles()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {platforms.map(platform => {
        const enabled = isPlatformEnabled(platform.id)
        return (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
              border transition-all duration-200
              ${enabled
                ? 'border-green-700/50 bg-green-950/40 text-green-300'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
              }
            `}
          >
            <img
              src={platform.logo}
              alt=""
              width={13}
              height={13}
              className={`rounded-sm ${enabled ? 'opacity-100' : 'opacity-30'}`}
              onError={e => { e.target.style.display = 'none' }}
            />
            <span>{platform.displayName}</span>
            {!platform.defaultEnabled && (
              <span className={`text-xs ${enabled ? 'text-green-600' : 'text-zinc-700'}`}>(opt-in)</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
