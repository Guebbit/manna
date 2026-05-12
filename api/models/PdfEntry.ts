/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PdfEntry = {
    /**
     * Absolute path to the PDF file on disk.
     */
    path: string;
    /**
     * Publication year. If omitted, the pipeline attempts to infer it
     * from the file path (e.g. .../2026/04.pdf -> 2026).
     *
     */
    year?: number;
    /**
     * Publication month as a full English name. If omitted, the pipeline
     * attempts to infer it from the file path.
     *
     */
    month?: string;
};

