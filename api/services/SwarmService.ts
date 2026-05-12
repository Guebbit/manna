/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { SwarmRequest } from '../models/SwarmRequest';
import type { SwarmResponse } from '../models/SwarmResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SwarmService {
    /**
     * Run a multi-agent swarm to solve a complex task
     * Decomposes the task into subtasks using an LLM, executes each subtask
     * through a specialised agent (respecting dependency ordering), and
     * synthesises a final answer from all subtask results.
     *
     * Use this instead of `POST /run` when the task is complex enough to
     * benefit from divide-and-conquer (e.g. "build X, write tests, and document it").
     *
     * @param requestBody
     * @returns any Swarm completed successfully
     * @throws ApiError
     */
    public static postRunSwarm(
        requestBody: SwarmRequest,
    ): CancelablePromise<(SuccessEnvelope & {
        data?: SwarmResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/run/swarm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Run a multi-agent swarm with SSE streaming
     * Same as `POST /run/swarm`, but streams agent lifecycle events as
     * Server-Sent Events. The connection stays open until the swarm completes.
     *
     * SSE event types: `decomposed`, `subtask_start`, `subtask_done`,
     * `subtask_error`, `step`, `tool`, `route`, `done`, `error`.
     * The terminal `done` event includes `{ answer, totalDurationMs, subtaskCount, meta? }`.
     *
     * @param requestBody
     * @returns string SSE event stream.
     *
     * SSE event payload schemas (see components/schemas):
     * - `route` event: SseRouteEvent `{ profile, model, reason }`
     * - `step` event: SseStepEvent `{ step, action, thought }`
     * - `tool` event: SseToolEvent `{ tool, result?, error? }`
     * - `done` event: SseDoneEvent `{ result, meta? }`
     * - `error` event: SseErrorEvent `{ error }`
     * - `hard_stop` event: SseHardStopEvent `{ step, code, reason }`
     * Other swarm-specific events: `decomposed`, `subtask_start`, `subtask_done`, `subtask_error`.
     *
     * @throws ApiError
     */
    public static postRunSwarmStream(
        requestBody: SwarmRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/run/swarm/stream',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
}
