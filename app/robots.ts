import { MetadataRoute } from 'next'

/**
 * Single source of truth for robots.txt.
 *
 * There used to be a public/robots.txt alongside this file. Next serves static
 * files from public/ ahead of the app route, so that copy silently won and this
 * one was dead code that still had to be hand-synced. The static file is gone;
 * edit this and nothing else.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          // POST/cron endpoints only — nothing here is a landing page.
          '/api/',
        ],
      },
      // AI assistants and their crawlers. GPTBot, Google-Extended, and CCBot
      // were previously blocked on the reasoning that they don't send referral
      // traffic. That's no longer how these work: GPTBot backs ChatGPT search,
      // which cites and links its sources, and Google-Extended governs AI
      // Overviews / Gemini grounding — blocking it removes this agency from
      // exactly the "insurance agency near me" answers it wants to appear in,
      // without protecting anything, since all of this content is public
      // marketing copy meant to be found.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: 'https://www.blackarrow.co/sitemap.xml',
    host: 'https://www.blackarrow.co',
  }
}

/*
 * Two rules were removed rather than rewritten:
 *
 * 1. `Disallow: /_next/` blocked the CSS and JS Google needs to render a page,
 *    which Search Console flags as a rendering problem. It also now blocks
 *    /_next/image — every optimized image on the site is served from there
 *    since next.config.js turned the image optimizer back on, so keeping it
 *    would take the entire site out of image search.
 *
 * 2. `Disallow: /*?*utm_` (and the fbclid/gclid variants) stopped Google from
 *    crawling any campaign-tagged inbound link. A partner or newsletter link
 *    carrying ?utm_source= could not be fetched, so its canonical tag was
 *    never seen and its value never consolidated onto the canonical URL. Every
 *    page already declares `alternates.canonical`, which is the mechanism
 *    built for this — the same reasoning middleware.ts gives for no longer
 *    stripping campaign parameters.
 */
