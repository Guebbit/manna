/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SwarmSubtaskResult = {
    /**
     * Subtask identifier.
     */
    id?: string;
    /**
     * What this subtask was asked to do.
     */
    description?: string;
    /**
     * Model profile used for this subtask.
     */
    profile?: string;
    /**
     * Whether the subtask completed without error.
     */
    success?: boolean;
    /**
     * The subtask agent's final answer.
     */
    answer?: string;
    /**
     * Wall-clock execution time in milliseconds.
     */
    durationMs?: number;
    /**
     * Error message (only present when `success` is `false`).
     */
    error?: string;
};

