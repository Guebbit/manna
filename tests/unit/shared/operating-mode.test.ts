/**
 * Unit tests for packages/shared/operating-mode.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveOperatingMode, resolveOperatingModeConfig } from '@/packages/shared/operating-mode.js';

describe('resolveOperatingMode', () => {
    const originalEnv = process.env.AGENT_OPERATING_MODE;

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.AGENT_OPERATING_MODE;
        } else {
            process.env.AGENT_OPERATING_MODE = originalEnv;
        }
    });

    it('returns "standard" when env var is not set', () => {
        delete process.env.AGENT_OPERATING_MODE;
        expect(resolveOperatingMode()).toBe('standard');
    });

    it('returns "low-spec" when env var is "low-spec"', () => {
        process.env.AGENT_OPERATING_MODE = 'low-spec';
        expect(resolveOperatingMode()).toBe('low-spec');
    });

    it('returns "high-trust" when env var is "high-trust"', () => {
        process.env.AGENT_OPERATING_MODE = 'high-trust';
        expect(resolveOperatingMode()).toBe('high-trust');
    });

    it('returns "standard" for an unrecognised value', () => {
        process.env.AGENT_OPERATING_MODE = 'turbo';
        expect(resolveOperatingMode()).toBe('standard');
    });

    it('is case-insensitive', () => {
        process.env.AGENT_OPERATING_MODE = 'HIGH-TRUST';
        expect(resolveOperatingMode()).toBe('high-trust');
    });
});

describe('resolveOperatingModeConfig', () => {
    const savedKeys = [
        'AGENT_OPERATING_MODE',
        'AGENTS_MAX_STEPS',
        'AGENT_MAX_TOOL_CALLS',
        'AGENT_CONSECUTIVE_ERROR_LIMIT'
    ] as const;
    type EnvKey = (typeof savedKeys)[number];
    const saved: Partial<Record<EnvKey, string | undefined>> = {};

    beforeEach(() => {
        for (const key of savedKeys) {
            saved[key] = process.env[key];
            delete process.env[key];
        }
    });

    afterEach(() => {
        for (const key of savedKeys) {
            if (saved[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = saved[key];
            }
        }
    });

    it('returns standard defaults when no env vars are set', () => {
        const config = resolveOperatingModeConfig();
        expect(config.maxSteps).toBe(20);
        expect(config.maxToolCalls).toBe(10);
        expect(config.consecutiveErrorLimit).toBe(3);
        expect(config.selfDebugEnabled).toBe(true);
    });

    it('returns low-spec defaults for low-spec mode', () => {
        process.env.AGENT_OPERATING_MODE = 'low-spec';
        const config = resolveOperatingModeConfig();
        expect(config.maxSteps).toBe(5);
        expect(config.maxToolCalls).toBe(3);
        expect(config.consecutiveErrorLimit).toBe(2);
        expect(config.selfDebugEnabled).toBe(false);
    });

    it('returns high-trust defaults for high-trust mode', () => {
        process.env.AGENT_OPERATING_MODE = 'high-trust';
        const config = resolveOperatingModeConfig();
        expect(config.maxSteps).toBe(50);
        expect(config.maxToolCalls).toBe(20);
        expect(config.consecutiveErrorLimit).toBe(5);
        expect(config.selfDebugEnabled).toBe(true);
    });

    it('honours AGENTS_MAX_STEPS override over mode default', () => {
        process.env.AGENT_OPERATING_MODE = 'low-spec';
        process.env.AGENTS_MAX_STEPS = '12';
        expect(resolveOperatingModeConfig().maxSteps).toBe(12);
    });

    it('honours AGENT_CONSECUTIVE_ERROR_LIMIT override', () => {
        process.env.AGENT_CONSECUTIVE_ERROR_LIMIT = '7';
        expect(resolveOperatingModeConfig().consecutiveErrorLimit).toBe(7);
    });

    it('ignores non-positive AGENTS_MAX_STEPS override', () => {
        process.env.AGENT_OPERATING_MODE = 'standard';
        process.env.AGENTS_MAX_STEPS = '0';
        expect(resolveOperatingModeConfig().maxSteps).toBe(20);
    });
});
