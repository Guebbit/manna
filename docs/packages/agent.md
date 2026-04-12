# agent — The Brain

## What

Makes decisions in a loop and routes each step to the most appropriate model profile.

## Role

**Think → Pick a tool → Run the tool → Think again**

## Repeats

Up to **N steps** per task where N defaults to `5` and is controlled by:

1. `AGENTS_MAX_STEPS` environment variable (process-wide default)
2. `maxSteps` option passed to `Agent.run()` (per-call override, used by the queue)

## Per-run safety controls

`Agent.run(task, options?)` accepts:

| Option | Type | Default | Purpose |
|---|---|---|---|
| `maxSteps` | `number` | `AGENTS_MAX_STEPS` (5) | Step ceiling for this run |
| `maxToolFailures` | `number` | unlimited | Abort after N consecutive tool failures |
| `timeoutMs` | `number` | none | Wall-clock timeout in ms |
| `signal` | `AbortSignal` | none | External cancellation (used by the job queue) |

## Uses

- LLM (`packages/llm`)
- Model router (`packages/agent/src/model-router.ts`)
- Memory (`packages/memory`)
- Tools (`packages/tools`)
- Events (`packages/events`)

## Input/Output contract

- Input: task string from API
- Each LLM step must return strict JSON:
  - `thought`
  - `action`
  - `input`
- Output: final answer string

## Stop conditions

- `action: "none"` → done
- max steps reached → returns fallback message
- max consecutive tool failures reached → returns fallback message
- AbortSignal fired (timeout or external cancel) → returns cancellation message

## Where in code

- `packages/agent/agent.ts`
- `packages/agent/src/model-router.ts`
