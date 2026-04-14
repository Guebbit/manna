/**
 * LangGraph swarm orchestration state — typed annotation used by every
 * node in the graph.
 *
 * The state carries all data needed to execute a full swarm run:
 * tools and processors are threaded in via node closures, not via state.
 *
 * Reducers use simple replacement semantics for all fields; the graph is
 * designed so each node writes only its own output fields and the next
 * node reads them.
 *
 * @module orchestrator/state
 */

import { Annotation } from '@langchain/langgraph';
import type { IDecomposition, ISubtaskResult, ISwarmConfig } from '../swarm/types';

/* ── State definition ────────────────────────────────────────────────── */

/**
 * Annotated state for the Manna swarm graph.
 *
 * Fields:
 * - `task`            — the original user task string.
 * - `config`          — swarm configuration (maxSubtasks, allowWrite, profileOverride).
 * - `decomposition`   — result of the decompose node; null until that node runs.
 * - `subtaskResults`  — accumulated results from execute_subtasks; grows on retry.
 * - `answer`          — final synthesised answer; set by the synthesize node.
 * - `retryCount`      — how many review→retry cycles have occurred.
 * - `reviewPassed`    — whether the review node approved the current results.
 * - `startTime`       — wall-clock Date when the graph invocation started.
 * - `totalDurationMs` — total elapsed time in ms; set by the synthesize node.
 */
export const swarmStateAnnotation = Annotation.Root({
    /** The original user task string. */
    task: Annotation<string>(),

    /** Swarm configuration overrides. */
    config: Annotation<ISwarmConfig>(),

    /** Decomposition plan produced by the decompose node. */
    decomposition: Annotation<IDecomposition | undefined>(),

    /**
     * Subtask results accumulated across all execute_subtasks iterations.
     * On retry, only failed subtask results are replaced.
     */
    subtaskResults: Annotation<ISubtaskResult[]>({
        default: () => [],
        reducer: (_existing, next) => next
    }),

    /** Synthesised final answer; empty string until the synthesize node runs. */
    answer: Annotation<string>({
        default: () => '',
        reducer: (_existing, next) => next
    }),

    /** Number of review→retry cycles completed. */
    retryCount: Annotation<number>({
        default: () => 0,
        reducer: (_existing, next) => next
    }),

    /** Whether the review node approved the latest subtask results. */
    reviewPassed: Annotation<boolean>({
        default: () => false,
        reducer: (_existing, next) => next
    }),

    /** Wall-clock Date when the graph invocation started. */
    startTime: Annotation<Date>({
        default: () => new Date(),
        reducer: (_existing, next) => next
    }),

    /** Total elapsed milliseconds; filled in by the synthesize node. */
    totalDurationMs: Annotation<number>({
        default: () => 0,
        reducer: (_existing, next) => next
    })
});

/**
 * TypeScript type alias for the swarm graph state (inferred from annotations).
 */
export type ISwarmGraphState = typeof swarmStateAnnotation.State;
