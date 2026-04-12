# Job Queue & All-Night Mode

The job queue lets you submit tasks to a background worker so you can:

- fire and forget — submit a task and poll for the result later
- batch multiple tasks — process them one at a time without manual coordination
- run overnight — raise the step budget and set a long timeout while keeping the PC comfortable

## Quick start

### Submit a single task

```bash
curl -X POST http://localhost:3001/queue/submit \
  -H "Content-Type: application/json" \
  -d '{"task":"Summarize the agent loop in 5 bullet points"}'
```

```json
{ "jobId": "3fa85f64-...", "status": "queued", "createdAt": "2026-04-12T20:00:00Z" }
```

### Poll until done

```bash
curl http://localhost:3001/queue/jobs/3fa85f64-...
```

```json
{
  "id": "3fa85f64-...",
  "task": "Summarize the agent loop in 5 bullet points",
  "status": "done",
  "result": "The agent loop works by ...",
  "createdAt": "...",
  "startedAt": "...",
  "finishedAt": "..."
}
```

## All endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/queue/submit` | Enqueue one task |
| `POST` | `/queue/submit/batch` | Enqueue up to 50 tasks with shared options |
| `GET` | `/queue/jobs` | List all jobs with status and aggregate stats |
| `GET` | `/queue/jobs/:id` | Full record for one job (includes result) |
| `DELETE` | `/queue/jobs/:id` | Cancel a queued or running job |
| `GET` | `/queue/stats` | Aggregate counts only |

## Request body fields

All fields except `task` / `tasks` are optional.

| Field | Type | Default | Description |
|---|---|---|---|
| `task` | `string` | — | The task to run (single submit) |
| `tasks` | `string[]` | — | Tasks to run (batch submit, 1–50) |
| `mode` | `"normal"` \| `"all_night"` | `"normal"` | Execution preset |
| `allowWrite` | `boolean` | `false` | Enable write tools (`write_file`, `scaffold_project`) |
| `maxSteps` | `number` | mode default | Step ceiling for this job |
| `maxToolFailures` | `number` | mode default | Abort after N consecutive tool failures |
| `timeoutMs` | `number` | mode default | Wall-clock timeout in ms |

### Mode defaults

| Setting | `normal` | `all_night` |
|---|---|---|
| `maxSteps` | `AGENTS_MAX_STEPS` (5) | `AGENTS_ALL_NIGHT_MAX_STEPS` (25) |
| `maxToolFailures` | unlimited | 5 |
| `timeoutMs` | none | 8 hours |

Explicit per-job values always override mode defaults.

## Batch submission

```bash
curl -X POST http://localhost:3001/queue/submit/batch \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      "Read packages/agent/agent.ts and summarize it",
      "Read packages/llm/ollama.ts and summarize it",
      "Read packages/memory/memory.ts and summarize it"
    ]
  }'
```

Returns an array of job objects, one per task.  Jobs are processed in submission
order using the configured concurrency (default 1).

## All-night mode

Designed for unattended overnight runs.  Submit before you go to bed, check
results in the morning.

```bash
curl -X POST http://localhost:3001/queue/submit/batch \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      "Deeply analyse every file in packages/agent/ and list all improvement opportunities",
      "Read all tool files and produce a consolidated quality report",
      "Check packages/memory/ for potential memory leaks or performance issues"
    ],
    "mode": "all_night"
  }'
```

Each job automatically gets 25 steps, 5-failure tolerance, and an 8-hour timeout.

## Cancelling a job

```bash
# Cancel while queued — removes from the pending list immediately
curl -X DELETE http://localhost:3001/queue/jobs/3fa85f64-...

# Cancel while running — sends abort signal; stops at next inter-step checkpoint
curl -X DELETE http://localhost:3001/queue/jobs/3fa85f64-...
```

Response: `{ "cancelled": true }`

## Checking the full queue

```bash
curl http://localhost:3001/queue/jobs
```

```json
{
  "jobs": [
    { "id": "...", "taskPreview": "Read packages/...", "mode": "all_night", "status": "done", ... },
    { "id": "...", "taskPreview": "Find all TODO ...",  "mode": "normal",    "status": "running", ... }
  ],
  "stats": { "queued": 0, "running": 1, "done": 1, "failed": 0, "cancelled": 0, "total": 2 }
}
```

## Queue stats only

```bash
curl http://localhost:3001/queue/stats
```

```json
{ "queued": 3, "running": 1, "done": 12, "failed": 0, "cancelled": 1, "total": 17 }
```

## Overnight profile: recommended setup (RTX 4090)

### Step 1 — Set env vars before starting the API

```bash
# Raise interactive default (optional; all_night already uses 25 by default)
export AGENTS_MAX_STEPS=10

# One job at a time — safe for single-GPU setups
export AGENT_QUEUE_CONCURRENCY=1

# Use your best quality models — the PC will be idle anyway
export AGENT_MODEL_CODE=qwen2.5-coder:32b
export AGENT_MODEL_REASONING=deepseek-r1:32b
export AGENT_MODEL_FAST=qwen3:4b
export AGENT_MODEL_DEFAULT=qwen3:32b

npm run dev
```

### Step 2 — Compose already has conservative Ollama limits

In `infra/podman/docker-compose.yml` the Ollama service is already configured with:

```yaml
environment:
  - OLLAMA_NUM_THREADS=1   # limits CPU threads
  - OLLAMA_KEEP_ALIVE=5m   # unloads idle model after 5 min
mem_limit: 16g
cpus: "8.0"
```

You do not need to change these for overnight use.

### Step 3 — Submit your overnight batch

```bash
curl -X POST http://localhost:3001/queue/submit/batch \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": ["task 1", "task 2", "task 3"],
    "mode": "all_night"
  }'
```

### Step 4 — Check results in the morning

```bash
curl http://localhost:3001/queue/jobs | jq '.stats'
# { "queued": 0, "running": 0, "done": 3, ... }

curl http://localhost:3001/queue/jobs/<id>
# { "status": "done", "result": "..." }
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `AGENTS_MAX_STEPS` | `5` | Global default step budget per run |
| `AGENTS_ALL_NIGHT_MAX_STEPS` | `25` | Step budget for `all_night` mode when `maxSteps` is not set |
| `AGENT_QUEUE_CONCURRENCY` | `1` | Max parallel jobs; keep at 1 on single-GPU hardware |

## Job lifecycle events

The queue emits events on the shared event bus (visible in API logs):

| Event | When |
|---|---|
| `queue:job_queued` | Job submitted |
| `queue:job_started` | Processing begins |
| `queue:job_done` | Finished successfully |
| `queue:job_failed` | Finished with an error |
| `queue:job_cancelled` | Cancelled (queued or during run) |
