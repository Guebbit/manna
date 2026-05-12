/**
 * Unit tests for packages/processors/policy.ts
 */

import { describe, it, expect } from 'vitest';
import { createPolicyProcessor, PolicyViolationError } from '@/packages/processors/policy.js';

const WRITE_TOOL_NAMES = new Set(['write_file', 'scaffold_project']);

describe('PolicyViolationError', () => {
    it('exposes code and step fields', () => {
        const error = new PolicyViolationError('E_CONSECUTIVE_ERRORS', 'too many errors', 3);
        expect(error.code).toBe('E_CONSECUTIVE_ERRORS');
        expect(error.step).toBe(3);
        expect(error.message).toBe('too many errors');
        expect(error.name).toBe('PolicyViolationError');
        expect(error instanceof PolicyViolationError).toBe(true);
        expect(error instanceof Error).toBe(true);
    });
});

describe('PolicyProcessor — processInputStep', () => {
    it('returns the input args unchanged when counters are within limits', () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES,
            consecutiveErrorLimit: 3
        });
        const args = { task: 'test', context: '', memory: [], stepNumber: 0, tools: [] };
        const result = proc.processInputStep!(args);
        expect(result).toEqual(args);
    });

    it('throws E_CONSECUTIVE_ERRORS when consecutiveErrors >= limit', async () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES,
            consecutiveErrorLimit: 2
        });
        const resultArgs = {
            task: '',
            stepNumber: 0,
            tool: 'read_file',
            input: {},
            success: false,
            durationMs: 1
        };

        /* Simulate 2 consecutive tool failures. */
        await proc.processToolResult!(resultArgs);
        await proc.processToolResult!(resultArgs);

        const inputArgs = { task: 'test', context: '', memory: [], stepNumber: 2, tools: [] };
        expect(() => proc.processInputStep!(inputArgs)).toThrow(PolicyViolationError);

        try {
            proc.processInputStep!(inputArgs);
        } catch (error) {
            expect(error instanceof PolicyViolationError).toBe(true);
            expect((error as PolicyViolationError).code).toBe('E_CONSECUTIVE_ERRORS');
        }
    });

    it('resets consecutiveErrors counter after a successful tool call', async () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES,
            consecutiveErrorLimit: 2
        });
        const failArgs = {
            task: '',
            stepNumber: 0,
            tool: 'read_file',
            input: {},
            success: false,
            durationMs: 1
        };
        const successArgs = {
            task: '',
            stepNumber: 0,
            tool: 'read_file',
            input: {},
            success: true,
            result: 'ok',
            durationMs: 1
        };

        await proc.processToolResult!(failArgs);
        await proc.processToolResult!(failArgs);
        /* Reset by a successful call. */
        await proc.processToolResult!(successArgs);

        const inputArgs = { task: 'test', context: '', memory: [], stepNumber: 3, tools: [] };
        /* Should not throw now — counter was reset. */
        expect(() => proc.processInputStep!(inputArgs)).not.toThrow();
    });

    it('throws early when hardStopErrors >= 2 (E_PATH_OUTSIDE_ROOT)', async () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES,
            consecutiveErrorLimit: 10
        });
        const hardFailArgs = {
            task: '',
            stepNumber: 0,
            tool: 'read_file',
            input: {},
            success: false,
            error: 'Access denied',
            errorCode: 'E_PATH_OUTSIDE_ROOT',
            durationMs: 1
        };

        await proc.processToolResult!(hardFailArgs);
        await proc.processToolResult!(hardFailArgs);

        const inputArgs = { task: 'test', context: '', memory: [], stepNumber: 2, tools: [] };
        expect(() => proc.processInputStep!(inputArgs)).toThrow(PolicyViolationError);
    });
});

describe('PolicyProcessor — processOutputStep', () => {
    it('returns the output args unchanged for a read tool when allowWrite is false', () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES
        });
        const args = {
            task: 'test',
            stepNumber: 0,
            text: '',
            thought: '',
            action: 'read_file',
            toolInput: {}
        };
        const result = proc.processOutputStep!(args);
        expect(result).toEqual(args);
    });

    it('throws E_PERMISSION_DENIED when a write tool is called with allowWrite=false', () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES
        });
        const args = {
            task: 'test',
            stepNumber: 0,
            text: '',
            thought: '',
            action: 'write_file',
            toolInput: {}
        };
        expect(() => proc.processOutputStep!(args)).toThrow(PolicyViolationError);

        try {
            proc.processOutputStep!(args);
        } catch (error) {
            expect((error as PolicyViolationError).code).toBe('E_PERMISSION_DENIED');
        }
    });

    it('allows write tools when allowWrite is true', () => {
        const proc = createPolicyProcessor({
            allowWrite: true,
            writeToolNames: WRITE_TOOL_NAMES
        });
        const args = {
            task: 'test',
            stepNumber: 0,
            text: '',
            thought: '',
            action: 'write_file',
            toolInput: {}
        };
        expect(() => proc.processOutputStep!(args)).not.toThrow();
    });

    it('does not throw for action "none" even when allowWrite is false', () => {
        const proc = createPolicyProcessor({
            allowWrite: false,
            writeToolNames: WRITE_TOOL_NAMES
        });
        const args = {
            task: 'test',
            stepNumber: 0,
            text: '',
            thought: 'done',
            action: 'none',
            toolInput: {}
        };
        expect(() => proc.processOutputStep!(args)).not.toThrow();
    });
});
