/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ToolCitation } from './ToolCitation';
/**
 * Optional operational metadata attached to successful responses.
 */
export type ResponseMeta = {
    /**
     * Wall-clock request duration in milliseconds.
     */
    durationMs?: number;
    /**
     * ISO 8601 timestamp when processing started.
     */
    startedAt?: string;
    /**
     * Prompt token count when provided by the model backend.
     */
    promptTokens?: number;
    /**
     * Completion token count when provided by the model backend.
     */
    completionTokens?: number;
    /**
     * Prompt + completion token count when both are available.
     */
    totalTokens?: number;
    /**
     * Single model identifier when only one model was used.
     */
    model?: string;
    /**
     * Model identifiers used during multi-step or routed execution.
     */
    models?: Array<string>;
    /**
     * Effective profile used by the operation when applicable.
     */
    profile?: string;
    /**
     * Number of reasoning or orchestration steps executed.
     */
    steps?: number;
    /**
     * Number of tool calls executed.
     */
    toolCalls?: number;
    /**
     * Final context length in characters when available.
     */
    contextLength?: number;
    /**
     * Request correlation identifier when available.
     */
    requestId?: string;
    /**
     * Whether memory retrieval returned non-empty context.
     */
    memoryUsed?: boolean;
    /**
     * Tool citations collected during execution.
     */
    citations?: Array<ToolCitation>;
};

