/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RankedArticle = {
    /**
     * Cosine similarity score between the query embedding and the article embedding.
     */
    score?: number;
    /**
     * Unique article identifier.
     */
    id?: string;
    /**
     * Article headline.
     */
    title?: string;
    /**
     * LLM-generated 2-4 sentence summary.
     */
    summary?: string;
    /**
     * LLM-generated topic tags.
     */
    topics?: Array<string>;
    year?: number;
    month?: string;
    /**
     * First printed page number of the article.
     */
    startPage?: number;
    /**
     * Last printed page number of the article (may be absent for single-page items).
     */
    endPage?: number;
    /**
     * Absolute path to the PDF on disk. Use with `startPage` to open directly.
     */
    pdfPath?: string;
    /**
     * Offset between the printed page number and the 0-based PDF page index.
     * Use when cover pages or ads shift the internal page count.
     *
     */
    pdfPageOffset?: number;
};

