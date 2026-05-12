/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateConversationRequest = {
    title?: string;
    profile?: UpdateConversationRequest.profile | null;
};
export namespace UpdateConversationRequest {
    export enum profile {
        FAST = 'fast',
        REASONING = 'reasoning',
        CODE = 'code',
    }
}

