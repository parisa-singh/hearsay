import { usePlatformToggles } from '../../hooks/usePlatformToggles'
import { useUIStore } from '../../store/uiStore'
import { getPlatformTiers } from '../../utils/platformRegions'

function PlatformChip({ platform, enabled, onToggle }) {
  return (
    <button
      onClick={() => onToggle(platform.id)}
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
    </button>
  )
}

export default function PlatformToggle() {
  const { platforms, isPlatformEnabled, togglePlatform } = usePlatformToggles()
  const location = useUIStore(s => s.location)

  const countryCode = location?.countryCode ?? null
  const city = location?.city ?? null

  if (!countryCode) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {platforms.map(p => (
          <PlatformChip key={p.id} platform={p} enabled={isPlatformEnabled(p.id)} onToggle={togglePlatform} />
        ))}
      </div>
    )
  }

  const { primary, secondary } = getPlatformTiers(countryCode)
  const platformMap = Object.fromEntries(platforms.map(p => [p.id, p]))

  const primaryPlatforms = primary.map(id => platformMap[id]).filter(Boolean)
  const secondaryPlatforms = secondary.map(id => platformMap[id]).filter(Boolean)

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-zinc-500 text-center mb-2">
          Popular in {city ?? location.country}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {primaryPlatforms.map(p => (
            <PlatformChip key={p.id} platform={p} enabled={isPlatformEnabled(p.id)} onToggle={togglePlatform} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-zinc-700 text-center mb-2">More platforms</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {secondaryPlatforms.map(p => (
            <PlatformChip key={p.id} platform={p} enabled={isPlatformEnabled(p.id)} onToggle={togglePlatform} />
          ))}
        </div>
      </div>
    </div>
  )
}
