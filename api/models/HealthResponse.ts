/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseMeta } from './ResponseMeta';
export type HealthResponse = {
    /**
     * Health status marker.
     */
    status: string;
    /**
     * ISO 8601 timestamp of when the health check was served.
     */
    timestamp: string;
    meta?: ResponseMeta;
};

