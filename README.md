# AI Coding Assistant

Personal local-first agent system built with TypeScript, Node.js, and Ollama.

## What this project is (and is not)

- **Open WebUI (`http://localhost:3000`)** is a generic chat interface for Ollama models.
- **This project** is an API (`http://localhost:3001`) that runs an **agentic loop** with tools.

If you only use Open WebUI, you are chatting with models directly.
If you call this project's `/run` endpoint, the model can reason over multiple steps and use tools.

## Architecture

```text
ai-assistant/
├── apps/
│   └── api/          ← Express API entry point (`POST /run`)
├── packages/
│   ├── agent/        ← Agent loop
│   ├── events/       ← Event bus
│   ├── llm/          ← Ollama wrapper ("lim" in your note likely means this)
│   ├── memory/       ← In-memory short-term memory
│   └── tools/        ← Tool interface + built-in tools
├── infra/
│   └── podman/       ← Ollama + Open WebUI compose stack
└── data/             ← Runtime data (gitignored)
```

## Quick start

### 1) Install dependencies

```bash
npm install
```

### 2) Start Ollama + Open WebUI

```bash
cd infra/podman
cp .env.example .env
# fill LINUX_USERNAME and WEBUI_SECRET_KEY

docker compose --env-file .env up -d
```

- Open WebUI: `http://localhost:3000`
- Ollama API: `http://localhost:11434`

### 3) Start this project API

```bash
cd /path/to/ai-assistant
npm run dev
```

Default API URL: `http://localhost:3001`

### 4) Run a task through the agent

```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"task":"List files in the current directory"}'
```

Write mode is opt-in per request:

```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"task":"Scaffold a new project from template react-ts","allowWrite":true}'
```

## How tools are used

Tools are configured in `apps/api/index.ts` when creating the `Agent`.

<details>
<summary>Current enabled tools (click to expand)</summary>

- `read_file` — read files inside project root
- `shell` — run allowlisted shell commands
- `mysql_query` — run read-only `SELECT` queries
- `browser_fetch` — fetch and summarize web page content
- `image_classify` — classify/describe images with a vision model
- `semantic_search` — rank files/text by semantic similarity
- `speech_to_text` — transcribe audio using an OpenAI-compatible endpoint
- `read_pdf` — extract text from PDFs
- `code_autocomplete` — produce IDE-style completion suggestions
- `write_file` — write files under generated projects root (**disabled by default**)
- `scaffold_project` — copy a boilerplate into generated projects root (**disabled by default**)

</details>

`browser_fetch` is enabled by default.
Chromium is installed automatically during `npm install` via `postinstall`.
`write_file` and `scaffold_project` are available only when request body sets `"allowWrite": true`.

## How the agentic loop works

Implemented in `packages/agent/agent.ts`.

For each task:

1. Build prompt (task + context + memory + tool descriptions)
2. Route the current step to a model profile (`fast`, `reasoning`, `code`, `default`)
3. Ask selected model for strict JSON output: `thought`, `action`, `input`
4. If `action !== "none"`, execute selected tool
5. Append tool result to context
6. Repeat up to max steps (default 5; override with `AGENTS_MAX_STEPS` env var or per-job `maxSteps`)
7. Stop when `action: "none"`, max steps reached, max consecutive tool failures reached, or job is cancelled/timed out

Lifecycle events are emitted through `packages/events` and logged by the API.

## Environment variables

### Application/API variables

Used by Node app (shell environment, `.env` loader, container env, etc.):

- `OLLAMA_BASE_URL` (default `http://localhost:11434`)
- `OLLAMA_MODEL` (default `llama3`)
- `OLLAMA_EMBED_MODEL` (default `nomic-embed-text`)
- `AGENT_MODEL_ROUTER_MODE` (`rules` or `model`, default `rules`)
- `AGENT_MODEL_ROUTER_MODEL` (router classifier model for `model` mode)
- `AGENT_MODEL_FAST` (profile model)
- `AGENT_MODEL_REASONING` (profile model)
- `AGENT_MODEL_CODE` (profile model)
- `AGENT_MODEL_DEFAULT` (fallback profile model)
- `AGENTS_MAX_STEPS` (default `5`) — maximum reasoning steps per task; raise to `20`–`25` for complex overnight work
- `AGENTS_ALL_NIGHT_MAX_STEPS` (default `25`) — step budget applied when `mode: "all_night"` is set and `maxSteps` is not explicitly specified
- `AGENT_QUEUE_CONCURRENCY` (default `1`) — number of jobs processed in parallel; keep at `1` on single-GPU hardware
- `TOOL_VISION_MODEL` (default `llava-llama3`)
- `TOOL_STT_MODEL` (default `whisper`)
- `TOOL_IDE_MODEL` (default `starcoder2`)
- `PORT` (default `3001`)
- `MYSQL_HOST` (default `localhost`)
- `MYSQL_PORT` (default `3306`)
- `MYSQL_USER` (default `root`)
- `MYSQL_PASSWORD` (default empty)
- `MYSQL_DATABASE` (default empty)
- `QDRANT_URL` (default `http://localhost:6333`)
- `QDRANT_COLLECTION` (example: `agent_memory`)
- `LOG_ENABLED` (`true`/`false`, default `true`)
- `LOG_LEVEL` (default `info`, for example: `error`, `warn`, `info`, `debug`)
- `LOG_PRETTY` (`true`/`false`, default `false`; when `false`, logs are JSON)
- `BOILERPLATE_ROOT` (default `data/boilerplates`)
- `PROJECT_OUTPUT_ROOT` (default `data/generated-projects`)

### Infra compose variables

`infra/podman/.env` is only for the compose stack (Ollama/Open WebUI/model-loader), mainly:

- `LINUX_USERNAME`
- `WEBUI_SECRET_KEY`
- `ENABLE_SIGNUP`

So yes: currently only compose-specific vars are defined there.
App/API vars are separate and can be exported in your shell or managed with your preferred env workflow.

## Memory now uses Qdrant by default

The memory package now uses a hybrid approach:

- recent in-process ring buffer (up to 20 entries)
- semantic recall from Qdrant using Ollama embeddings

Runtime requirements:

1. Start Qdrant:
   ```bash
   docker run -d \
     --name qdrant \
     -p 6333:6333 \
     -v $(pwd)/data/qdrant:/qdrant/storage \
     qdrant/qdrant
   ```
2. Configure env vars (optional if defaults are fine):
   ```bash
   export QDRANT_URL="http://localhost:6333"
   export QDRANT_COLLECTION="agent_memory"
   export OLLAMA_EMBED_MODEL="nomic-embed-text"
   ```

If Qdrant is unavailable, the app continues with local in-memory recent memory only.

## Why compose has no database

Correct: `infra/podman/docker-compose.yml` does **not** include MySQL.

Reason: MySQL is optional and only needed if you want `mysql_query` to hit a real DB.
You can either:

- point to an external/local MySQL instance via `MYSQL_*`, or
- add a MySQL service to compose if you want everything in one stack.

## Development

```bash
npm run typecheck
npm run build
npm run dev
```

## IDE-focused direct endpoints

These endpoints are separate from `/run` and do not use the agent loop:

- `POST /autocomplete` — low-latency cursor-time completion (`prefix` + optional `suffix`)
- `POST /lint-conventions` — deterministic findings first (TypeScript + conventions), then optional LLM enrichment
- `POST /page-review` — full current file/page review with categorized suggestions

Example:

```bash
curl -X POST http://localhost:3001/autocomplete \
  -H "Content-Type: application/json" \
  -d '{"prefix":"function add(a, b) {","suffix":"}","language":"javascript"}'
```

## Job queue endpoints

Submit tasks to a background queue so they are processed one at a time without blocking your terminal.
Useful for batches and for leaving long tasks running overnight.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/queue/submit` | Enqueue a single task |
| `POST` | `/queue/submit/batch` | Enqueue multiple tasks at once |
| `GET` | `/queue/jobs` | List all jobs + aggregate stats |
| `GET` | `/queue/jobs/:id` | Get a single job's full record |
| `DELETE` | `/queue/jobs/:id` | Cancel a queued or running job |
| `GET` | `/queue/stats` | Aggregate counts only |

### Single task

```bash
curl -X POST http://localhost:3001/queue/submit \
  -H "Content-Type: application/json" \
  -d '{"task":"Summarize all TypeScript files in packages/agent"}'
```

Response:
```json
{ "jobId": "3fa85f64-...", "status": "queued", "createdAt": "2026-04-12T20:00:00Z" }
```

### Batch submission

```bash
curl -X POST http://localhost:3001/queue/submit/batch \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      "Read README.md and list all env vars",
      "Read package.json and summarize all scripts",
      "Find all TODO comments in packages/"
    ]
  }'
```

### All-night mode

```bash
curl -X POST http://localhost:3001/queue/submit \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Thoroughly review every TypeScript file in packages/ and list all potential issues",
    "mode": "all_night",
    "allowWrite": false
  }'
```

`all_night` automatically applies:
- `maxSteps`: 25 (override with `AGENTS_ALL_NIGHT_MAX_STEPS`)
- `maxToolFailures`: 5 consecutive failures before giving up
- `timeoutMs`: 8 hours

### Per-job overrides

All options can be specified explicitly regardless of mode:

```bash
curl -X POST http://localhost:3001/queue/submit \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Deep-analyse the agent loop and produce a detailed report",
    "maxSteps": 20,
    "maxToolFailures": 3,
    "timeoutMs": 7200000
  }'
```

### Poll for result

```bash
curl http://localhost:3001/queue/jobs/3fa85f64-...
```

```json
{
  "id": "3fa85f64-...",
  "status": "done",
  "result": "The agent found ...",
  "createdAt": "...",
  "startedAt": "...",
  "finishedAt": "..."
}
```

### Cancel a job

```bash
curl -X DELETE http://localhost:3001/queue/jobs/3fa85f64-...
```

## Overnight / all-night profile (RTX 4090 single-GPU)

When you want to let the system work unattended overnight, combine these settings:

**Environment variables to export before `npm run dev`:**

```bash
# Raise step budget globally (the queue all_night preset uses 25 by default)
export AGENTS_MAX_STEPS=10

# Only process one queue job at a time — safe for single-GPU setups
export AGENT_QUEUE_CONCURRENCY=1

# Use your best quality models (the PC will be idle anyway)
export AGENT_MODEL_CODE=qwen2.5-coder:32b
export AGENT_MODEL_REASONING=deepseek-r1:32b
export AGENT_MODEL_FAST=qwen3:4b
export AGENT_MODEL_DEFAULT=qwen3:32b
```

**In `infra/podman/docker-compose.yml`, the `ollama` service already has conservative resource caps:**

```yaml
environment:
  - OLLAMA_NUM_THREADS=1   # limits CPU thread use so host stays responsive
  - OLLAMA_KEEP_ALIVE=5m   # unloads model after 5 min idle
mem_limit: 16g
cpus: "8.0"
```

These are already set. You do not need to change them for overnight use.

**Then submit your batch with `all_night` mode:**

```bash
curl -X POST http://localhost:3001/queue/submit/batch \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": ["task 1", "task 2", "task 3"],
    "mode": "all_night"
  }'
```

Each job gets 25 steps, 5-failure tolerance, and an 8-hour timeout.  
The queue processes them one at a time overnight.  
Check results in the morning with `GET /queue/jobs`.

## Package docs

See:

- `packages/README.md`
- `packages/agent/README.md`
- `packages/events/README.md`
- `packages/llm/README.md`
- `packages/memory/README.md`
- `packages/tools/README.md`

## VitePress documentation site

This repository also includes a VitePress docs site in `/docs`.

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
```
