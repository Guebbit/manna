# AI env vars quick context

Canonical environment-variable documentation lives in VitePress docs (`docs/`).

Use these pages as source of truth:

- `docs/use-the-application.md`
- `docs/model-selection.md`
- `docs/endpoint-map.md`
- `docs/infra/ollama-notes.md`
- `docs/theory/operating-modes.md`

AI quick reminders only:

- API/model: `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `AGENT_MODEL_FAST`, `AGENT_MODEL_REASONING`, `AGENT_MODEL_CODE`, `AGENT_MODEL_ROUTER_MODEL`
- Runtime limits: `AGENTS_MAX_STEPS`, `AGENT_MAX_TOOL_CALLS`, `AGENT_BUDGET_MAX_DURATION_MS`, `AGENT_BUDGET_MAX_CONTEXT_CHARS`
- Operating mode: `AGENT_OPERATING_MODE` (`low-spec` | `standard` | `high-trust`; default `standard`) — sets per-mode defaults for `AGENTS_MAX_STEPS`, `AGENT_MAX_TOOL_CALLS`, `AGENT_CONSECUTIVE_ERROR_LIMIT`
- Harness guardrails: `AGENT_CONSECUTIVE_ERROR_LIMIT` (consecutive tool errors before hard stop; mode default 2/3/5)
- Tooling/infra frequently referenced: `TOOL_VISION_MODEL`, `TOOL_STT_MODEL`, `TOOL_IDE_MODEL`, `QDRANT_URL`, `QDRANT_COLLECTION`, `PORT`

Do not treat this file as a full catalog; update and trust VitePress docs for authoritative values and behavior.
