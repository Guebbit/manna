/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SearchRequest = {
    /**
     * Natural-language search query. Will be embedded using the configured embedding model.
     */
    query: string;
    /**
     * Number of top-ranked articles to return.
     */
    topK?: number;
    /**
     * Optional metadata filters applied before or during the ANN search.
     */
    filters?: {
        /**
         * Restrict results to a specific publication year.
         */
        year?: number;
        /**
         * Restrict results to a specific publication month (full English name).
         */
        month?: string;
    };
};

