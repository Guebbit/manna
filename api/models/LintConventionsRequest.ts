/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LintConventionsRequest = {
    /**
     * Source code to lint.
     */
    code: string;
    /**
     * Programming language identifier.
     */
    language?: string;
    /**
     * Optional source file name/path for context.
     */
    filename?: string;
    /**
     * Whether to include the optional LLM enrichment pass.
     */
    includeLlm?: boolean;
    /**
     * Override the model used for LLM enrichment.
     */
    model?: string;
    /**
     * Maximum number of findings returned.
     */
    maxFindings?: number;
};

