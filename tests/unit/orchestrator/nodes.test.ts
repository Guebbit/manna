/**
 * Unit tests for packages/orchestrator/nodes.ts
 *
 * Each node factory returns a closure used by LangGraph. We exercise the
 * closures directly here — no real graph compilation, no LLM, no DB.
 *
 * Coverage:
 * - `reviewRouter`           — pure routing function (no I/O)
 * - `createReviewNode`       — pass / retry / exhausted-retries branches
 * - `createDecomposeNode`    — emits the swarm:start event and stores decomposition
 * - `createSynthesizeNode`   — single-success shortcut + multi-result synthesis path
 * - `createExecuteSubtasksNode` — topological execution, retry re-run logic,
 *                                 deadlock recovery on circular dependencies
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

/* Hoist env vars so module-level `resolveModel()` calls succeed at import. */
vi.hoisted(() => {
    process.env.OLLAMA_MODEL = 'test-model';
    process.env.AGENT_MODEL_FAST = 'test-model';
    process.env.AGENT_MODEL_REASONING = 'test-model';
    process.env.AGENT_MODEL_CODE = 'test-model';
});

/* Silence persistence / diagnostics / logger noise during tests. */
vi.mock('@/packages/persistence/db.js', () => ({
    saveAgentRun: vi.fn().mockResolvedValue(null),
    saveSwarmRun: vi.fn().mockResolvedValue(null)
}));
vi.mock('@/packages/diagnostics/index.js', () => ({
    writeDiagnosticLog: vi.fn().mockResolvedValue('test.md'),
    cleanupOldLogs: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('@/packages/logger/logger.js', () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

/* Mock the LLM + decomposer so nodes never make a real network call. */
vi.mock('@/packages/llm/ollama.js', () => ({
    generate: vi.fn(),
    chatWithMetadata: vi.fn(),
    generateWithMetadata: vi.fn(),
    modelSupportsNativeToolCalling: vi.fn().mockReturnValue(false)
}));
vi.mock('@/packages/swarm/decomposer.js', () => ({
    decomposeTask: vi.fn()
}));
/* Mock memory so the Agent does not try to embed anything. */
vi.mock('@/packages/memory/memory.js', () => ({
    getMemory: vi.fn().mockResolvedValue([]),
    addMemory: vi.fn().mockResolvedValue(undefined)
}));

import {
    reviewRouter,
    createReviewNode,
    createDecomposeNode,
    createSynthesizeNode,
    createExecuteSubtasksNode
} from '@/packages/orchestrator/nodes.js';
import type { ISwarmGraphState } from '@/packages/orchestrator/state.js';
import type { ISubtask, ISubtaskResult } from '@/packages/swarm/types.js';
import { decomposeTask } from '@/packages/swarm/decomposer.js';
import { generate } from '@/packages/llm/ollama.js';
import { Agent } from '@/packages/agent/agent.js';

const mockDecompose = decomposeTask as ReturnType<typeof vi.fn>;
const mockGenerate = generate as ReturnType<typeof vi.fn>;

/* ── Helpers ─────────────────────────────────────────────────────────── */

/** Build a minimal `ISwarmGraphState` for node tests. */
function buildState(overrides: Partial<ISwarmGraphState> = {}): ISwarmGraphState {
    return {
        task: 'test task',
        config: {},
        decomposition: undefined,
        subtaskResults: [],
        answer: '',
        retryCount: 0,
        reviewPassed: false,
        startTime: new Date(),
        totalDurationMs: 0,
        ...overrides
    } as ISwarmGraphState;
}

/** Build a fake subtask. */
function makeSubtask(id: string, dependsOn: string[] = []): ISubtask {
    return { id, description: `do ${id}`, profile: 'fast', dependsOn };
}

/** Build a fake successful or failed subtask result. */
function makeResult(id: string, success = true): ISubtaskResult {
    const subtask = makeSubtask(id);
    return success
        ? { subtask, answer: `answer ${id}`, durationMs: 1, success: true }
        : { subtask, answer: '', durationMs: 1, success: false, error: 'boom' };
}

beforeEach(() => {
    vi.clearAllMocks();
});

/* ── reviewRouter (pure routing) ─────────────────────────────────────── */

describe('reviewRouter', () => {
    it('routes to synthesize when review passed', () => {
        expect(reviewRouter(buildState({ reviewPassed: true }))).toBe('synthesize');
    });

    it('routes back to execute_subtasks when review failed', () => {
        expect(reviewRouter(buildState({ reviewPassed: false }))).toBe('execute_subtasks');
    });
});

/* ── createReviewNode (retry decision logic) ─────────────────────────── */

describe('createReviewNode', () => {
    const review = createReviewNode();

    it('passes when every subtask succeeded', async () => {
        const state = buildState({
            subtaskResults: [makeResult('s1'), makeResult('s2')]
        });
        const result = await review(state);
        expect(result.reviewPassed).toBe(true);
        expect(result.retryCount).toBeUndefined();
    });

    it('triggers a retry when failures exist and budget remains', async () => {
        const state = buildState({
            subtaskResults: [makeResult('s1'), makeResult('s2', false)],
            retryCount: 0
        });
        const result = await review(state);
        expect(result.reviewPassed).toBe(false);
        expect(result.retryCount).toBe(1);
    });

    it('forces pass once retries are exhausted (graceful degradation)', async () => {
        /* MAX_REVIEW_RETRIES defaults to 1 — `retryCount: 1` means exhausted. */
        const state = buildState({
            subtaskResults: [makeResult('s1', false)],
            retryCount: 1
        });
        const result = await review(state);
        expect(result.reviewPassed).toBe(true);
    });
});

/* ── createDecomposeNode (delegates to decomposer) ───────────────────── */

describe('createDecomposeNode', () => {
    it('returns the decomposition produced by decomposeTask()', async () => {
        mockDecompose.mockResolvedValueOnce({
            reasoning: 'r',
            subtasks: [makeSubtask('s1')]
        });
        const node = createDecomposeNode();
        const result = await node(buildState({ task: 'do things' }));
        expect(result.decomposition?.subtasks).toHaveLength(1);
        expect(mockDecompose).toHaveBeenCalledWith('do things', undefined);
    });

    it('forwards maxSubtasks from config', async () => {
        mockDecompose.mockResolvedValueOnce({ reasoning: 'r', subtasks: [] });
        const node = createDecomposeNode();
        await node(buildState({ config: { maxSubtasks: 3 } }));
        expect(mockDecompose).toHaveBeenCalledWith('test task', 3);
    });
});

/* ── createSynthesizeNode (single-result shortcut + LLM synthesis) ───── */

describe('createSynthesizeNode', () => {
    it('returns the single subtask answer directly without an LLM call', async () => {
        const node = createSynthesizeNode();
        const result = await node(
            buildState({
                subtaskResults: [makeResult('s1')]
            })
        );
        expect(result.answer).toBe('answer s1');
        expect(mockGenerate).not.toHaveBeenCalled();
    });

    it('synthesises multiple results via a single LLM call', async () => {
        mockGenerate.mockResolvedValueOnce('  combined answer  ');
        const node = createSynthesizeNode();
        const result = await node(
            buildState({
                subtaskResults: [makeResult('s1'), makeResult('s2')]
            })
        );
        expect(result.answer).toBe('combined answer');
        expect(mockGenerate).toHaveBeenCalledOnce();
    });

    it('falls back to concatenated answers if the synthesis LLM fails', async () => {
        mockGenerate.mockRejectedValueOnce(new Error('llm down'));
        const node = createSynthesizeNode();
        const result = await node(
            buildState({
                subtaskResults: [makeResult('s1'), makeResult('s2')]
            })
        );
        expect(result.answer).toContain('answer s1');
        expect(result.answer).toContain('answer s2');
    });
});

/* ── createExecuteSubtasksNode (topological order + retry skipping) ──── */

describe('createExecuteSubtasksNode', () => {
    /**
     * Stub `Agent.run` so executions are deterministic and instant — the
     * focus here is the node's scheduling logic, not the agent itself.
     */
    function stubAgentRun(answers: Map<string, string | Error>): void {
        vi.spyOn(Agent.prototype, 'run').mockImplementation((task: string) => {
            for (const [id, value] of answers) {
                if (task.startsWith(`do ${id}`)) {
                    if (value instanceof Error) return Promise.reject(value);
                    return Promise.resolve({
                        answer: value,
                        meta: {
                            startedAt: new Date().toISOString(),
                            durationMs: 1,
                            steps: 1,
                            toolCalls: 0,
                            models: ['test-model'],
                            contextLength: 0,
                            memoryUsed: false,
                            citations: []
                        },
                        citations: []
                    });
                }
            }
            return Promise.resolve({
                answer: 'fallback',
                meta: {
                    startedAt: new Date().toISOString(),
                    durationMs: 1,
                    steps: 1,
                    toolCalls: 0,
                    models: ['test-model'],
                    contextLength: 0,
                    memoryUsed: false,
                    citations: []
                },
                citations: []
            });
        });
    }

    it('returns an empty result list when no decomposition is present', async () => {
        const node = createExecuteSubtasksNode([], []);
        const out = await node(buildState());
        expect(out.subtaskResults).toEqual([]);
    });

    it('runs subtasks in dependency order', async () => {
        const order: string[] = [];
        vi.spyOn(Agent.prototype, 'run').mockImplementation((task: string) => {
            const id = task.match(/^do (\S+)/)?.[1] ?? '?';
            order.push(id);
            return Promise.resolve({
                answer: `done ${id}`,
                meta: {
                    startedAt: new Date().toISOString(),
                    durationMs: 1,
                    steps: 1,
                    toolCalls: 0,
                    models: ['test-model'],
                    contextLength: 0,
                    memoryUsed: false,
                    citations: []
                },
                citations: []
            });
        });

        const node = createExecuteSubtasksNode([], []);
        const out = await node(
            buildState({
                decomposition: {
                    reasoning: 'r',
                    subtasks: [makeSubtask('s2', ['s1']), makeSubtask('s1')]
                }
            })
        );

        expect(order).toEqual(['s1', 's2']);
        expect(out.subtaskResults).toHaveLength(2);
    });

    it('skips already-successful subtasks on retry runs', async () => {
        stubAgentRun(new Map([['s2', 'redo']]));
        const node = createExecuteSubtasksNode([], []);
        const out = await node(
            buildState({
                retryCount: 1,
                subtaskResults: [makeResult('s1')], // pre-existing success
                decomposition: {
                    reasoning: 'r',
                    subtasks: [makeSubtask('s1'), makeSubtask('s2')]
                }
            })
        );

        /* Agent.run should only be called once — for the previously-failed s2. */
        expect(Agent.prototype.run).toHaveBeenCalledOnce();
        expect(out.subtaskResults?.map((r) => r.subtask.id).sort()).toEqual(['s1', 's2']);
    });

    it('recovers from a circular-dependency deadlock by running remaining tasks anyway', async () => {
        stubAgentRun(
            new Map([
                ['a', 'A'],
                ['b', 'B']
            ])
        );
        const node = createExecuteSubtasksNode([], []);
        /* Two subtasks depending on each other — classic deadlock. */
        const out = await node(
            buildState({
                decomposition: {
                    reasoning: 'r',
                    subtasks: [makeSubtask('a', ['b']), makeSubtask('b', ['a'])]
                }
            })
        );
        expect(out.subtaskResults).toHaveLength(2);
    });

    it('records a failure result when the agent throws', async () => {
        stubAgentRun(new Map([['s1', new Error('boom')]]));
        const node = createExecuteSubtasksNode([], []);
        const out = await node(
            buildState({
                decomposition: { reasoning: 'r', subtasks: [makeSubtask('s1')] }
            })
        );
        expect(out.subtaskResults?.[0].success).toBe(false);
        expect(out.subtaskResults?.[0].error).toContain('boom');
    });
});
