/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateConversationRequest = {
    title?: string;
    profile?: CreateConversationRequest.profile | null;
};
export namespace CreateConversationRequest {
    export enum profile {
        FAST = 'fast',
        REASONING = 'reasoning',
        CODE = 'code',
    }
}

