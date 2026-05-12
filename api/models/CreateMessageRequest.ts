/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateMessageRequest = {
    role: CreateMessageRequest.role;
    content: string;
};
export namespace CreateMessageRequest {
    export enum role {
        USER = 'user',
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
    }
}

