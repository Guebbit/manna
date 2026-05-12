/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
import type { ToolCitation } from './ToolCitation';
export type RunResponse = {
    /**
     * The agent's final answer as a plain string.
     */
    result?: string;
    citations?: Array<ToolCitation>;
    meta?: ResponseMeta;
};

