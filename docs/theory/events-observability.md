# Theory: Event-Driven Observability

The `events` package is the internal telemetry spine.

Instead of hard-coding logging everywhere, components emit events and observers react.

## Why it is useful

- Clear lifecycle tracking
- Easier debugging of multi-step behavior
- Looser coupling between core logic and monitoring concerns

## Event flow in this app

- Agent emits `agent:start`
- Each decision emits `agent:step`
- Tool outputs emit `tool:result` or `tool:error`
- Completion emits `agent:done` / `agent:max_steps` / `agent:error`

The API subscribes with `on("*", ...)` and logs all events.

## Current limitations

- In-memory only
- Process-local only
- Not durable

For production-grade scale, replace with persistent async infrastructure.
