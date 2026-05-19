/**
 * Unit tests for packages/shared/sse.ts
 *
 * The SSE helpers are tiny but used by every streaming endpoint, so we lock
 * in the wire format and lifecycle wiring.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';

import {
    sseFrame,
    createSseWriter,
    setupSSEHeaders,
    onSSEClose,
    SSE_PAYLOAD_MAX_LENGTH
} from '@/packages/shared/sse.js';

/* ── sseFrame — wire-format serialiser ───────────────────────────────── */

describe('sseFrame', () => {
    it('serialises an event into the standard SSE frame format', () => {
        /* SSE spec: each frame ends with a blank line (`\n\n`). */
        const frame = sseFrame('progress', { step: 1 });
        expect(frame).toBe('event: progress\ndata: {"step":1}\n\n');
    });

    it('JSON-encodes complex payloads safely', () => {
        const frame = sseFrame('done', { msg: 'hi\nthere', arr: [1, 2] });
        /* The literal newline inside `msg` must survive as the escaped \\n. */
        expect(frame).toContain('data: {"msg":"hi\\nthere","arr":[1,2]}\n\n');
    });
});

/* ── createSseWriter — bound write helper ────────────────────────────── */

describe('createSseWriter', () => {
    it('writes a properly-formed frame to the supplied response', () => {
        const write = vi.fn();
        const writer = createSseWriter({ write } as unknown as Response);
        writer('open', { ok: true });
        expect(write).toHaveBeenCalledWith('event: open\ndata: {"ok":true}\n\n');
    });
});

/* ── setupSSEHeaders — content-type + flush ──────────────────────────── */

describe('setupSSEHeaders', () => {
    it('configures the three SSE headers and flushes them', () => {
        const setHeader = vi.fn();
        const flushHeaders = vi.fn();
        setupSSEHeaders({ setHeader, flushHeaders } as unknown as Response);
        expect(setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
        expect(setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
        expect(setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
        expect(flushHeaders).toHaveBeenCalledOnce();
    });
});

/* ── onSSEClose — client-disconnect bridge ───────────────────────────── */

describe('onSSEClose', () => {
    it('wires the cleanup function to the request `close` event', () => {
        const on = vi.fn();
        const cleanup = vi.fn();
        onSSEClose({ on } as unknown as Request, cleanup);
        expect(on).toHaveBeenCalledWith('close', cleanup);
    });
});

/* ── Module constants ─────────────────────────────────────────────────── */

describe('SSE_PAYLOAD_MAX_LENGTH', () => {
    it('exposes a positive integer limit so callers can truncate consistently', () => {
        expect(Number.isInteger(SSE_PAYLOAD_MAX_LENGTH)).toBe(true);
        expect(SSE_PAYLOAD_MAX_LENGTH).toBeGreaterThan(0);
    });
});
