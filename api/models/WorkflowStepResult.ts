/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkflowStepResult = {
    /**
     * Zero-based position of this step in the workflow.
     */
    index?: number;
    /**
     * The original task string for this step.
     */
    task?: string;
    /**
     * The agent's final answer for this step.
     */
    result?: string;
    /**
     * Whether this step completed without throwing.
     */
    success?: boolean;
    /**
     * Wall-clock execution time for this step in milliseconds.
     */
    durationMs?: number;
    /**
     * Error message (only present when `success` is `false`).
     */
    error?: string;
};

