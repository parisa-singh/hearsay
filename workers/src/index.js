import { Router } from 'itty-router'
import { handleOptions, addCorsHeaders } from './utils/cors.js'
import { errorResponse } from './utils/errors.js'
import { googleHandler } from './routes/google.js'
import { yelpHandler } from './routes/yelp.js'
import { redditHandler } from './routes/reddit.js'
import { youtubeHandler } from './routes/youtube.js'
import { tripadvisorHandler } from './routes/tripadvisor.js'
import { facebookHandler } from './routes/facebook.js'
import { trustpilotHandler } from './routes/trustpilot.js'

const router = Router()

// Handle CORS preflight — must be first
router.options('*', handleOptions)

// Platform routes
router.get('/google', googleHandler)
router.get('/yelp', yelpHandler)
router.get('/reddit', redditHandler)
router.get('/youtube', youtubeHandler)
router.get('/tripadvisor', tripadvisorHandler)
router.get('/facebook', facebookHandler)
router.get('/trustpilot', trustpilotHandler)

// Google photo proxy — keeps API key server-side, resolves Places photo redirect
router.get('/google-photo', async (request, env) => {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')
  if (!ref) return new Response('Missing ref', { status: 400 })
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${encodeURIComponent(ref)}&key=${env.GOOGLE_API_KEY}`,
    { redirect: 'manual' }
  )
  const location = res.headers.get('location')
  if (!location) return new Response('Photo not found', { status: 404 })
  return new Response(null, {
    status: 302,
    headers: { Location: location, 'Cache-Control': 'public, max-age=86400' },
  })
})

// Health check
router.get('/', () => Response.json({ status: 'ok', service: 'hearsay-api' }))

// 404 fallback
router.all('*', () => errorResponse('Not found', 404))

export default {
  async fetch(request, env, ctx) {
    const response = await router.handle(request, env, ctx)
      .catch(err => errorResponse(err.message ?? 'Internal server error'))
    return addCorsHeaders(response, request)
  },
}
