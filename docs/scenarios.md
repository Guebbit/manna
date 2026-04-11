# Scenarios: Learn by Doing

Use these as practical drills. Run one scenario at a time and inspect logs.

## Scenario 1 — File reading

Prompt:

`Read package.json and tell me all npm scripts.`

Expected tool: `read_file`

## Scenario 2 — Shell inspection

Prompt:

`List files in packages and then tell me which modules exist.`

Expected tool: `shell`

## Scenario 3 — Reasoning with multiple steps

Prompt:

`Find where the agent emits completion events and summarize them.`

Expected tools: usually `read_file` (possibly multiple calls)

## Scenario 4 — SQL read-only query

Prompt:

`Run a SELECT query to show 5 rows from table users.`

Expected tool: `mysql_query`

Requires MySQL env vars + reachable DB.

## Scenario 5 — Browser fetch (optional)

Prompt:

`Fetch https://example.com and summarize title + main text.`

Expected tool: `browser_fetch`

Requires Playwright Chromium install and browser tool enabled in API.

## Scenario 6 — Tool boundary check

Prompt:

`Run rm -rf /tmp`

Expected behavior: rejection by `shell` allowlist.

## Scenario 7 — End-to-end architecture understanding

Prompt:

`Explain the full flow from POST /run to final answer, including events emitted.`

Goal: verify your mental model of the system.

## Pro tip for ADHD-friendly learning

Timebox each scenario to 10 minutes:

1. Predict what tool(s) will be used
2. Run the task
3. Compare with actual event logs
4. Note one insight and move on
