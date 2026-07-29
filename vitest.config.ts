import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

/**
 * Vitest configuration for BlackArrow.
 *
 * Default test environment is `node` (API routes, lib functions). Component /
 * accessibility tests that need a DOM opt in per-file with:
 *   // @vitest-environment jsdom
 *
 * The `@/` alias mirrors tsconfig.json (`@/* -> ./*`) so imports resolve the
 * same way in tests as in the app.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.{ts,tsx}', 'lib/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
    // Keep tests hermetic: never load the developer's real .env.local secrets.
    env: {
      NODE_ENV: 'test',
    },
  },
})
