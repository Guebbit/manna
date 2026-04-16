/**
 * Unit tests for packages/shared/chunker.ts
 *
 * Tests the chunkText function that splits long text into overlapping
 * chunks for embedding and vector-database ingestion.
 */

import { describe, it, expect } from 'vitest';
import { chunkText } from '@/packages/shared/chunker.js';

describe('chunkText', () => {
    it('returns an empty array for empty input', () => {
        expect(chunkText('')).toEqual([]);
    });

    it('returns a single chunk when text fits within chunkSize', () => {
        const result = chunkText('Hello world', { chunkSize: 100, overlap: 0 });
        expect(result).toHaveLength(1);
        expect(result[0].content).toBe('Hello world');
        expect(result[0].index).toBe(0);
    });

    it('splits text into multiple chunks with correct content', () => {
        const text = 'abcdefghij'; // 10 chars
        const result = chunkText(text, { chunkSize: 4, overlap: 0 });
        // step = 4, chunks: [0,4), [4,8), [8,12)
        expect(result).toHaveLength(3);
        expect(result[0].content).toBe('abcd');
        expect(result[1].content).toBe('efgh');
        expect(result[2].content).toBe('ij');
    });

    it('produces overlapping chunks when overlap > 0', () => {
        const text = 'abcdefghij'; // 10 chars
        // chunkSize=5, overlap=2 → step=3
        // [0,5)='abcde', [3,8)='defgh', [6,11)='ghij'
        const result = chunkText(text, { chunkSize: 5, overlap: 2 });
        expect(result[0].content).toBe('abcde');
        expect(result[1].content).toBe('defgh');
        expect(result[2].content).toBe('ghij');
    });

    it('assigns sequential zero-based indices to each chunk', () => {
        const text = 'abcdefghij';
        const result = chunkText(text, { chunkSize: 4, overlap: 0 });
        expect(result.map((c) => c.index)).toEqual([0, 1, 2]);
    });

    it('uses defaults (chunkSize=500, overlap=50) when options are omitted', () => {
        const text = 'x'.repeat(600);
        const result = chunkText(text);
        // step = 500 - 50 = 450; first chunk [0,500), second [450, 950) but capped at 600
        expect(result.length).toBeGreaterThan(1);
        expect(result[0].content).toHaveLength(500);
    });

    it('handles overlap equal to chunkSize - 1', () => {
        const text = 'abcde';
        // chunkSize=3, overlap=2 → step=1
        const result = chunkText(text, { chunkSize: 3, overlap: 2 });
        expect(result[0].content).toBe('abc');
        expect(result[1].content).toBe('bcd');
        expect(result[2].content).toBe('cde');
    });

    it('clamps overlap to chunkSize - 1 if overlap >= chunkSize', () => {
        // overlap=5, chunkSize=3 → clamped to 2
        const text = 'abcde';
        const result = chunkText(text, { chunkSize: 3, overlap: 5 });
        // step=1; same as overlap=2
        expect(result[0].content).toBe('abc');
        expect(result[1].content).toBe('bcd');
    });

    it('enforces minimum chunkSize of 1', () => {
        const text = 'abc';
        const result = chunkText(text, { chunkSize: 0, overlap: 0 });
        // step=1 (min chunkSize=1, overlap=0)
        expect(result).toHaveLength(3);
    });

    it('returns a single chunk when text length equals chunkSize exactly', () => {
        const text = 'abcd';
        const result = chunkText(text, { chunkSize: 4, overlap: 0 });
        expect(result).toHaveLength(1);
        expect(result[0].content).toBe('abcd');
    });
});
