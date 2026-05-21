import { usePlatformToggles } from '../../hooks/usePlatformToggles'

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
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              border transition-all duration-200
              ${enabled
                ? 'border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500'
              }
            `}
            style={enabled ? { borderColor: `${platform.brandColor}40`, backgroundColor: `${platform.brandColor}15` } : {}}
          >
            <img
              src={platform.logo}
              alt=""
              width={14}
              height={14}
              className={`rounded-sm ${enabled ? 'opacity-100' : 'opacity-30'}`}
              onError={e => { e.target.style.display = 'none' }}
            />
            <span style={enabled ? { color: platform.brandColor } : {}}>
              {platform.displayName}
            </span>
            {!platform.defaultEnabled && (
              <span className="text-xs text-zinc-600">(opt-in)</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
