/**
 * Unit tests for packages/shared/environment.ts
 */

import { afterEach, describe, expect, it } from 'vitest';
import { validateRequiredEnvironment } from '@/packages/shared/environment.js';

describe('validateRequiredEnvironment', () => {
    const REQUIRED_KEYS = ['OLLAMA_MODEL', 'OLLAMA_BASE_URL', 'OLLAMA_EMBED_MODEL'] as const;
    type RequiredKey = (typeof REQUIRED_KEYS)[number];
    const saved: Partial<Record<RequiredKey, string | undefined>> = {};

    function setAll(): void {
        process.env.OLLAMA_MODEL = 'llama3.1:8b';
        process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
        process.env.OLLAMA_EMBED_MODEL = 'nomic-embed-text:latest';
    }

    afterEach(() => {
        for (const key of REQUIRED_KEYS) {
            if (saved[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = saved[key];
            }
        }
        Object.keys(saved).forEach((k) => delete saved[k as RequiredKey]);
    });

    it('throws when OLLAMA_MODEL is missing', () => {
        setAll();
        delete process.env.OLLAMA_MODEL;
        expect(() => validateRequiredEnvironment()).toThrow('OLLAMA_MODEL');
    });

    it('throws when OLLAMA_MODEL is empty', () => {
        setAll();
        process.env.OLLAMA_MODEL = '   ';
        expect(() => validateRequiredEnvironment()).toThrow('OLLAMA_MODEL');
    });

    it('throws when OLLAMA_BASE_URL is missing', () => {
        setAll();
        delete process.env.OLLAMA_BASE_URL;
        expect(() => validateRequiredEnvironment()).toThrow('OLLAMA_BASE_URL');
    });

    it('throws when OLLAMA_EMBED_MODEL is missing', () => {
        setAll();
        delete process.env.OLLAMA_EMBED_MODEL;
        expect(() => validateRequiredEnvironment()).toThrow('OLLAMA_EMBED_MODEL');
    });

    it('does not throw when all three required vars are set (no profile vars needed)', () => {
        setAll();
        /* Profile-specific model vars must NOT be required — they fall back to OLLAMA_MODEL. */
        delete process.env.AGENT_MODEL_FAST;
        delete process.env.AGENT_MODEL_REASONING;
        delete process.env.AGENT_MODEL_CODE;
        expect(() => validateRequiredEnvironment()).not.toThrow();
    });

    it('error message includes a quickstart hint', () => {
        setAll();
        delete process.env.OLLAMA_MODEL;
        expect(() => validateRequiredEnvironment()).toThrow('quickstart');
    });
});
