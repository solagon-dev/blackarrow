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

const SIZE_THRESHOLD = 500 * 1024 // 500 KB — anything larger gets processed
const MAX_WIDTH = 1920
const JPEG_QUALITY = 82
const PNG_QUALITY = 85

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

async function optimize(file) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null
  const before = (await stat(file)).size
  if (before < SIZE_THRESHOLD) return null

  const pipeline = sharp(file, { failOn: 'error' }).rotate() // respect EXIF orientation
  const metadata = await pipeline.metadata()
  const resized = metadata.width > MAX_WIDTH
    ? pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
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
    const size = (await stat(f)).size
    if (size >= SIZE_THRESHOLD) candidates.push({ file: f, size })
  }

  candidates.sort((a, b) => b.size - a.size)
  console.log(`Found ${candidates.length} images > ${formatBytes(SIZE_THRESHOLD)} to process\n`)

  let totalBefore = 0
  let totalAfter = 0
  let processed = 0
  for (const { file } of candidates) {
    const relative = file.replace(IMAGES_ROOT + '/', '')
    try {
      const result = await optimize(file)
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
