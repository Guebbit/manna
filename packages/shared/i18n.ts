/**
 * Internationalisation (i18n) initialisation helper.
 *
 * Wraps i18next and exposes a single `t()` translation function.
 * Initialisation is gated on the presence of locale resource files —
 * the function is safe to call even if i18next has already been
 * initialised (it is idempotent after the first call).
 *
 * Environment variables:
 * - `MANNA_DEFAULT_LOCALE`  (default `"en"`) — active language.
 * - `MANNA_FALLBACK_LOCALE` (default `"en"`) — fallback language.
 *
 * @module shared/i18n
 */

import i18next from 'i18next';

/** Whether i18next has been successfully initialised. */
let initialised = false;

/**
 * Initialise i18next with the provided locale resources.
 *
 * Idempotent — safe to call multiple times; only the first call
 * triggers the actual setup.
 *
 * @param resources - Locale resource map, keyed by language code.
 * @returns A promise that resolves when i18next is ready.
 */
export const initI18n = (
    resources: Record<string, { translation: Record<string, unknown> }>
): Promise<void> => {
    if (initialised) return Promise.resolve();

    return i18next
        .init({
            lng: process.env.MANNA_DEFAULT_LOCALE ?? 'en',
            fallbackLng: process.env.MANNA_FALLBACK_LOCALE ?? 'en',
            resources,
            interpolation: { escapeValue: false }
        })
        .then(() => {
            initialised = true;
        });
};

/**
 * Translate a key using the currently active i18next instance.
 *
 * Falls back to the raw key string if i18next is not yet initialised
 * or if the key is not found, so callers never receive `undefined`.
 *
 * @param key - The translation key (dot-notation supported).
 * @param options - Optional i18next interpolation variables.
 * @returns The translated string, or `key` if not found.
 */
export const t = (key: string, options?: Record<string, unknown>): string => {
    if (!initialised) return key;
    return i18next.t(key, options) as string;
};
