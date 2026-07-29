#!/usr/bin/env node
/**
 * One-shot image optimizer for public/images/*.
 *
 * Targets every JPEG/PNG over SIZE_THRESHOLD bytes, downscales to MAX_WIDTH
 * px if wider, and re-encodes at QUALITY. Overwrites in place (atomically via
 * a temp-file + rename) so file paths don't change. Skips SVGs, WEBPs, and
 * anything under the threshold.
 *
 * Run with: node scripts/optimize-images.mjs
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_ROOT = join(__dirname, '..', 'public', 'images')

/**
 * Per-directory rules. Sources feed next/image, which re-encodes to AVIF/WebP
 * on demand — so this pass exists to stop us committing (and deploying, and
 * re-optimizing) files far larger than anything we ever render.
 *
 * Ordered most-specific first; the first matching prefix wins.
 */
const RULES = [
  {
    // Article art: square illustrations, rendered at most ~800 CSS px, but
    // committed as 1024px PNGs of 375–770 KB each. Palette-quantized PNG holds
    // up well for flat illustration and cuts them by roughly 4x.
    match: 'insights/',
    maxWidth: 1024,
    threshold: 200 * 1024,
  },
  {
    // Carrier logos render in a 144px slot. Several were shipping at 1024–3301px
    // wide (safeco.png: 236 KB; orchid.png: 3301px). 2x the slot is plenty.
    match: 'carrier-logos/',
    maxWidth: 400,
    threshold: 15 * 1024,
  },
  {
    // Photography used for page heroes and section art.
    match: '',
    maxWidth: 1920,
    threshold: 250 * 1024,
  },
]

const JPEG_QUALITY = 82
const PNG_QUALITY = 80

// Require sharp at runtime so we fail cleanly with install instructions if it's missing.
let sharp
try {
  sharp = (await import('sharp')).default
} catch (err) {
  console.error('sharp not installed. Run: npm install --save-dev sharp')
  process.exit(1)
}

function formatBytes(n) {
  if (n > 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`
  if (n > 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${n} B`
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else {
      files.push(full)
    }
  }
  return files
}

/** First matching rule wins; `match: ''` is the catch-all and must stay last. */
function ruleFor(relativePath) {
  return RULES.find(r => relativePath.startsWith(r.match)) ?? RULES[RULES.length - 1]
}

async function optimize(file, rule) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null
  const before = (await stat(file)).size
  if (before < rule.threshold) return null

  const pipeline = sharp(file, { failOn: 'error' }).rotate() // respect EXIF orientation
  const metadata = await pipeline.metadata()
  const resized = metadata.width > rule.maxWidth
    ? pipeline.resize({ width: rule.maxWidth, withoutEnlargement: true })
    : pipeline

  const temp = `${file}.optimizing`
  if (ext === '.png') {
    await resized
      .png({ compressionLevel: 9, quality: PNG_QUALITY, palette: true })
      .toFile(temp)
  } else {
    await resized
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toFile(temp)
  }

  const after = (await stat(temp)).size
  // Only keep the new version if it's actually smaller.
  if (after >= before) {
    await unlink(temp)
    return { file, before, after, kept: false }
  }
  await rename(temp, file)
  return { file, before, after, kept: true, width: metadata.width, height: metadata.height }
}

async function main() {
  const files = await walk(IMAGES_ROOT)
  const candidates = []
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
    const relative = f.replace(IMAGES_ROOT + '/', '')
    const rule = ruleFor(relative)
    const size = (await stat(f)).size
    if (size >= rule.threshold) candidates.push({ file: f, size, rule })
  }

  candidates.sort((a, b) => b.size - a.size)
  console.log(`Found ${candidates.length} images over their per-directory threshold\n`)

  let totalBefore = 0
  let totalAfter = 0
  let processed = 0
  for (const { file, rule } of candidates) {
    const relative = file.replace(IMAGES_ROOT + '/', '')
    try {
      const result = await optimize(file, rule)
      if (!result) continue
      totalBefore += result.before
      totalAfter += result.after
      processed++
      const savingsPct = Math.round(((result.before - result.after) / result.before) * 100)
      const status = result.kept ? '✓' : '—'
      console.log(
        `${status} ${relative.padEnd(60)} ${formatBytes(result.before).padStart(10)} → ${formatBytes(result.after).padStart(10)}  (${savingsPct}%)`
      )
    } catch (err) {
      console.error(`✗ ${relative}: ${err.message}`)
    }
  }

  console.log(`\nProcessed ${processed} images`)
  console.log(`Total before: ${formatBytes(totalBefore)}`)
  console.log(`Total after:  ${formatBytes(totalAfter)}`)
  console.log(`Savings:      ${formatBytes(totalBefore - totalAfter)} (${Math.round(((totalBefore - totalAfter) / totalBefore) * 100)}%)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
