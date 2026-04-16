/**
 * Unit tests for packages/shared/env.ts
 *
 * Tests the envFloat and envInt helper functions that parse environment
 * variable strings into numeric values with safe fallbacks.
 */

import { describe, it, expect } from 'vitest';
import { envFloat, envInt } from '@/packages/shared/env.js';

describe('envFloat', () => {
    it('returns the parsed float when value is a valid numeric string', () => {
        expect(envFloat('3.14', 0)).toBe(3.14);
    });

    it('returns an integer value parsed as float', () => {
        expect(envFloat('42', 0)).toBe(42);
    });

    it('returns fallback when value is undefined', () => {
        expect(envFloat(undefined, 99)).toBe(99);
    });

    it('returns fallback when value is an empty string', () => {
        expect(envFloat('', 5)).toBe(5);
    });

    it('returns fallback when value is a non-numeric string', () => {
        expect(envFloat('not-a-number', 7)).toBe(7);
    });

    it('returns fallback when value is "NaN"', () => {
        expect(envFloat('NaN', 1.5)).toBe(1.5);
    });

    it('returns zero when value is "0"', () => {
        expect(envFloat('0', 99)).toBe(0);
    });

    it('handles negative floats', () => {
        expect(envFloat('-1.5', 0)).toBe(-1.5);
    });
});

describe('envInt', () => {
    it('returns the parsed integer when value is a valid integer string', () => {
        expect(envInt('10', 0)).toBe(10);
    });

    it('truncates float strings to integer', () => {
        expect(envInt('3.9', 0)).toBe(3);
    });

    it('returns fallback when value is undefined', () => {
        expect(envInt(undefined, 42)).toBe(42);
    });

    it('returns fallback when value is an empty string', () => {
        expect(envInt('', 5)).toBe(5);
    });

    it('returns fallback when value is a non-numeric string', () => {
        expect(envInt('abc', 7)).toBe(7);
    });

    it('returns fallback when value is "NaN"', () => {
        expect(envInt('NaN', 1)).toBe(1);
    });

    it('returns zero when value is "0"', () => {
        expect(envInt('0', 99)).toBe(0);
    });

    it('handles negative integers', () => {
        expect(envInt('-5', 0)).toBe(-5);
    });
});
