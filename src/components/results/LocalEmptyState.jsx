export default function LocalEmptyState({ query, city }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Animated map pin */}
      <div className="mb-6 relative">
        <svg
          width="56" height="72" viewBox="0 0 56 72"
          className="animate-bounce-pin"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
        >
          <ellipse cx="28" cy="66" rx="10" ry="4" fill="#27272a" opacity="0.5" />
          <path
            d="M28 4C17.5 4 9 12.5 9 23C9 38 28 62 28 62C28 62 47 38 47 23C47 12.5 38.5 4 28 4Z"
            fill="#3f3f46"
            stroke="#52525b"
            strokeWidth="1.5"
          />
          {/* Question mark */}
          <text x="28" y="30" textAnchor="middle" fill="#a1a1aa" fontSize="18" fontWeight="600" fontFamily="Inter, sans-serif">?</text>
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-zinc-300 mb-2">
        Not in {city} yet
      </h3>
      <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
        Looks like <span className="text-zinc-400">"{query}"</span> hasn't made it to {city} yet — or we couldn't find enough local reviews.
      </p>
      <p className="text-sm text-zinc-600 mt-1">
        Here's what the world is saying instead.
      </p>
    </div>
  )
}
