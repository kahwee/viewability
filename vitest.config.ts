import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/types.ts'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 100, functions: 100, statements: 100, branches: 100 },
    },
  },
})
