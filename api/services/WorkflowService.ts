/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { WorkflowRequest } from '../models/WorkflowRequest';
import type { WorkflowResponse } from '../models/WorkflowResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkflowService {
    /**
     * Run an explicit ordered list of steps sequentially
     * Accepts an array of step task strings and runs each as an independent bounded
     * `agent.run()` sub-call.  Each step has its own `maxStepsPerStep` iteration cap
     * (defaulting to `AGENTS_MAX_STEPS`), so a misbehaving step cannot consume the
     * entire budget.
     *
     * ### Context carry modes (`carry`)
     *
     * | Mode      | Behaviour |
     * |-----------|-----------|
     * | `none`    | Steps are fully isolated — no prior context forwarded. |
     * | `summary` | A compact bullet-point summary of prior step results is prepended to each subsequent step prompt. **(default)** |
     * | `full`    | The complete verbatim output of every prior step is appended. Context may grow quickly. |
     *
     * Use `POST /workflow` when your outer loop is already structured as an ordered list
     * and you want each step bounded independently.
     *
     * @param requestBody
     * @returns any All steps completed (some may have `success: false` if individual steps errored)
     * @throws ApiError
     */
    public static postWorkflow(
        requestBody: WorkflowRequest,
    ): CancelablePromise<(SuccessEnvelope & {
        data?: WorkflowResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workflow',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Run a sequential workflow with SSE streaming
     * Same as `POST /workflow`, but streams lifecycle events as Server-Sent Events.
     * The connection stays open until all steps complete.
     *
     * SSE event types (in order):
     * - `workflow_start` — before the first step; `{ stepCount }`.
     * - `step_start`     — before each step; `{ index, task }`.
     * - `step`           — inner agent iteration; `{ workflowIndex, step, action, thought }`.
     * - `tool`           — tool result/error; `{ workflowIndex, tool, result? | error? }`.
     * - `route`          — model routing decision; `{ workflowIndex, profile, model, reason }`.
     * - `step_done`      — after each step; full `WorkflowStepResult` object.
     * - `done`           — after all steps; full `WorkflowResponse` object plus optional `meta`.
     * - `error`          — on fatal error; `{ error }`.
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
     * Workflow-specific events: `workflow_start { stepCount }`, `step_start { index, task }`, `step_done { WorkflowStepResult }`.
     *
     * @throws ApiError
     */
    public static postWorkflowStream(
        requestBody: WorkflowRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workflow/stream',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
}
