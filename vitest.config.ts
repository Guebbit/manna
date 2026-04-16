/**
 * Vitest configuration for unit and integration tests.
 *
 * Run: `npm test`  (or `npx vitest run`)
 * Watch: `npm run test:watch`
 * Coverage: `npm run test:coverage`
 *
 * Eval / slow tests use a separate config: `vitest.eval.config.ts`
 * Run with: `npm run test:eval`
 */

import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url))
        }
    },
    test: {
        /* Test files: under tests/ but NOT under tests/evals/ */
        include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
        exclude: ['tests/evals/**', 'node_modules/**'],

        /* Environment — Node.js (default for backend code) */
        environment: 'node',

        /* Globals (describe, it, expect, vi) without imports */
        globals: true,

        /* Coverage via V8 */
        coverage: {
            provider: 'v8',
            include: ['packages/**/*.ts', 'apps/**/*.ts'],
            exclude: [
                'packages/**/README.md',
                'node_modules/**',
                'dist/**',
                'tests/**',
                '**/*.d.ts'
            ],
            reporter: ['text', 'lcov', 'html']
        },

        /* Timeout per test */
        testTimeout: 10_000
    }
});
