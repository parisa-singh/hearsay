import { getCached, setCached } from '../utils/cache.js'
import { errorResponse } from '../utils/errors.js'
import { filterReviewsForCategory } from '../utils/relevanceFilter.js'

const YT_BASE = 'https://www.googleapis.com/youtube/v3'
const CACHE_TTL = 2 * 3600

// Filters out low-signal comments (reactions, sub begging, noise)
function isQualityComment(text) {
  if (!text || text.length < 35) return false
  // Filter "X subs" / subscriber-beg comments
  if (/\d+\s*(?:k\s*)?subs(?:cribers)?/i.test(text) && text.length < 80) return false
  // Filter pure emoji/reaction lines
  if (/^[\s\p{Emoji}\p{Emoji_Presentation}!.]+$/u.test(text)) return false
  return true
}

function buildSearchQuery(query, city, category) {
  switch (category) {
    case 'product':
      return `${query} review`
    case 'restaurant':
      return city ? `${query} ${city} restaurant review` : `${query} restaurant food review`
    case 'place':
      return city ? `${query} ${city} visit review` : `${query} travel visit review`
    case 'business':
      return city ? `${query} ${city} review` : `${query} review experience`
    default:
      return city ? `${query} ${city} review` : `${query} review`
  }
}

export async function youtubeHandler(request, env) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const city = searchParams.get('city')
  const category = searchParams.get('category')

  if (!query) return errorResponse('Missing query parameter', 400)

  const searchQuery = buildSearchQuery(query, city, category)
  const cacheKey = `youtube:${searchQuery}`
  const cached = await getCached(cacheKey)
  if (cached) return Response.json(cached)

  try {
    // Step 1: Search (costs 100 units)
    const searchP = new URLSearchParams({
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      maxResults: '5',
      relevanceLanguage: 'en',
      key: env.YOUTUBE_API_KEY,
    })
    const searchRes = await fetch(`${YT_BASE}/search?${searchP}`)
    const searchData = await searchRes.json()

    if (searchData.error) throw new Error(searchData.error.message)

    const videos = searchData.items ?? []
    if (videos.length === 0) {
      return Response.json({ platform: 'youtube', reviews: [], reviewCount: null, rating: null })
    }

    const videoIds = videos.map(v => v.id?.videoId).filter(Boolean).join(',')

    // Step 2: Video stats (1 unit per video)
    const statsP = new URLSearchParams({
      part: 'statistics,snippet',
      id: videoIds,
      key: env.YOUTUBE_API_KEY,
    })
    const statsRes = await fetch(`${YT_BASE}/videos?${statsP}`)
    const statsData = await statsRes.json()
    const statsMap = Object.fromEntries(
      (statsData.items ?? []).map(v => [v.id, v])
    )

    // Step 3: Comments for top 2 videos (1 unit each)
    const commentPromises = videos.slice(0, 2).map(async v => {
      const vid = v.id?.videoId
      if (!vid) return []
      try {
        const cP = new URLSearchParams({
          part: 'snippet',
          videoId: vid,
          maxResults: '10',
          order: 'relevance',
          key: env.YOUTUBE_API_KEY,
        })
        const cRes = await fetch(`${YT_BASE}/commentThreads?${cP}`)
        const cData = await cRes.json()
        return (cData.items ?? [])
          .map(c => ({
            text: c.snippet?.topLevelComment?.snippet?.textDisplay ?? '',
            rating: null,
            author: c.snippet?.topLevelComment?.snippet?.authorDisplayName ?? null,
            date: c.snippet?.topLevelComment?.snippet?.publishedAt ?? null,
            url: `https://youtube.com/watch?v=${vid}`,
            videoTitle: v.snippet?.title ?? null,
          }))
          .filter(c => isQualityComment(c.text))
      } catch {
        return []
      }
    })

    const allComments = (await Promise.all(commentPromises)).flat().slice(0, 8)

    // Also include video descriptions as review signals
    const videoReviews = videos.slice(0, 3).map(v => {
      const stats = statsMap[v.id?.videoId]
      return {
        text: v.snippet?.description?.slice(0, 300) ?? v.snippet?.title ?? '',
        rating: null,
        author: v.snippet?.channelTitle ?? null,
        date: v.snippet?.publishedAt ?? null,
        url: `https://youtube.com/watch?v=${v.id?.videoId}`,
        viewCount: stats?.statistics?.viewCount ?? null,
        likeCount: stats?.statistics?.likeCount ?? null,
      }
    })

    const rawReviews = [...allComments, ...videoReviews].slice(0, 8)
    const response = {
      platform: 'youtube',
      name: query,
      rating: null,
      reviewCount: videos.length,
      reviews: filterReviewsForCategory(rawReviews, category),
    }

    await setCached(cacheKey, response, CACHE_TTL)
    return Response.json(response)
  } catch (err) {
    return errorResponse(`YouTube API error: ${err.message}`)
  }
}
