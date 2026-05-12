/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthResponse } from '../models/HealthResponse';
import type { RunRequest } from '../models/RunRequest';
import type { RunResponse } from '../models/RunResponse';
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoreService {
    /**
     * Health check
     * Returns `{ status: ok }` without calling any LLM. Use for liveness probes.
     * @returns any Service is running
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<(SuccessEnvelope & {
        data?: HealthResponse;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Submit a task to the agent reasoning loop
     * Triggers the full agentic loop: model routing → tool selection → execution → repeat
     * (up to `MAX_STEPS`, default 5). Returns the agent's final answer as a string.
     *
     * This is the right endpoint whenever no specialised endpoint covers the use case.
     *
     * @param requestBody
     * @returns any Agent completed successfully
     * @throws ApiError
     */
    public static postRun(
        requestBody: RunRequest,
    ): CancelablePromise<(SuccessEnvelope & {
        data?: RunResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/run',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Submit a task and receive Server-Sent Events
     * Same as `POST /run` but streams agent lifecycle events in real time as
     * Server-Sent Events (SSE).
     *
     * The connection stays open until the agent completes (on `done`, `error`, or
     * `max_steps` event). The original `POST /run` endpoint is completely unchanged.
     *
     * **SSE event types**:
     * - `step` — emitted after each LLM response: `{ step, action, thought }`
     * - `tool` — emitted after each tool execution: `{ tool, result? }` or `{ tool, error }`
     * - `route` — emitted when a model profile is selected: `{ profile, model, reason }`
     * - `done` — final answer ready: `{ result, meta? }`
     * - `error` — agent threw: `{ error }`
     * - `max_steps` — loop exhausted: `{ task, summary }`
     * - `hard_stop` — policy hard stop: `{ step, code, reason }`
     *
     * @param requestBody
     * @returns string SSE stream — connection kept open until agent completes.
     *
     * SSE event payload schemas (see components/schemas):
     * - `route` event: SseRouteEvent `{ profile, model, reason }`
     * - `step` event: SseStepEvent `{ step, action, thought }`
     * - `tool` event: SseToolEvent `{ tool, result?, error? }`
     * - `done` event: SseDoneEvent `{ result, meta? }`
     * - `error` event: SseErrorEvent `{ error }`
     * - `max_steps` event: SseMaxStepsEvent `{ task, summary, diagnosticFile? }`
     * - `hard_stop` event: SseHardStopEvent `{ step, code, reason }`
     *
     * @throws ApiError
     */
    public static postRunStream(
        requestBody: RunRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/run/stream',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
            },
        });
    }
}
