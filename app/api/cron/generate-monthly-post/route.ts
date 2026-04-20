import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createPost, getAllPosts } from '@/lib/db'
import { autoPostTopics, pickNextTopic, fallbackFeaturedImage, type AutoPostTopic } from '@/lib/auto-post-topics'

/**
 * Monthly NC-focused blog post cron job.
 *
 * Triggered by Vercel Cron (see vercel.json) on the 1st of each month at 09:00 UTC.
 *
 * Flow:
 *   1. Authenticate via Bearer CRON_SECRET (Vercel Cron sends this automatically).
 *   2. Query all existing post slugs to skip topics that have already been published.
 *   3. Pick the next unused topic from the rotating list in lib/auto-post-topics.ts.
 *   4. Call the Anthropic API to draft a structured HTML blog post.
 *   5. Validate the response (length, slug uniqueness, required structure).
 *   6. Insert into the `posts` table with status='published' if AUTO_PUBLISH_POSTS=true,
 *      otherwise 'draft'. Fail-to-draft on any validation error or API failure.
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY        — required, the API key for Claude.
 *   CRON_SECRET              — required, the shared secret for Vercel Cron auth.
 *   AUTO_PUBLISH_POSTS       — optional, "true" to auto-publish, anything else -> draft.
 *   AUTO_POST_AUTHOR_ID      — optional user id to attribute the post to. Falls back to null.
 *   AUTO_POST_MODEL          — optional, Anthropic model id. Default: claude-sonnet-4-6.
 *
 * The route is also callable manually by a logged-in admin from the admin panel
 * (see /app/api/cron/generate-monthly-post/manual — implemented via ?manual=1
 * parameter and the same bearer check).
 */

export const maxDuration = 120 // seconds — generation can take ~30s, leave headroom.
export const dynamic = 'force-dynamic'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-6'
const BRAND_SYSTEM_PROMPT = `You are a senior insurance copywriter for BlackArrow Insurance, an independent insurance agency serving North Carolina with offices in Greenville and Whiteville.

House style:
- Practical, plainspoken, and warm — written for NC homeowners and small-business owners, not insurance professionals.
- NEVER market BlackArrow as "the best" or use hype. Be matter-of-fact and helpful.
- Reference specific NC places, waterways, counties, and weather patterns where they add value.
- Avoid legalese. When you must reference a statute or requirement, explain it in everyday terms.
- No bullet-point overload — prefer short paragraphs with the occasional 3–5 item bulleted list.
- Length: roughly 800–1200 words.

Output format: Return ONLY a single JSON object matching this exact schema — no preamble, no markdown fences, no explanation outside the JSON:

{
  "title": "string — may refine the seed title slightly; keep it under 75 characters",
  "excerpt": "string — a 1-2 sentence summary, under 180 characters",
  "seoTitle": "string — a search-optimized title under 60 characters, may differ from display title",
  "seoDescription": "string — a meta description 140–160 characters including the primary keyword",
  "contentHtml": "string — the full article body as clean HTML. Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <a href='/...'> tags only. No <h1> (the page renders that). No inline styles. No <div>. No <script>. Include at least 2 <h2> section headings. Include at least one contextually relevant internal link using the href slugs provided in the brief."
}

Do not wrap the JSON in a markdown code block. Return raw JSON only.`

type AnthropicResponse = {
  content?: Array<{ type: string; text?: string }>
  stop_reason?: string
  error?: { type: string; message: string }
}

type GeneratedPost = {
  title: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  contentHtml: string
}

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ ok: false, error: message }, { status: 401 })
}

function verifyCronAuth(req: NextRequest): boolean {
  // Trim defensively — if CRON_SECRET was pasted with trailing whitespace in the
  // Vercel env var UI, the literal value may contain characters that can't sit
  // in an HTTP header. We compare trimmed-against-trimmed so a correctly-sent
  // bearer token still matches even if the stored secret has stray whitespace.
  const secret = (process.env.CRON_SECRET || '').trim()
  if (!secret) return false
  const auth = (req.headers.get('authorization') || '').trim()
  return auth === `Bearer ${secret}`
}

async function callAnthropic(topic: AutoPostTopic, apiKey: string, model: string): Promise<GeneratedPost> {
  const internalLinkList = topic.internalLinks
    .map((slug) => `- /insurance/${slug}`)
    .join('\n')

  const userPrompt = `Write a blog post for BlackArrow Insurance.

TOPIC SEED TITLE: ${topic.title}
PRIMARY KEYWORD (must appear 3–5 times, including once in the first paragraph and at least one <h2>): ${topic.primaryKeyword}
SECONDARY KEYWORDS (weave in naturally where they fit): ${topic.secondaryKeywords.join(', ')}
CATEGORY: ${topic.category}
BRIEF: ${topic.brief}

REQUIRED INTERNAL LINKS (include at least one of these as an anchor in the body with descriptive link text):
${internalLinkList}

Do not mention prices or specific premium amounts — refer readers to request a quote at /quote instead. Do not include a generic conclusion that says "BlackArrow is the best." The article should be useful first and subtly position BlackArrow as a practical resource.

Return the JSON object only.`

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: BRAND_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Anthropic API ${response.status}: ${errorBody.slice(0, 500)}`)
  }

  const json = (await response.json()) as AnthropicResponse
  if (json.error) {
    throw new Error(`Anthropic API error: ${json.error.message}`)
  }

  const textBlock = json.content?.find((c) => c.type === 'text')
  if (!textBlock?.text) {
    throw new Error('Anthropic response missing text content')
  }

  // Strip potential markdown fencing just in case the model adds it.
  const rawText = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim()

  let parsed: GeneratedPost
  try {
    parsed = JSON.parse(rawText) as GeneratedPost
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${err instanceof Error ? err.message : String(err)}`)
  }

  return parsed
}

function validateGeneratedPost(post: GeneratedPost, topic: AutoPostTopic): { ok: true } | { ok: false; reason: string } {
  if (!post.title || post.title.length < 10 || post.title.length > 120) {
    return { ok: false, reason: `title length ${post.title?.length} out of 10–120` }
  }
  if (!post.excerpt || post.excerpt.length < 40 || post.excerpt.length > 250) {
    return { ok: false, reason: `excerpt length ${post.excerpt?.length} out of 40–250` }
  }
  if (!post.seoTitle || post.seoTitle.length < 10 || post.seoTitle.length > 70) {
    return { ok: false, reason: `seoTitle length ${post.seoTitle?.length} out of 10–70` }
  }
  if (!post.seoDescription || post.seoDescription.length < 100 || post.seoDescription.length > 170) {
    return { ok: false, reason: `seoDescription length ${post.seoDescription?.length} out of 100–170` }
  }
  const text = post.contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(Boolean).length
  if (wordCount < 500 || wordCount > 2000) {
    return { ok: false, reason: `word count ${wordCount} out of 500–2000` }
  }
  if (!/<h2[\s>]/i.test(post.contentHtml)) {
    return { ok: false, reason: 'contentHtml missing any <h2> section heading' }
  }
  if (/<h1[\s>]/i.test(post.contentHtml)) {
    return { ok: false, reason: 'contentHtml contains a <h1> (page layout renders this)' }
  }
  if (/<script/i.test(post.contentHtml) || /onerror=/i.test(post.contentHtml) || /javascript:/i.test(post.contentHtml)) {
    return { ok: false, reason: 'contentHtml contains disallowed script content' }
  }
  const primaryKwRegex = new RegExp(topic.primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const kwMatches = (post.contentHtml.match(primaryKwRegex) || []).length
  if (kwMatches < 1) {
    return { ok: false, reason: `primary keyword "${topic.primaryKeyword}" not found in body` }
  }
  return { ok: true }
}

export async function POST(req: NextRequest) {
  return handleGeneration(req)
}

// Vercel Cron invokes via GET by default; support both.
export async function GET(req: NextRequest) {
  return handleGeneration(req)
}

async function handleGeneration(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return unauthorized('Invalid or missing CRON_SECRET bearer token')
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const model = process.env.AUTO_POST_MODEL || DEFAULT_MODEL
  const shouldAutoPublish = (process.env.AUTO_PUBLISH_POSTS || '').toLowerCase() === 'true'
  const authorId = process.env.AUTO_POST_AUTHOR_ID || null

  try {
    // Gather every slug currently in the posts table (any status) so we don't
    // collide on an auto-topic that was already published or sitting as a draft.
    const existing = await getAllPosts()
    const usedSlugs = new Set(existing.map((p) => p.slug))

    const topic = pickNextTopic(usedSlugs)
    if (!topic) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'All topics in auto-post-topics.ts have been used. Add more topics or rotate the list.',
      })
    }

    // Call the model — if this throws we catch below and return 500 without writing to the DB.
    const generated = await callAnthropic(topic, apiKey, model)

    // Validate shape/length/content. On failure we still save to the DB as a draft
    // so the editor can fix and publish.
    const validation = validateGeneratedPost(generated, topic)
    const finalStatus = validation.ok && shouldAutoPublish ? 'published' : 'draft'

    const nowIso = new Date().toISOString()
    const post = await createPost({
      id: randomUUID(),
      title: generated.title,
      slug: topic.slug,
      excerpt: generated.excerpt,
      content: generated.contentHtml,
      category: topic.category,
      featured_image: topic.featuredImage || fallbackFeaturedImage,
      seo_title: generated.seoTitle,
      seo_description: generated.seoDescription,
      status: finalStatus,
      author_id: authorId,
      published_at: finalStatus === 'published' ? nowIso : null,
    })

    return NextResponse.json({
      ok: true,
      status: finalStatus,
      validation: validation.ok ? 'passed' : `fell back to draft: ${validation.reason}`,
      topic: {
        slug: topic.slug,
        category: topic.category,
        primaryKeyword: topic.primaryKeyword,
      },
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        url: `https://www.blackarrow.co/post/${post.slug}`,
        status: post.status,
      },
      remainingTopics: autoPostTopics.length - usedSlugs.size - 1,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate-monthly-post] failed:', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
