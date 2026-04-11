# Theory: Prompt, Context, and Memory

The agent prompt is assembled from multiple blocks:

- **Task**: what user wants now
- **Memory**: recent useful outcomes from earlier runs
- **Context**: step-by-step outputs in current run
- **Tool list**: what actions are currently possible

## Practical interpretation

- Task gives direction
- Context gives local progress
- Memory gives short-term continuity across tasks
- Tool list constrains action space

## Why memory is capped

Unbounded memory inflates prompts and hurts focus.

Current implementation keeps max 20 entries and returns recent N (default 10).

## Prompt engineering choice

The model is forced to return one strict JSON object:

- `thought`
- `action`
- `input`

This reduces ambiguous outputs and simplifies runtime parsing.
