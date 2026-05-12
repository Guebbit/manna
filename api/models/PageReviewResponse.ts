/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageReviewCategories } from './PageReviewCategories';
import type { ResponseMeta } from './ResponseMeta';
export type PageReviewResponse = {
    requestId?: string;
    /**
     * The LLM model used.
     */
    model?: string;
    language?: string;
    filePath?: string;
    findings?: Array<Record<string, any>>;
    categories?: PageReviewCategories;
    latencyMs?: number;
    meta?: ResponseMeta;
};

