# AI Coding Assistant Documentation

This docs site is built for **learning by doing**.

If you are a senior webdev and want fast clarity, use this order:

1. **Use the app**: [/use-the-application](/use-the-application)
2. **Understand packages**: [/packages/](/packages/)
3. **Understand theory**: [/theory/agent-loop](/theory/agent-loop)
4. **Run scenarios**: [/scenarios](/scenarios)

## What this project is

- Local-first TypeScript agent API (`POST /run`)
- Uses Ollama as the model backend
- Can call tools in a multi-step loop

## Core idea in one line

The agent loops: **think → choose tool → execute → think again** until done (max 5 steps).

## Quick links

- Run instructions: [/use-the-application](/use-the-application)
- Package map: [/packages/](/packages/)
- Tool-by-tool docs: [/packages/tools/](/packages/tools/)
