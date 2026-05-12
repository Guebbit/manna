/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Emitted when the agent is hard-stopped by the policy layer
 * (e.g. path-safety violation, permission denied, or consecutive-error budget exceeded).
 * The run is persisted with `status: "hard_stopped"`.
 *
 */
export type SseHardStopEvent = {
    /**
     * Zero-based step index when the hard stop was triggered.
     */
    step?: number;
    /**
     * Typed error code from the error taxonomy.
     * Well-known values: `E_PATH_OUTSIDE_ROOT`, `E_PERMISSION_DENIED`,
     * `E_CONSECUTIVE_ERRORS`.
     *
     */
    code?: string;
    /**
     * Human-readable explanation of why the run was hard-stopped.
     */
    reason?: string;
};

