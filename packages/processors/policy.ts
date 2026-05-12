/**
 * Policy processor — enforces run-level guardrails via the processor hook API.
 *
 * ## Responsibilities
 *
 * - **Capability gates** — prevents write-tool calls when `allowWrite` is
 *   `false` by throwing `PolicyViolationError('E_PERMISSION_DENIED')` in
 *   `processOutputStep`.
 *
 * - **Consecutive-error budget** — tracks tool failures per run.  When
 *   the `consecutiveErrors` counter reaches the configured limit (defaults to
 *   `AGENT_CONSECUTIVE_ERROR_LIMIT` env var or `3`), throws
 *   `PolicyViolationError('E_CONSECUTIVE_ERRORS')` in the next
 *   `processInputStep`.
 *
 * - **Hard-stop error budget** — certain errors (path violations, permission
 *   denials) are terminal by definition.  Two such errors in one run trigger
 *   an immediate hard stop regardless of the consecutive-error limit.
 *
 * ## Usage
 *
 * ```typescript
 * import { createPolicyProcessor } from '../processors/policy';
 *
 * const policy = createPolicyProcessor({
 *   allowWrite: false,
 *   writeToolNames: new Set(['write_file', 'scaffold_project']),
 *   consecutiveErrorLimit: 3,
 * });
 *
 * agent.addProcessor(policy);
 * ```
 *
 * @module processors/policy
 */

import type {
    IProcessor,
    IProcessInputStepArgs,
    IProcessOutputStepArgs,
    IProcessToolResultArgs
} from './types';

/** Error codes that are considered "terminal" — two in one run triggers hard stop. */
const HARD_STOP_CODES = new Set(['E_PATH_OUTSIDE_ROOT', 'E_PERMISSION_DENIED']);

/**
 * Error thrown by `PolicyProcessor` hooks to signal an immediate hard stop.
 *
 * The agent loop catches this and transitions to the `HardStop` state instead
 * of allowing further steps or retries.
 */
export class PolicyViolationError extends Error {
    /** Typed error code from the error taxonomy. */
    public readonly code: string;

    /** Zero-based step index when the violation was detected. */
    public readonly step: number;

    /**
     * @param code    - Typed error code (e.g. `'E_CONSECUTIVE_ERRORS'`).
     * @param message - Human-readable explanation.
     * @param step    - Current step index.
     */
    constructor(code: string, message: string, step: number) {
        super(message);
        this.name = 'PolicyViolationError';
        this.code = code;
        this.step = step;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/** Options for {@link createPolicyProcessor}. */
export interface IPolicyProcessorOptions {
    /**
     * Whether write tools are permitted in this run.
     * When `false`, any attempt to call a write tool is blocked with
     * `E_PERMISSION_DENIED`.
     */
    allowWrite: boolean;

    /**
     * Set of tool names that require `allowWrite: true`.
     * Typically the names of `writeFileTool`, `scaffoldProjectTool`, etc.
     */
    writeToolNames: Set<string>;

    /**
     * Number of consecutive tool failures that trigger a hard stop.
     * Defaults to `3`.
     */
    consecutiveErrorLimit?: number;
}

/**
 * Create a `PolicyProcessor` instance configured for a single agent run.
 *
 * The processor is **stateful** — it tracks error counters across steps for
 * the lifetime of the agent it is attached to.  Create a new instance for
 * each independent run if separate accounting is required.
 *
 * @param options - Configuration options.
 * @returns An `IProcessor` implementation.
 */
export function createPolicyProcessor(options: IPolicyProcessorOptions): IProcessor {
    const { allowWrite, writeToolNames } = options;
    const consecutiveErrorLimit = options.consecutiveErrorLimit ?? 3;

    let consecutiveErrors = 0;
    let hardStopErrors = 0;

    return {
        /**
         * Pre-step hook — checks whether accumulated error counters have
         * crossed the hard-stop threshold.
         *
         * Throws `PolicyViolationError('E_CONSECUTIVE_ERRORS')` when
         * `consecutiveErrors >= consecutiveErrorLimit` (repeated recoverable failures).
         * Throws `PolicyViolationError('E_CONSECUTIVE_ERRORS')` when
         * `hardStopErrors >= 2` (two terminal errors — path violations or permission denials).
         */
        processInputStep(args: IProcessInputStepArgs): IProcessInputStepArgs {
            if (hardStopErrors >= 2) {
                throw new PolicyViolationError(
                    'E_CONSECUTIVE_ERRORS',
                    `Run terminated: ${hardStopErrors} terminal errors encountered ` +
                        `(E_PATH_OUTSIDE_ROOT / E_PERMISSION_DENIED). ` +
                        `Cannot recover from these errors — they are definitional, not transient.`,
                    args.stepNumber
                );
            }
            if (consecutiveErrors >= consecutiveErrorLimit) {
                throw new PolicyViolationError(
                    'E_CONSECUTIVE_ERRORS',
                    `Run terminated: ${consecutiveErrors} consecutive tool errors reached ` +
                        `the limit of ${consecutiveErrorLimit}. ` +
                        `The same or similar operations have failed repeatedly without progress.`,
                    args.stepNumber
                );
            }
            return args;
        },

        /**
         * Post-LLM, pre-tool hook — blocks write-tool calls when `allowWrite`
         * is `false`.
         *
         * Throws `PolicyViolationError('E_PERMISSION_DENIED')` and increments
         * the hard-stop counter so that repeated violations eventually
         * terminate the run.
         */
        processOutputStep(args: IProcessOutputStepArgs): IProcessOutputStepArgs {
            if (
                !allowWrite &&
                args.action !== 'none' &&
                writeToolNames.has(args.action)
            ) {
                hardStopErrors += 1;
                consecutiveErrors += 1;
                throw new PolicyViolationError(
                    'E_PERMISSION_DENIED',
                    `Tool "${args.action}" requires write access, but this run was started ` +
                        `without \`allowWrite: true\`. ` +
                        `The operation has been blocked and will not be retried.`,
                    args.stepNumber
                );
            }
            return args;
        },

        /**
         * Post-tool hook — updates consecutive-error and hard-stop counters
         * based on the tool result so that the next `processInputStep` call
         * can make an informed hard-stop decision.
         */
        processToolResult(args: IProcessToolResultArgs): void {
            if (args.success) {
                consecutiveErrors = 0;
            } else {
                consecutiveErrors += 1;
                if (args.errorCode && HARD_STOP_CODES.has(args.errorCode)) {
                    hardStopErrors += 1;
                }
            }
        }
    };
}
