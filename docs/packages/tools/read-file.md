# Tool: `read_file`

## Purpose

Read UTF-8 file content from disk.

## Input

```json
{ "path": "relative/or/absolute/path" }
```

## Output

UTF-8 file content string.

## Safety

Rejects access outside project root directory.

## Good test prompts

- "Read `package.json` and tell me available npm scripts."
- "Open `packages/agent/src/agent.ts` and summarize the loop."
