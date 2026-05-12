/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutocompleteRequest } from '../models/AutocompleteRequest';
import type { AutocompleteResponse } from '../models/AutocompleteResponse';
import type { LintConventionsRequest } from '../models/LintConventionsRequest';
import type { LintResponse } from '../models/LintResponse';
import type { PageReviewRequest } from '../models/PageReviewRequest';
import type { PageReviewResponse } from '../models/PageReviewResponse';
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IdeService {
    /**
     * Cursor-time code completion
     * Single LLM call (no agent loop). Returns one or more code completion suggestions
     * for the given cursor position. Uses `TOOL_IDE_MODEL` (default `starcoder2`).
     *
     * Intended for IDE integration. Responses are cached for identical prefix/suffix pairs.
     *
     * @param requestBody
     * @returns any Completion result
     * @throws ApiError
     */
    public static postAutocomplete(
        requestBody: AutocompleteRequest,
    ): CancelablePromise<(SuccessEnvelope & {
        data?: AutocompleteResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/autocomplete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Deterministic lint + LLM convention findings
     * Runs deterministic TypeScript/style checks and optionally enriches findings
     * with LLM explanations. Returns a structured list of findings with severity,
     * rule name, line numbers, and suggested fixes.
     *
     * @param requestBody
     * @returns any Lint findings
     * @throws ApiError
     */
    public static postLintConventions(
        requestBody: LintConventionsRequest,
    ): CancelablePromise<(SuccessEnvelope & {
        data?: LintResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/lint-conventions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Whole-file categorised engineering review
     * Single LLM call that analyses a full source file and returns categorised
     * review suggestions (correctness, maintainability, performance, security).
     *
     * @param requestBody
     * @returns any Review result
     * @throws ApiError
     */
    public static postPageReview(
        requestBody: PageReviewRequest,
    ): CancelablePromise<(SuccessEnvelope & {
        data?: PageReviewResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/page-review',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
}
