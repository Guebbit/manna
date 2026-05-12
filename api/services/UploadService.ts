/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageProcessorResponse } from '../models/ImageProcessorResponse';
import type { SuccessEnvelope } from '../models/SuccessEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
    /**
     * Classify or describe an uploaded image
     * Accepts a multipart file upload and classifies/describes the image using
     * the model configured in `TOOL_VISION_MODEL`. Max file size: 50 MB.
     *
     * @param formData
     * @returns any Classification result
     * @throws ApiError
     */
    public static uploadImageClassify(
        formData: {
            /**
             * Allowed image MIME types: image/jpeg, image/png, image/gif, image/webp.
             */
            file: Blob;
            /**
             * Optional prompt to guide the classification
             */
            prompt?: string;
            /**
             * Override the vision model (Ollama model name)
             */
            model?: string;
        },
    ): CancelablePromise<(SuccessEnvelope & {
        data?: {
            model?: string;
            /**
             * The model's textual description of the image.
             */
            response?: string;
        };
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/image-classify',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Transcribe an uploaded audio file
     * Accepts a multipart audio upload and returns a transcript using
     * `TOOL_STT_MODEL` (default `whisper`). Max file size: 50 MB.
     *
     * @param formData
     * @returns any Transcription result
     * @throws ApiError
     */
    public static uploadSpeechToText(
        formData: {
            /**
             * Allowed audio MIME types: audio/mpeg, audio/wav, audio/ogg, audio/webm, audio/mp4.
             */
            file: Blob;
            /**
             * Override the STT model
             */
            model?: string;
            /**
             * BCP-47 language code (e.g. "en", "fr")
             */
            language?: string;
            /**
             * Optional context prompt to improve transcription accuracy
             */
            prompt?: string;
        },
    ): CancelablePromise<(SuccessEnvelope & {
        data?: {
            /**
             * The STT model used.
             */
            model?: string;
            /**
             * Transcribed text.
             */
            text?: string;
        };
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/speech-to-text',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Generate sketch/line-art from an uploaded image
     * Accepts a multipart image upload and forwards it to the configured image processor (`IMAGE_PROCESSOR_URL/sketch`).
     * Optional `prompt` and `negative_prompt` are passed through to the processor.
     * Content negotiation:
     * - `Accept: image/png` returns raw PNG bytes
     * - otherwise returns JSON `{ image, duration_ms, model }`
     *
     * @param formData
     * @returns any Sketch generation result
     * @throws ApiError
     */
    public static uploadImageSketch(
        formData: {
            /**
             * Allowed image MIME types: image/jpeg, image/png, image/gif, image/webp.
             */
            file: Blob;
            /**
             * Optional positive prompt for sketch generation
             */
            prompt?: string;
            /**
             * Optional negative prompt for sketch generation
             */
            negative_prompt?: string;
        },
    ): CancelablePromise<(SuccessEnvelope & {
        data?: ImageProcessorResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/image-sketch',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Colorize an uploaded image
     * Accepts a multipart image upload and forwards it to the configured image processor (`IMAGE_PROCESSOR_URL/colorize`).
     * Optional `prompt` and `negative_prompt` are passed through to the processor.
     * Content negotiation:
     * - `Accept: image/png` returns raw PNG bytes
     * - otherwise returns JSON `{ image, duration_ms, model }`
     *
     * @param formData
     * @returns any Colorization result
     * @throws ApiError
     */
    public static uploadImageColorize(
        formData: {
            /**
             * Allowed image MIME types: image/jpeg, image/png, image/gif, image/webp.
             */
            file: Blob;
            /**
             * Optional positive prompt for colorization
             */
            prompt?: string;
            /**
             * Optional negative prompt for colorization
             */
            negative_prompt?: string;
        },
    ): CancelablePromise<(SuccessEnvelope & {
        data?: ImageProcessorResponse;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/image-colorize',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
    /**
     * Extract text from an uploaded PDF
     * Accepts a multipart PDF upload and returns the extracted text plus page count.
     * Max file size: 50 MB.
     *
     * @param formData
     * @returns any Extracted PDF content
     * @throws ApiError
     */
    public static uploadReadPdf(
        formData: {
            /**
             * Allowed document MIME type: application/pdf.
             */
            file: Blob;
        },
    ): CancelablePromise<(SuccessEnvelope & {
        data?: {
            /**
             * Full extracted text
             */
            text?: string;
            /**
             * Total number of pages in the PDF
             */
            pageCount?: number;
        };
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload/read-pdf',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid request body or parameters`,
                500: `Internal server error (LLM failure, Qdrant unavailable, etc.)`,
            },
        });
    }
}
