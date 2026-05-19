/**
 * Shared LLM response-parsing helpers.
 *
 * Several modules (agent, model-router, decomposer, verification,
 * graph extractor) need to strip Markdown code fences from LLM
 * output before parsing the JSON payload.  Centralising this logic
 * eliminates five copy-pasted `replace(/```…/g, '').trim()` calls
 * and satisfies the DRY principle.
 *
 * @module shared/llm-response
 */

/**
 * Strip Markdown code fences that some LLMs wrap around JSON output.
 *
 * Anchored to the start/end of the string so fences that appear *inside*
 * the content (rare but possible) are left intact, avoiding accidental
 * corruption of legitimate payloads.
 *
 * @param raw - Raw LLM response string, possibly wrapped in fences.
 * @returns The cleaned string with leading/trailing code fences removed.
 */
export function stripCodeFences(raw: string): string {
    return raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();
}
