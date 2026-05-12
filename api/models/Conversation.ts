/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Conversation = {
    id: string;
    title: string;
    profile?: Conversation.profile | null;
    createdAt: string;
    updatedAt: string;
};
export namespace Conversation {
    export enum profile {
        FAST = 'fast',
        REASONING = 'reasoning',
        CODE = 'code',
    }
}

