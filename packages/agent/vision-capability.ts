/**
 * Vision capability detection for the agent loop.
 *
 * Reads `AGENT_MULTIMODAL_MODELS` (comma-separated substrings) and exposes
 * `isMultimodalModel` so the agent can decide whether to pass raw image bytes
 * directly to the LLM in addition to the vision-description text.
 *
 * No hardcoded model names — all configuration lives in the env var.
 *
 * @module agent/vision-capability
 */

/** Comma-separated substrings that identify multimodal models (case-insensitive). */
const MULTIMODAL_SUBSTRINGS: string[] = (process.env.AGENT_MULTIMODAL_MODELS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

/**
 * Return true when `modelName` matches any configured multimodal substring.
 *
 * @param modelName - The resolved Ollama model name (e.g. `"llava:13b"`).
 */
export function isMultimodalModel(modelName: string): boolean {
    if (MULTIMODAL_SUBSTRINGS.length === 0) return false;
    const lower = modelName.toLowerCase();
    return MULTIMODAL_SUBSTRINGS.some((sub) => lower.includes(sub));
}
