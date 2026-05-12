/**
 * Unit tests for apps/api/sse-event-bridge.ts
 */

import { describe, it, expect, vi } from 'vitest';
import { writeAgentEventToSse } from '@/apps/api/sse-event-bridge';

describe('writeAgentEventToSse', () => {
    it('writes hard_stop payload for agent:hard_stop events', () => {
        const writeEvent = vi.fn();

        const handled = writeAgentEventToSse(
            {
                type: 'agent:hard_stop',
                payload: {
                    step: 2,
                    code: 'E_CONSECUTIVE_ERRORS',
                    reason: 'Run terminated after repeated failures.'
                }
            },
            writeEvent
        );

        expect(handled).toBe(true);
        expect(writeEvent).toHaveBeenCalledTimes(1);
        expect(writeEvent).toHaveBeenCalledWith('hard_stop', {
            step: 2,
            code: 'E_CONSECUTIVE_ERRORS',
            reason: 'Run terminated after repeated failures.'
        });
    });

    it('returns false for unsupported event types', () => {
        const writeEvent = vi.fn();

        const handled = writeAgentEventToSse(
            { type: 'agent:done', payload: { thought: 'ok' } },
            writeEvent
        );

        expect(handled).toBe(false);
        expect(writeEvent).not.toHaveBeenCalled();
    });
});
