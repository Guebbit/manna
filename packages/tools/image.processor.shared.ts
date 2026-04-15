/**
 * Shared infrastructure for image-processor based tools.
 *
 * Provides common schemas, HTTP request handling, and a factory for creating
 * image tools (e.g. sketch, colorize) with minimal duplication.
 *
 * @module tools/image.processor.shared
 */

import { z } from 'zod';
import { envInt } from '../shared';
import { createTool } from './tool-builder';

/** Base URL for the external image processor service. */
export const IMAGE_PROCESSOR_URL = process.env.IMAGE_PROCESSOR_URL ?? 'http://localhost:5000';

/** HTTP timeout (ms) for image-processor requests. */
export const IMAGE_PROCESSOR_TIMEOUT_MS = envInt(process.env.IMAGE_PROCESSOR_TIMEOUT, 120_000);

/** Shared base input schema for image-processor tools. */
export const imageProcessorInputSchema = z.object({
    image: z.string().trim().min(1, '"image" must be a non-empty base64 string'),
    prompt: z.string().trim().min(1).optional(),
    negative_prompt: z.string().trim().min(1).optional()
});

/** Shared base output schema for image-processor tools. */
export const imageProcessorOutputSchema = z.object({
    image: z.string().trim().min(1),
    duration_ms: z.number().nonnegative(),
    model: z.string().trim().min(1)
});

/** Strongly typed base input inferred from the shared input schema. */
export type ImageProcessorInput = z.infer<typeof imageProcessorInputSchema>;

/** Strongly typed base output inferred from the shared output schema. */
export type ImageProcessorOutput = z.infer<typeof imageProcessorOutputSchema>;

/**
 * Options accepted by `createImageProcessorTool`.
 *
 * @template TInput - Tool input type.
 * @template TOutput - Tool output type.
 */
export interface ICreateImageProcessorToolOptions<
    TInput extends Record<string, unknown>,
    TOutput extends Record<string, unknown>
> {
    /** Unique tool identifier used by the agent (e.g. `"image_sketch"`). */
    id: string;

    /** Endpoint path appended to `IMAGE_PROCESSOR_URL` (e.g. `"/sketch"`). */
    endpoint: string;

    /** Human-readable tool description sent to the LLM. */
    description: string;

    /** Optional input schema; defaults to `imageProcessorInputSchema`. */
    inputSchema?: z.ZodType<TInput>;

    /** Optional output schema; defaults to `imageProcessorOutputSchema`. */
    outputSchema?: z.ZodType<TOutput>;
}

/**
 * Executes an HTTP request against the image processor and validates the JSON response.
 *
 * @template TOutput - Parsed response type inferred from `outputSchema`.
 * @param endpoint - Endpoint path (e.g. `"/sketch"`).
 * @param payload - Request body sent to the image processor.
 * @param outputSchema - Zod schema used to validate the response.
 * @returns Parsed and validated response payload.
 */
export async function requestImageProcessor<TOutput>(
    endpoint: string,
    payload: Record<string, unknown>,
    outputSchema: z.ZodType<TOutput>
): Promise<TOutput> {
    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => abortController.abort(), IMAGE_PROCESSOR_TIMEOUT_MS);

    try {
        const response = await fetch(`${IMAGE_PROCESSOR_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: abortController.signal
        });

        if (!response.ok) {
            const body = await response.text().catch(() => '');
            throw new Error(
                `Image processor ${endpoint} error: ${response.status} ${response.statusText}${body ? ` — ${body}` : ''}`
            );
        }

        const parsed = (await response.json()) as unknown;
        return outputSchema.parse(parsed);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(
                `Image processor ${endpoint} request timed out after ${IMAGE_PROCESSOR_TIMEOUT_MS}ms`
            );
        }

        throw error;
    } finally {
        clearTimeout(timeoutHandle);
    }
}

/**
 * Creates a tool for an image-processor endpoint with shared defaults.
 *
 * @template TInput - Input type for the created tool.
 * @template TOutput - Output type for the created tool.
 * @param options - Tool metadata and optional schema overrides.
 * @returns A fully configured image-processor tool instance.
 */
export function createImageProcessorTool<
    TInput extends Record<string, unknown> = ImageProcessorInput,
    TOutput extends Record<string, unknown> = ImageProcessorOutput
>(options: ICreateImageProcessorToolOptions<TInput, TOutput>) {
    const inputSchema =
        options.inputSchema ?? (imageProcessorInputSchema as unknown as z.ZodType<TInput>);
    const outputSchema =
        options.outputSchema ?? (imageProcessorOutputSchema as unknown as z.ZodType<TOutput>);

    return createTool<TInput, TOutput>({
        id: options.id,
        description: options.description,
        inputSchema,
        outputSchema,
        async execute(input): Promise<TOutput> {
            return requestImageProcessor(options.endpoint, input, outputSchema);
        }
    });
}
