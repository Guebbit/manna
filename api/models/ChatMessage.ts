/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatMessage = {
    id: string;
    conversationId: string;
    role: ChatMessage.role;
    content: string;
    createdAt: string;
    updatedAt: string;
};
export namespace ChatMessage {
    export enum role {
        USER = 'user',
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
    }
}

