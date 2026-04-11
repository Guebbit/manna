# tools — The Toolbox

## What

Tools are the things the agent can **do**, not just think about.

## Role

Agent decides tool + input, runtime executes tool, result returns to agent context.

## Tool contract

Every tool provides:

- `name`
- `description`
- `execute(input)`

## Included tools

- `read_file` — read UTF-8 files under project root
- `shell` — run allowlisted shell commands with timeout
- `mysql_query` — execute read-only `SELECT` queries
- `browser_fetch` — fetch page title and visible text (Playwright)
- `linkedin_profile_lookup` — LinkedIn profile lookup via OAuth + official API
- `x_profile_lookup` — X profile lookup via OAuth + official API
- `github_profile_lookup` — GitHub profile lookup via OAuth + official API

## Security boundaries

- `read_file` blocks traversal outside project root
- `shell` only allows selected base commands
- `mysql_query` only permits `SELECT`
- `browser_fetch` only permits `http`/`https`
- social tools require connected OAuth tokens per provider
- social tools apply provider rate limiting and basic PII redaction

## Tool pages

- [/packages/tools/read-file](/packages/tools/read-file)
- [/packages/tools/shell](/packages/tools/shell)
- [/packages/tools/mysql-query](/packages/tools/mysql-query)
- [/packages/tools/browser-fetch](/packages/tools/browser-fetch)
- [/packages/tools/social-accounts](/packages/tools/social-accounts)
