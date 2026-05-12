/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PageReviewRequest = {
    /**
     * Full source file content to review.
     */
    code: string;
    language?: string;
    filename?: string;
    /**
     * Optional sentence describing the project for context.
     */
    projectContext?: string;
};

