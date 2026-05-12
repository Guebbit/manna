/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Article metadata as returned by the export endpoint. Identical to RankedArticle
 * but without the similarity `score` field and without the embedding vector.
 *
 */
export type ArticleExport = {
    id?: string;
    title?: string;
    summary?: string;
    topics?: Array<string>;
    year?: number;
    month?: string;
    startPage?: number;
    endPage?: number;
    pdfPath?: string;
    pdfPageOffset?: number;
};

