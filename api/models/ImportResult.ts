/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ImportResult = {
    /**
     * Number of articles successfully imported.
     */
    imported?: number;
    /**
     * Number of PDFs skipped due to errors.
     */
    skipped?: number;
    /**
     * Error messages for any PDFs that failed to process.
     */
    errors?: Array<string>;
};

