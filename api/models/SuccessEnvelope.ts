/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
export type SuccessEnvelope = {
    success: boolean;
    status: number;
    message: string;
    /**
     * The response payload. Type varies per endpoint.
     */
    data?: any;
    meta?: ResponseMeta;
};

