/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
import type { WorkflowStepResult } from './WorkflowStepResult';
export type WorkflowResponse = {
    /**
     * Per-step results in execution order.
     */
    steps?: Array<WorkflowStepResult>;
    /**
     * `true` when every step completed successfully.
     */
    allSucceeded?: boolean;
    /**
     * Total wall-clock duration across all steps in milliseconds.
     */
    totalDurationMs?: number;
    meta?: ResponseMeta;
};

