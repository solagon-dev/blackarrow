import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

const INSIGHTS_URL = 'https://www.blackarrow.co/insights'
const POST_URL_PREFIX = 'https://www.blackarrow.co/post'
const DB_PATH = path.join(process.cwd(), 'data', 'blackarrow.db')
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'insights')
const PUBLIC_PREFIX = '/images/insights'

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .trim()
}

function extractLegacyCards(html) {
  const matches = html.matchAll(/<a href="\/post\/([^"]+)" class="insight-wrap w-inline-block">([\s\S]*?)<\/a><\/div>/g)
  const cards = new Map()

  for (const match of matches) {
    const slug = match[1]
    const cardHtml = match[2]
    const imageMatch = cardHtml.match(/<img src="([^"]+)"[^>]*class="insight-img"/)
    const titleMatch = cardHtml.match(/<div class="lp-blogpost-heading black">([\s\S]*?)<\/div>/)

    if (!imageMatch) continue

    cards.set(slug, {
      slug,
      listingImageUrl: imageMatch[1],
      title: titleMatch ? decodeHtml(titleMatch[1]) : slug,
    })
  }

  return cards
}

function extractLegacyPostImage(html) {
  const imageMatch = html.match(/<img src="([^"]+)"[^>]*class="current-blog-img"/)
  return imageMatch ? imageMatch[1] : null
}

function extractLegacyPostTitle(html) {
  const titleMatch = html.match(/<h1 class="heading">([\s\S]*?)<\/h1>/)
  return titleMatch ? decodeHtml(titleMatch[1]) : null
}

function getExtensionFromUrl(url) {
  const pathname = new URL(url).pathname
  const ext = path.extname(pathname).toLowerCase()
  return ext || '.jpg'
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(outputPath, buffer)
}

async function main() {
  console.log(`Fetching legacy insights from ${INSIGHTS_URL}`)
  const response = await fetch(INSIGHTS_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch insights page: ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  const cards = extractLegacyCards(html)
  if (cards.size === 0) {
    throw new Error('No legacy insight cards were extracted from the insights page.')
  }

  const db = new Database(DB_PATH)
  const posts = db.prepare('SELECT slug, title FROM posts').all()
  const dbSlugs = new Set(posts.map(post => post.slug))
  const scrapedSlugs = new Set(cards.keys())

  const missingFromLegacy = posts.filter(post => !scrapedSlugs.has(post.slug))
  const missingFromDb = [...cards.keys()].filter(slug => !dbSlugs.has(slug))

  if (missingFromLegacy.length > 0) {
    console.warn(`Missing ${missingFromLegacy.length} local posts from legacy insights:`)
    for (const post of missingFromLegacy) {
      console.warn(`  - ${post.slug}`)
    }
  }

  if (missingFromDb.length > 0) {
    console.warn(`Found ${missingFromDb.length} legacy insight cards with no local post:`)
    for (const slug of missingFromDb) {
      console.warn(`  - ${slug}`)
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const updatePost = db.prepare('UPDATE posts SET featured_image = ? WHERE slug = ?')

  let downloaded = 0
  let updated = 0

  for (const post of posts) {
    const card = cards.get(post.slug)
    if (!card) continue

    const postUrl = `${POST_URL_PREFIX}/${post.slug}`
    const postResponse = await fetch(postUrl)
    if (!postResponse.ok) {
      throw new Error(`Failed to fetch legacy post ${post.slug}: ${postResponse.status} ${postResponse.statusText}`)
    }

    const postHtml = await postResponse.text()
    const postTitle = extractLegacyPostTitle(postHtml)
    const postImageUrl = extractLegacyPostImage(postHtml) || card.listingImageUrl

    if (!postImageUrl) {
      throw new Error(`No legacy image found for post ${post.slug}`)
    }

    if (postTitle && postTitle !== post.title && postTitle !== card.title) {
      console.warn(`Title mismatch for ${post.slug}: local="${post.title}" legacy="${postTitle}"`)
    }

    const ext = getExtensionFromUrl(postImageUrl)
    const fileName = `${post.slug}${ext}`
    const outputPath = path.join(OUTPUT_DIR, fileName)
    const publicPath = `${PUBLIC_PREFIX}/${fileName}`

    await downloadFile(postImageUrl, outputPath)
    downloaded += 1
    console.log(`Downloaded ${fileName}`)

    const result = updatePost.run(publicPath, post.slug)
    if (result.changes > 0) {
      updated += 1
    }
  }

  console.log(`Scraped ${cards.size} legacy insight cards.`)
  console.log(`Downloaded ${downloaded} images into ${OUTPUT_DIR}`)
  console.log(`Updated ${updated} posts with local featured_image paths.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
