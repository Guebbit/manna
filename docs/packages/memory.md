# memory — Short-term Storage

## What

Stores recent context in memory (RAM).

## Role

"Here is what happened recently" for the agent prompt.

## Behavior

- Non-persistent
- Capacity: **20** entries max
- Oldest entries are evicted first

## API

- `addMemory(entry)`
- `getMemory(n = 10)`
- `clearMemory()`

## Used by

- `agent` while building prompts and saving completed outcomes

## Where in code

- `packages/memory/src/memory.ts`
