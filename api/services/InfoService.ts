/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InfoService {
    /**
     * List available Manna agent routing profiles (modes)
     * Returns all recognised agent routing profiles, the Ollama model
     * currently configured for each, the controlling environment variable,
     * and a human-readable description. No LLM call is made.
     *
     * @returns any Mode list with count
     * @throws ApiError
     */
    public static getInfoModes(): CancelablePromise<(SuccessEnvelope & {
        data?: {
            /**
             * Number of available modes.
             */
            count?: number;
            modes?: Array<{
                /**
                 * Profile name.
                 */
                profile?: string;
                /**
                 * Resolved Ollama model for this profile.
                 */
                model?: string;
                /**
                 * Environment variable that configures this profile's model.
                 */
                envVar?: string;
                /**
                 * Human-readable summary.
                 */
                description?: string;
            }>;
        };
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/info/modes',
        });
    }
    /**
     * List models currently available in the connected Ollama instance
     * Proxies Ollama's `GET /api/tags` endpoint and returns the list of
     * locally available models with size, digest, and detail metadata.
     * Returns 502 if Ollama is unreachable.
     *
     * @returns any Model list from Ollama
     * @throws ApiError
     */
    public static getInfoModels(): CancelablePromise<(SuccessEnvelope & {
        data?: {
            /**
             * Number of models available.
             */
            count?: number;
            /**
             * The Ollama base URL queried.
             */
            ollamaBaseUrl?: string;
            models?: Array<{
                name?: string;
                /**
                 * Model file size in bytes.
                 */
                size?: number | null;
                digest?: string | null;
                /**
                 * ISO 8601 timestamp of last modification.
                 */
                modifiedAt?: string | null;
                /**
                 * Ollama model metadata (family, parameter_size, quantization_level, etc.).
                 */
                details?: Record<string, any> | null;
            }>;
        };
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/info/models',
            errors: {
                502: `Ollama unreachable or returned an error.`,
            },
        });
    }
    /**
     * Quick reference of all available REST API endpoints
     * Returns a structured JSON overview of every endpoint exposed by the Manna
     * API — equivalent to `--help` on a CLI tool. Includes HTTP method, path,
     * summary, and parameter list for each endpoint. No LLM call.
     *
     * @returns any Structured help output
     * @throws ApiError
     */
    public static getHelp(): CancelablePromise<(SuccessEnvelope & {
        data?: {
            description?: string;
            endpointCount?: number;
            endpoints?: Array<{
                method?: string;
                path?: string;
                summary?: string;
                params?: Array<{
                    name?: string;
                    type?: string;
                    required?: boolean;
                    description?: string;
                }>;
            }>;
        };
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/help',
        });
    }
}
