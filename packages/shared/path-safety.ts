/**
 * Shared path-safety helpers.
 *
 * Several tools (fs.read, fs.write, image.classify, semantic.search,
 * speech.to.text, pdf.read, project.scaffold) need to resolve user-supplied
 * paths while ensuring they stay inside a trusted root directory.
 *
 * Centralising this logic satisfies the Single Responsibility Principle
 * and removes the copy-pasted `resolveSafePath` / `resolveInsideRoot`
 * functions that previously lived in each tool file.
 *
 * @module shared/path-safety
 */

import path from 'path';

/**
 * Typed error thrown when a user-supplied path escapes a trusted root.
 *
 * Carries a `code` field so the agent harness can distinguish a path
 * violation from generic tool failures and take an immediate hard-stop
 * decision without retrying.
 */
export class PathSafetyError extends Error {
    /** Typed error code — always `'E_PATH_OUTSIDE_ROOT'`. */
    public readonly code = 'E_PATH_OUTSIDE_ROOT' as const;

    /** The path the caller attempted to access. */
    public readonly attemptedPath: string;

    /** The root the path was required to stay within. */
    public readonly root: string;

    /**
     * @param message      - Human-readable error message.
     * @param attemptedPath - The path that violated the constraint.
     * @param root          - The root the path was required to stay within.
     */
    constructor(message: string, attemptedPath: string, root: string) {
        super(message);
        this.name = 'PathSafetyError';
        this.attemptedPath = attemptedPath;
        this.root = root;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Verify that `resolved` does not escape the given `root` directory.
 *
 * @param resolved      - The already-resolved absolute path to validate.
 * @param root          - The trusted root directory (absolute path).
 * @param errorLabel    - Label used in the thrown error message (e.g. "project root").
 * @throws {PathSafetyError} When `resolved` is outside `root`.
 */
function assertInsideRoot(resolved: string, root: string, errorLabel: string): void {
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
        throw new PathSafetyError(
            `Access denied: path is outside the ${errorLabel}`,
            resolved,
            root
        );
    }
}

/**
 * Resolve `userPath` relative to the current working directory and
 * verify that the result does not escape the project root.
 *
 * Throws an `Error` if the resolved path is outside the project root
 * (e.g. via `../` traversal).
 *
 * @param userPath - Relative or absolute path supplied by the caller.
 * @returns The fully resolved, root-safe absolute path.
 * @throws {Error} When the path escapes the project root.
 */
export function resolveSafePath(userPath: string): string {
    const root = path.resolve(process.cwd());
    const resolved = path.resolve(root, userPath);
    assertInsideRoot(resolved, root, 'project root');
    return resolved;
}

/**
 * Resolve `userPath` relative to an arbitrary `root` directory and
 * verify that the result does not escape that root.
 *
 * This variant is used by tools that operate within a specific
 * sub-directory (e.g. `PROJECT_OUTPUT_ROOT` or `BOILERPLATE_ROOT`).
 *
 * @param root     - The trusted root directory (must be an absolute path).
 * @param userPath - Relative path supplied by the caller.
 * @returns The fully resolved, root-safe absolute path.
 * @throws {Error} When the path escapes the allowed root.
 */
export function resolveInsideRoot(root: string, userPath: string): string {
    const resolved = path.resolve(root, userPath);
    assertInsideRoot(resolved, root, 'allowed root');
    return resolved;
}
