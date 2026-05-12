/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutocompleteRequest = {
    /**
     * Code text before the cursor.
     */
    prefix: string;
    /**
     * Code text after the cursor (FIM context).
     */
    suffix?: string;
    /**
     * Programming language identifier (e.g. "typescript", "python").
     */
    language?: string;
};

