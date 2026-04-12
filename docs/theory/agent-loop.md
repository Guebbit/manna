# Theory: Agent Loop Mental Model

Think of the system as a controlled reasoning loop:

1. Build prompt from task + memory + context + tools
2. Route the step to a model profile
3. Ask selected model for strict JSON decision
4. Execute tool if needed
5. Append result to context
6. Repeat until done or step limit

## Why this works

- The model does planning
- Tools do deterministic execution
- Context turns previous outputs into next-step inputs

## Why the step limit matters

- Prevents runaway loops
- Caps cost and latency on interactive runs
- Forces concise planning behavior
- Configurable: set `AGENTS_MAX_STEPS` (default `5`) or pass `maxSteps` per-job

For unattended overnight runs, raise the limit via the queue's `all_night` mode or
set `maxSteps` explicitly.  The job queue enforces a per-job timeout as an additional
safety net so a single stuck job cannot block everything else.

## Failure modes (normal)

- Invalid JSON from model
- Unknown tool request
- Tool runtime errors

The loop is built to recover and continue when possible.

## Additional abort conditions

Beyond max steps, a run stops when:
- `maxToolFailures` consecutive tool failures occur (default: no limit; configurable per-job)
- `timeoutMs` wall-clock timeout fires (default: none; configurable per-job)
- External `AbortSignal` is triggered (used by the job queue's cancel endpoint)
