function extractVideos(reviews) {
  const seen = new Set()
  const videos = []
  for (const r of reviews ?? []) {
    if (!r.url) continue
    const videoId = new URLSearchParams(r.url.split('?')[1] ?? '').get('v')
    if (!videoId || seen.has(videoId)) continue
    seen.add(videoId)
    videos.push({
      videoId,
      title: r.videoTitle ?? null,
      url: r.url,
      viewCount: r.viewCount ?? null,
    })
  }
  return videos.slice(0, 3)
}

function formatViewCount(n) {
  if (!n) return null
  const num = parseInt(n, 10)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`
  if (num >= 1_000) return `${Math.round(num / 1_000)}K views`
  return `${num} views`
}

function VideosSection({ videos }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
        </svg>
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Videos</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {videos.map(v => (
          <a
            key={v.videoId}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-40 group"
          >
            <div className="relative rounded-lg overflow-hidden bg-zinc-800 mb-2">
              <img
                src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                alt={v.title ?? 'Video'}
                className="w-full aspect-video object-cover group-hover:opacity-75 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            {v.title && (
              <p className="text-xs text-zinc-300 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {v.title}
              </p>
            )}
            {v.viewCount && (
              <p className="text-xs text-zinc-600 mt-0.5">{formatViewCount(v.viewCount)}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}

function PhotosSection({ photos, sourceUrl }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Photos</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.slice(0, 3).map((p, i) => (
          <a
            key={i}
            href={sourceUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden bg-zinc-800 aspect-[4/3] hover:opacity-80 transition-opacity"
          >
            <img
              src={p.url}
              alt="Place photo"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          View more on Google Maps
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
        </a>
      )}
    </div>
  )
}

export default function MediaCard({ results }) {
  const ytResult = results.find(r =>
    r.platform.id === 'youtube' && !r.isLoading && (r.data?.reviews?.length ?? 0) > 0
  )
  const googleResult = results.find(r =>
    r.platform.id === 'google' && !r.isLoading && (r.data?.photos?.length ?? 0) > 0
  )

  const videos = extractVideos(ytResult?.data?.reviews)
  const photos = googleResult?.data?.photos ?? []
  const googleSourceUrl = googleResult?.data?.sourceUrl ?? null

  if (videos.length === 0 && photos.length === 0) return null

  const hasBoth = videos.length > 0 && photos.length > 0

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 animate-slide-up">
      <div className={`flex flex-col gap-5 ${hasBoth ? 'lg:flex-row lg:gap-6' : ''}`}>
        {videos.length > 0 && <VideosSection videos={videos} />}
        {hasBoth && <div className="hidden lg:block w-px bg-zinc-800 self-stretch shrink-0" />}
        {photos.length > 0 && (
          <PhotosSection photos={photos} sourceUrl={googleSourceUrl} />
        )}
      </div>
    </div>
  )
}
