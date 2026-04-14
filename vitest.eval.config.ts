/**
 * Vitest configuration for the eval (slow / LLM-backed) test suite.
 *
 * These tests require a live Ollama instance and are intentionally excluded
 * from the default `npm test` run to keep CI fast.
 *
 * ## How to run
 * ```bash
 * npm run test:eval
 * ```
 *
 * ## Prerequisites
 * - Ollama running at `OLLAMA_BASE_URL` (default: http://localhost:11434)
 * - At least one model pulled (e.g. `ollama pull llama3.1:8b-instruct-q8_0`)
 * - Optional: Qdrant at `QDRANT_URL` (default: http://localhost:6333)
 * - Optional: PostgreSQL at `DATABASE_URL` for persistence evals
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/evals/**/*.eval.ts'],
        exclude: ['node_modules/**'],
        environment: 'node',
        globals: true,
        /* Evals can take minutes — generous timeout */
        testTimeout: 300_000,
        hookTimeout: 30_000
    }
});
