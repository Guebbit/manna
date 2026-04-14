/**
 * Unit tests for packages/memory/memory.ts — optimizeContextWindow
 *
 * Tests the pure helper that trims memory entries to fit within a
 * character budget, preferring the most recent entries.
 *
 * (addMemory / getMemory / clearMemory require Qdrant + Ollama and are
 * covered in the integration test tier.)
 */

import { describe, it, expect } from 'vitest';
import { optimizeContextWindow } from '../../../packages/memory/memory.js';

describe('optimizeContextWindow', () => {
    it('returns an empty array when given an empty entries list', () => {
        expect(optimizeContextWindow([])).toEqual([]);
    });

    it('returns all entries when their total length is within the budget', () => {
        const entries = ['hello', 'world'];
        const result = optimizeContextWindow(entries, 100);
        expect(result).toEqual(['hello', 'world']);
    });

    it('excludes entries that would push the total over the budget', () => {
        // entries: 'a' (1 char) + 'bb' (2 chars) + 'ccc' (3 chars) = 6
        // walk from newest: 'ccc' (3) ok, 'bb' (2) → total 5 ok, 'a' (1) → total 6 ok
        const entries = ['a', 'bb', 'ccc'];
        const result = optimizeContextWindow(entries, 6);
        expect(result).toEqual(['a', 'bb', 'ccc']);
    });

    it('drops the oldest entry when total exceeds the budget', () => {
        // 'old-long-entry' (14) would make total 19 > 16; skip it
        const entries = ['old-long-entry', 'newer', 'newest'];
        // budget=16: newest(6) + newer(5) = 11 ≤ 16 → include; old(14) would push to 25 > 16 → skip
        const result = optimizeContextWindow(entries, 16);
        expect(result).toContain('newer');
        expect(result).toContain('newest');
        expect(result).not.toContain('old-long-entry');
    });

    it('uses default budget of 8000 characters', () => {
        const entries = Array.from({ length: 10 }, (_, i) => 'x'.repeat(100 + i));
        const result = optimizeContextWindow(entries);
        // total < 8000 so all should be returned
        expect(result).toHaveLength(entries.length);
    });

    it('returns only the newest entries that fit', () => {
        const entries = ['a', 'b', 'c', 'd', 'e'];
        // budget 3 chars: walk newest→oldest, 'e'(1)+'d'(1)+'c'(1)=3 ≤ 3 → fits; 'b' would push to 4
        const result = optimizeContextWindow(entries, 3);
        expect(result).toEqual(['c', 'd', 'e']);
    });

    it('preserves the order oldest → newest in the returned list', () => {
        const entries = ['first', 'second', 'third'];
        const result = optimizeContextWindow(entries, 1000);
        expect(result).toEqual(['first', 'second', 'third']);
    });

    it('returns an empty array when even the newest single entry is too long', () => {
        // Each entry is 10 chars; budget = 5 → none fit
        const entries = ['1234567890', 'abcdefghij'];
        const result = optimizeContextWindow(entries, 5);
        expect(result).toEqual([]);
    });

    it('handles a single entry exactly filling the budget', () => {
        const entries = ['exactsize'];
        const result = optimizeContextWindow(entries, 9);
        expect(result).toEqual(['exactsize']);
    });
});
