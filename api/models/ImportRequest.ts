/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PdfEntry } from './PdfEntry';
/**
 * Provide either `pdfs` for incremental updates (specific files) or
 * `folder` for a full batch import. If both are provided, `pdfs` takes precedence.
 *
 */
export type ImportRequest = {
    /**
     * Array of specific PDF files to import.
     */
    pdfs?: Array<PdfEntry>;
    /**
     * Absolute path to a folder containing PDF files (scanned recursively).
     * All PDFs found under this path will be ingested.
     *
     */
    folder?: string;
};

