/**
 * Operating mode helpers — maps `AGENT_OPERATING_MODE` to per-run limits.
 *
 * Three explicit operating modes replace the previous single-step-limit
 * configuration knob.  The mode is set via the `AGENT_OPERATING_MODE`
 * environment variable; `"standard"` is the default.
 *
 * | Mode         | Target hardware                                   |
 * |--------------|---------------------------------------------------|
 * | `low-spec`   | 8–16 GB RAM, CPU-only or small GPU, models ≤ 8B   |
 * | `standard`   | 16–32 GB RAM, mid-range GPU, models 7–13B         |
 * | `high-trust` | 32+ GB VRAM, large models (34B+) or known-reliable|
 *
 * @module shared/operating-mode
 */

/** The three recognised operating modes. */
export type OperatingMode = 'low-spec' | 'standard' | 'high-trust';

/** Per-mode runtime limits surfaced to the agent loop. */
export interface IOperatingModeConfig {
    /** Maximum number of reasoning steps per run. */
    maxSteps: number;
    /** Maximum number of tool calls per step. */
    maxToolCalls: number;
    /** Number of consecutive tool errors that trigger a hard stop. */
    consecutiveErrorLimit: number;
    /** Whether self-debug on step exhaustion is enabled. */
    selfDebugEnabled: boolean;
}

/** Mode-specific defaults. Values can be overridden by individual env vars. */
const MODE_DEFAULTS: Record<OperatingMode, IOperatingModeConfig> = {
    'low-spec': {
        maxSteps: 5,
        maxToolCalls: 3,
        consecutiveErrorLimit: 2,
        selfDebugEnabled: false
    },
    standard: {
        maxSteps: 20,
        maxToolCalls: 10,
        consecutiveErrorLimit: 3,
        selfDebugEnabled: true
    },
    'high-trust': {
        maxSteps: 50,
        maxToolCalls: 20,
        consecutiveErrorLimit: 5,
        selfDebugEnabled: true
    }
};

/**
 * Parse and validate `AGENT_OPERATING_MODE`.
 *
 * @returns The resolved {@link OperatingMode}.  Falls back to `"standard"`
 *          when the env var is absent or unrecognised.
 */
export function resolveOperatingMode(): OperatingMode {
    const raw = process.env.AGENT_OPERATING_MODE?.trim().toLowerCase();
    if (raw === 'low-spec' || raw === 'standard' || raw === 'high-trust') {
        return raw;
    }
    return 'standard';
}

/**
 * Return the effective per-mode configuration, with individual env-var
 * overrides applied.
 *
 * Individual env vars (`AGENTS_MAX_STEPS`, `AGENT_MAX_TOOL_CALLS`,
 * `AGENT_CONSECUTIVE_ERROR_LIMIT`) win over the mode default when explicitly
 * set to a positive integer — so operators can fine-tune without changing
 * the mode.
 *
 * @returns The resolved {@link IOperatingModeConfig}.
 */
export function resolveOperatingModeConfig(): IOperatingModeConfig {
    const mode = resolveOperatingMode();
    const defaults = MODE_DEFAULTS[mode];

    const parseEnvironmentInt = (key: string): number | undefined => {
        const value = process.env[key];
        if (!value) return undefined;
        const n = Number.parseInt(value, 10);
        return Number.isFinite(n) && n > 0 ? n : undefined;
    };

    return {
        maxSteps: parseEnvironmentInt('AGENTS_MAX_STEPS') ?? defaults.maxSteps,
        maxToolCalls: parseEnvironmentInt('AGENT_MAX_TOOL_CALLS') ?? defaults.maxToolCalls,
        consecutiveErrorLimit:
            parseEnvironmentInt('AGENT_CONSECUTIVE_ERROR_LIMIT') ?? defaults.consecutiveErrorLimit,
        selfDebugEnabled: defaults.selfDebugEnabled
    };
}
