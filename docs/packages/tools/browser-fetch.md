# Tool: `browser_fetch`

## Purpose

Fetch title and visible page text using Playwright (Chromium, headless).

## Input

```json
{ "url": "https://example.com" }
```

## Output

```json
{ "title": "...", "content": "..." }
```

`content` is truncated to first 5000 chars.

## Safety

- URL must be valid
- Protocol must be `http` or `https`

## Prerequisite

```bash
npx playwright install chromium
```

Then enable `browserTool` in `apps/api/src/index.ts`.

## Good test prompts

- "Fetch the title and summary text from https://example.com"
