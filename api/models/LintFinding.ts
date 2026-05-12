/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LintFinding = {
    /**
     * Where this finding came from.
     */
    source: LintFinding.source;
    severity: LintFinding.severity;
    /**
     * Grouping category (e.g. "typescript", "style", "convention").
     */
    category: string;
    message: string;
    /**
     * 1-based line number.
     */
    line?: number;
    /**
     * 1-based column number.
     */
    column?: number;
    /**
     * Machine-readable rule identifier (e.g. "TS2345").
     */
    rule?: string;
};
export namespace LintFinding {
    /**
     * Where this finding came from.
     */
    export enum source {
        TYPESCRIPT = 'typescript',
        CONVENTION = 'convention',
        LLM = 'llm',
    }
    export enum severity {
        ERROR = 'error',
        WARNING = 'warning',
        INFO = 'info',
    }
}

