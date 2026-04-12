# agent — The Brain

## What

Makes decisions in a loop.

## Role

**Think → Pick a tool → Run the tool → Think again**

## Repeats

Up to **5 steps** per task.

## Uses

- LLM (`packages/llm`)
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

- `action: "none"` => done
- max steps reached => returns fallback message

## Where in code

- `packages/agent/agent.ts`
