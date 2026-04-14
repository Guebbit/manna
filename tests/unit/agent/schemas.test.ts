/**
 * Unit tests for packages/agent/schemas.ts
 *
 * Tests the agentStepSchema Zod schema that validates every LLM response
 * in the agent loop.
 */

import { describe, it, expect } from 'vitest';
import { agentStepSchema } from '../../../packages/agent/schemas.js';

describe('agentStepSchema', () => {
    it('parses a valid step with a tool action', () => {
        const raw = {
            thought: 'I need to read the file to understand its content.',
            action: 'read_file',
            input: { path: 'src/index.ts' }
        };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.thought).toBe(raw.thought);
            expect(result.data.action).toBe('read_file');
            expect(result.data.input).toEqual({ path: 'src/index.ts' });
        }
    });

    it('parses a valid step with action "none" and empty input', () => {
        const raw = {
            thought: 'The task is complete.',
            action: 'none',
            input: {}
        };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(true);
    });

    it('rejects when thought is missing', () => {
        const raw = { action: 'none', input: {} };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('rejects when thought is an empty string', () => {
        const raw = { thought: '', action: 'none', input: {} };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('rejects when action is missing', () => {
        const raw = { thought: 'thinking', input: {} };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('rejects when action is an empty string', () => {
        const raw = { thought: 'thinking', action: '', input: {} };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('rejects when input is missing', () => {
        const raw = { thought: 'thinking', action: 'none' };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('rejects when input is not an object', () => {
        const raw = { thought: 'thinking', action: 'none', input: 'string-input' };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('rejects when input is an array', () => {
        const raw = { thought: 'thinking', action: 'none', input: [1, 2, 3] };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(false);
    });

    it('accepts nested input objects', () => {
        const raw = {
            thought: 'Need to search.',
            action: 'semantic_search',
            input: { query: 'unit tests', collection: 'agent_memory', limit: 5 }
        };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(true);
    });

    it('throws on parse() when schema fails', () => {
        expect(() => agentStepSchema.parse({ thought: '', action: 'none', input: {} })).toThrow();
    });

    it('accepts extra unknown keys in input (record of unknown)', () => {
        const raw = {
            thought: 'I will scaffold the project.',
            action: 'project_scaffold',
            input: { template: 'express-ts', dest: 'out/', extras: { lint: true } }
        };
        const result = agentStepSchema.safeParse(raw);
        expect(result.success).toBe(true);
    });
});
