import { errorResponse } from '../utils/errors.js'

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT = `You are a review synthesis engine for Hearsay, a multi-platform review aggregator.
Analyze the review data provided and respond ONLY with valid JSON matching the exact schema specified.
No preamble, no markdown code blocks — raw JSON only.
Never invent details not present in the source reviews. Be honest, specific, and conversational.

Fake review signals to watch for:
- Unusually bimodal ratings (90%+ 5-star + many 1-star, almost no middle)
- Generic, repetitive text lacking specific product details
- Platform disagreement exceeding 1.5 rating points suggests incentivized reviews on one platform
- Multiple reviews with identical or near-identical phrasing`

function buildUserPrompt(query, platforms, location) {
  const locationNote = location?.city
    ? `User location: ${location.city}, ${location.country ?? ''}. Note if local sentiment differs from global.`
    : ''

  const platformBlocks = platforms.map(p => {
    const ratingLine = p.rating != null ? `Rating: ${p.rating}/5` : 'No star rating'
    const countLine = p.reviewCount != null ? `(${p.reviewCount} reviews)` : ''
    const reviewLines = p.reviews
      .filter(r => r.text?.length > 20)
      .slice(0, 5)
      .map((r, i) => `${i + 1}. "${r.text.slice(0, 250)}"${r.rating ? ` (${r.rating}★)` : ''}`)
      .join('\n')
    return `[${p.platform.toUpperCase()}] ${ratingLine} ${countLine}\n${reviewLines || 'No review text available.'}`
  }).join('\n\n')

  return `Synthesize reviews for: "${query}"
${locationNote}

${platformBlocks}

Respond with this exact JSON schema:
{
  "hearsay_summary": "3-4 sentences, cross-platform synthesis, conversational tone",
  "positive_themes": ["theme1", "theme2", "theme3", "theme4", "theme5"],
  "negative_themes": ["concern1", "concern2", "concern3"],
  "divergence": {
    "detected": false,
    "explanation": "",
    "platform_a": "",
    "platform_b": ""
  },
  "fake_review_risk": {
    "level": "low",
    "reasoning": "1-2 sentences"
  }
}`
}

export async function synthesizeHandler(request, env) {
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405)

  let body
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  const { query, platforms, location } = body
  if (!query || !platforms?.length) return errorResponse('Missing query or platforms', 400)

  // Filter to platforms with at least some content
  const validPlatforms = platforms.filter(p => p.reviews?.length > 0 || p.rating != null)
  if (validPlatforms.length < 2) {
    return errorResponse('Need at least 2 platforms with data for synthesis', 422)
  }

  try {
    const res = await fetch(CLAUDE_URL, {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserPrompt(query, validPlatforms, location) }],
      }),
    })

    const data = await res.json()
    if (data.error) throw new Error(data.error.message ?? 'Claude API error')

    const text = data.content?.[0]?.text ?? ''

    // Parse JSON — Claude should return raw JSON per our system prompt
    let synthesis
    try {
      synthesis = JSON.parse(text)
    } catch {
      // Fallback: try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        synthesis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Claude returned non-JSON response')
      }
    }

    return Response.json(synthesis)
  } catch (err) {
    return errorResponse(`Synthesis error: ${err.message}`)
  }
}
