/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LintFinding } from './LintFinding';
import type { ResponseMeta } from './ResponseMeta';
export type LintResponse = {
    requestId?: string;
    language?: string;
    filePath?: string;
    summary?: {
        errors?: number;
        warnings?: number;
        infos?: number;
        /**
         * Total number of findings across all severities.
         */
        total?: number;
        deterministicCount?: number;
        llmCount?: number;
    };
    findings?: Array<LintFinding>;
    llmModelUsed?: string;
    latencyMs?: number;
    meta?: ResponseMeta;
};

