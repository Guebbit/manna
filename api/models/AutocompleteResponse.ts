/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
export type AutocompleteResponse = {
    requestId?: string;
    /**
     * Suggested code to insert at the cursor.
     */
    completion?: string;
    /**
     * Whether the result was served from cache.
     */
    cached?: boolean;
    latencyMs?: number;
    /**
     * The LLM model used for completion.
     */
    model?: string;
    /**
     * Inferred programming language.
     */
    language?: string;
    /**
     * ISO timestamp when the completion was generated.
     */
    createdAtIso?: string;
    meta?: ResponseMeta;
};

