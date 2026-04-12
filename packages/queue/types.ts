/**
 * Job queue types.
 *
 * A job is the unit of work submitted to the queue.
 * Each job carries its task string, per-job options, and lifecycle metadata.
 */

/** Life-cycle states a job passes through. */
export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";

/**
 * Execution presets that expand into concrete per-job options.
 *
 * - `normal`    — default interactive use; inherits process-level defaults.
 * - `all_night` — unattended overnight batch; raises step budget, sets a long
 *                 timeout, and tolerates more tool failures before giving up.
 */
export type RunMode = "normal" | "all_night";

/**
 * Per-job configuration knobs.
 *
 * All fields are optional — unset fields fall back to the selected RunMode
 * defaults, and then to the process-level env-var defaults.
 */
export interface JobOptions {
  /** Enable write tools (write_file, scaffold_project). Default: false. */
  allowWrite?: boolean;

  /**
   * Maximum reasoning steps for this job.
   * Overrides AGENTS_MAX_STEPS for this specific job.
   * all_night default: 25.  normal default: AGENTS_MAX_STEPS (5).
   */
  maxSteps?: number;

  /**
   * Abort the job after this many consecutive tool failures in a row.
   * all_night default: 5.  normal default: no limit.
   */
  maxToolFailures?: number;

  /**
   * Wall-clock timeout in milliseconds for the entire job.
   * all_night default: 8 hours.  normal default: no timeout.
   */
  timeoutMs?: number;

  /**
   * Execution mode preset.  `all_night` raises step budget and tolerates
   * longer runs; `normal` uses the interactive defaults.
   * Default: "normal".
   */
  mode?: RunMode;
}

/** A job record as stored in the queue. */
export interface Job {
  /** UUID v4 identifier. */
  id: string;

  /** The task string forwarded to Agent.run(). */
  task: string;

  /** Options with which this job was submitted. */
  options: JobOptions;

  /** Current life-cycle state. */
  status: JobStatus;

  /** ISO-8601 timestamp when the job was submitted. */
  createdAt: string;

  /** ISO-8601 timestamp when processing started (set when status → running). */
  startedAt?: string;

  /** ISO-8601 timestamp when processing ended (set when status → done/failed/cancelled). */
  finishedAt?: string;

  /** Final answer from the agent (set when status → done). */
  result?: string;

  /** Error message or cancellation reason (set when status → failed/cancelled). */
  error?: string;
}

/** Aggregate counts used by the stats endpoint. */
export interface QueueStats {
  queued: number;
  running: number;
  done: number;
  failed: number;
  cancelled: number;
  total: number;
}
