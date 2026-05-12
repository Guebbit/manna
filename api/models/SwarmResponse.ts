/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
import type { SwarmSubtaskResult } from './SwarmSubtaskResult';
export type SwarmResponse = {
    /**
     * The synthesised final answer.
     */
    answer?: string;
    /**
     * Individual results for each subtask.
     */
    subtaskResults?: Array<SwarmSubtaskResult>;
    decomposition?: {
        /**
         * Decomposer's rationale for the subtask split.
         */
        reasoning?: string;
        /**
         * Number of subtasks in the decomposition.
         */
        subtaskCount?: number;
    };
    /**
     * Total wall-clock duration of the entire swarm run.
     */
    totalDurationMs?: number;
    meta?: ResponseMeta;
};

