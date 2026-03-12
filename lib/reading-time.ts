/**
 * Estimates reading time from HTML content.
 * Strips tags, counts words, assumes ~230 words/minute.
 */
export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 230))
}

/**
 * Formats reading time as a human-readable string.
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`
}
