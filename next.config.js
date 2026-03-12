/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true,
  },
  serverExternalPackages: ['better-sqlite3'],
}

module.exports = nextConfig
